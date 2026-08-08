/**
 * Estado de las transmisiones del canal de YouTube, sin API key.
 *
 * Resuelve tres situaciones distintas, que era el punto:
 *  - El canal esta al aire ahora  -> se muestra la transmision en curso.
 *  - Hay un vivo programado        -> ese NO se muestra: todavia no paso nada.
 *                                     Se muestra el anterior, el ultimo hecho.
 *  - No hay nada programado        -> se muestra el ultimo vivo hecho.
 *
 * ─── De donde sale cada cosa ──────────────────────────────────────────────
 * `/@handle/live` devuelve la transmision destacada del canal: la que esta al
 * aire, o si no la proxima programada, o si no la ultima hecha. Trae dos
 * banderas explicitas —`isLiveNow` e `isUpcoming`— asi que el estado no se
 * deduce comparando fechas, que fallaria con un vivo que arranca tarde.
 *
 * `/@handle/streams` solo se pide cuando la destacada resulto ser una
 * programada: es la unica situacion donde hace falta buscar la anterior.
 *
 * Por que no el RSS del canal: no distingue un vivo de una subida normal, no
 * dice si esta al aire y lista igual los programados.
 *
 * Por que no la Data API v3: pide key y `search.list` gasta 100 de las 10.000
 * unidades diarias por consulta. Si hace falta mas —listar programados, contar
 * espectadores— ese es el camino.
 *
 * ─── Fragilidad ───────────────────────────────────────────────────────────
 * Esto lee el HTML de YouTube, no un contrato publico. Se usan las senales mas
 * estables que hay: `canonical`, `og:title` y `og:image` son meta tags
 * estandar. `isLiveNow` e `isUpcoming` salen del JSON interno; si desaparecen
 * se asume "ni en vivo ni programado", que degrada a mostrar la destacada.
 * Nada de esto lee texto en español: los carteles tipo "Transmitido hace 6
 * dias" cambian con el idioma del servidor.
 */

/** El estado de "en vivo" tiene que llegar rapido: no sirve enterarse a la media hora. */
const TTL_MS = 90 * 1000;

/** Si YouTube tarda, la pagina sigue sin el bloque. Nunca la bloquea. */
const TIMEOUT_MS = 4000;

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export interface Transmision {
  id: string;
  /** null si YouTube no expuso el `og:title`. Quien lo use tiene que aguantarlo. */
  title: string | null;
  url: string;
  /** 1280x720, 16:9. Solo existe si subieron en HD. */
  thumbnail: string;
  /** 320x180, tambien 16:9. Este existe siempre. */
  thumbnailFallback: string;
  /** Transmitiendo en este momento. */
  isLive: boolean;
}

export interface EstadoVivos {
  /** La que se muestra: la de ahora, o la ultima hecha. Nunca una programada. */
  ultima: Transmision | null;
  /** Fecha de la proxima programada, si hay una. En ISO. */
  proximaProgramada: string | null;
}

const readEnv = (name: string) => {
  const metaEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return metaEnv?.[name] ?? process.env[name];
};

let cache: { at: number; estado: EstadoVivos } | null = null;

const entidades: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
};

const decodificar = (t: string) =>
  t
    .replace(/\\u0026/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&(amp|lt|gt|quot|#39|apos);/g, (m) => entidades[m] ?? m);

const armar = (id: string, title: string | null, isLive: boolean): Transmision => ({
  id,
  title,
  url: `https://www.youtube.com/watch?v=${id}`,
  thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  thumbnailFallback: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
  isLive,
});

async function pedir(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      /* Sin User-Agent de navegador, YouTube devuelve una version reducida que
         no trae los meta tags. */
      headers: { 'User-Agent': UA, 'Accept-Language': 'es-AR,es;q=0.9' },
    });
    return res.ok ? await res.text() : null;
  } catch {
    /* Timeout, DNS, YouTube caido. */
    return null;
  }
}

const VACIO: EstadoVivos = { ultima: null, proximaProgramada: null };

/**
 * El handle tal como lo espera la URL. Tolera las tres formas en que se puede
 * haber cargado la variable de entorno: `@CorazondeFuego`, sin arroba, o ya
 * percent-encoded. Sin esto, un handle con acento cargado codificado se volvia
 * a codificar y quedaba `%25C3%25B3`.
 */
function normalizarHandle(bruto: string): string {
  const limpio = bruto.trim().replace(/^@/, '').replace(/\/+$/, '');
  const yaCodificado = /%[0-9A-Fa-f]{2}/.test(limpio);
  return `@${yaCodificado ? limpio : encodeURIComponent(limpio)}`;
}

async function resolver(handle: string): Promise<EstadoVivos> {
  const base = `https://www.youtube.com/${normalizarHandle(handle)}`;

  const html = await pedir(`${base}/live`);
  if (!html) return VACIO;

  const idMatch = html.match(
    /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})"/
  );
  if (!idMatch) return VACIO;

  const destacadaId = idMatch[1];
  const tituloMatch = html.match(/<meta property="og:title" content="([^"]*)"/);
  const titulo = tituloMatch ? decodificar(tituloMatch[1]) : null;

  const isLive = /"isLiveNow":true/.test(html);
  const isUpcoming = !isLive && /"isUpcoming":true/.test(html);

  if (isLive) return { ultima: armar(destacadaId, titulo, true), proximaProgramada: null };

  /* Unix en segundos. Solo tiene sentido leerlo si esta programada: en una ya
     terminada apunta a cuando arranco. */
  const prog = html.match(/"scheduledStartTime":"(\d+)"/);
  const proximaProgramada =
    isUpcoming && prog ? new Date(Number(prog[1]) * 1000).toISOString() : null;

  if (!isUpcoming) return { ultima: armar(destacadaId, titulo, false), proximaProgramada: null };

  /* La destacada es una programada: todavia no paso nada, asi que hay que ir a
     buscar la anterior. Es el unico caso que pide una segunda request. */
  const lista = await pedir(`${base}/streams`);
  if (!lista) return { ultima: null, proximaProgramada };

  /* Se leen los ids en el orden del documento —la pestaña ya viene ordenada de
     mas nueva a mas vieja— y se saltea la programada. No se parsea el
     `ytInitialData` entero: es cerca de un mega de JSON para sacar dos datos. */
  const ids = [...new Set([...lista.matchAll(/"contentId":"([A-Za-z0-9_-]{11})"/g)].map((m) => m[1]))];
  const titulos = [...lista.matchAll(/"lockupMetadataViewModel":\{"title":\{"content":"((?:[^"\\]|\\.)*)"/g)].map(
    (m) => m[1]
  );

  const i = ids.findIndex((id) => id !== destacadaId);
  if (i === -1) return { ultima: null, proximaProgramada };

  return {
    ultima: armar(ids[i], titulos[i] ? decodificar(titulos[i]) : null, false),
    proximaProgramada,
  };
}

/**
 * Estado de las transmisiones. `ultima` nunca es una programada. Devuelve todo
 * en null si no hay `YOUTUBE_HANDLE` o si YouTube no responde: quien lo llama
 * tiene que poder seguir sin esto.
 */
export async function getEstadoVivos(): Promise<EstadoVivos> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.estado;

  const handle = readEnv('YOUTUBE_HANDLE');
  if (!handle) return VACIO;

  const estado = await resolver(handle);
  /* Se cachea igual cuando falla: reintentar en cada visita convertiria una
     caida de YouTube en un home lento. */
  cache = { at: Date.now(), estado };
  return estado;
}
