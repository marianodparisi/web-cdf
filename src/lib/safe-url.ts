/**
 * Links y videos que vienen del panel. Lo que carga un editor termina en un
 * `href` o en un `<iframe src>` del sitio público, que corre en el mismo origen
 * que /admin: un `javascript:...` ahí alcanzaba para que, al abrirlo un admin,
 * el script creara otro admin. Se valida al guardar y otra vez al mostrar,
 * para cubrir lo que ya estaba guardado.
 */

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'youtu.be',
]);

/** Id de 11 caracteres de un link de YouTube, o null si no es uno válido. */
export function youtubeId(value?: string | null): string | null {
  if (!value) return null;
  const text = value.trim();
  if (YOUTUBE_ID.test(text)) return text;

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

  const parts = url.pathname.split('/').filter(Boolean);
  const candidate =
    url.hostname.toLowerCase() === 'youtu.be'
      ? parts[0]
      : url.searchParams.get('v') ??
        (['live', 'shorts', 'embed', 'v'].includes(parts[0] ?? '') ? parts[1] : undefined);

  return candidate && YOUTUBE_ID.test(candidate) ? candidate : null;
}

/** URL de embed armada siempre por nosotros; nunca devuelve el texto cargado. */
export function youtubeEmbedUrl(value?: string | null): string | null {
  const id = youtubeId(value);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/**
 * Link seguro para un `href`: ruta del sitio (`/algo`, `#algo`) o URL
 * http(s), mailto o tel. Cualquier otra cosa (`javascript:`, `data:`, `//otro`)
 * devuelve null.
 */
export function safeHref(value?: string | null): string | null {
  if (!value) return null;
  const text = value.trim();
  // El navegador ignora tabs y saltos dentro de un href ("/\t/otro" = "//otro").
  if (!text || /[\u0000-\u001F\u007F]/.test(text)) return null;
  if (text.startsWith('#')) return text;
  if (text.startsWith('/')) return /^\/[/\\]/.test(text) ? null : text;

  try {
    const url = new URL(text);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? text : null;
  } catch {
    return null;
  }
}

export const HREF_INVALIDO =
  'El link tiene que ser una ruta del sitio (por ejemplo /misiones) o una dirección que empiece con https://.';
