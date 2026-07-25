import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Almacén de contenido en disco.
 *
 * El contenido del sitio son unos pocos KB (ministerios, devocionales,
 * anuncios). Vive como JSON en un directorio persistente fuera del build, así
 * el backup es copiar una carpeta por FTP y no hace falta una base de datos.
 *
 * `dist/` se borra en cada deploy, por eso el directorio de datos tiene que
 * estar afuera. En producción se apunta con CDF_DATA_DIR.
 */
const getDataDir = () => {
  const configured = process.env.CDF_DATA_DIR;
  return configured ? path.resolve(configured) : path.resolve(process.cwd(), '.data');
};

export const getContentDir = () => path.join(getDataDir(), 'content');
export const getHistoryDir = () => path.join(getDataDir(), 'history');
export const getUploadsDir = () => path.join(getDataDir(), 'uploads');

const ensureDir = async (dir: string) => {
  await fs.mkdir(dir, { recursive: true });
};

interface CollectionOptions<T> {
  /** Nombre del archivo sin extensión. También nombra la carpeta de historial. */
  name: string;
  /** Contenido inicial. Se escribe la primera vez y se usa si el archivo falla. */
  seed: T[];
}

export interface Collection<T> {
  read: () => Promise<T[]>;
  write: (items: T[], author?: string) => Promise<void>;
  /** Lee, transforma y guarda en una sola operación serializada. */
  update: (mutate: (items: T[]) => T[] | Promise<T[]>, author?: string) => Promise<T[]>;
}

export const createCollection = <T>({ name, seed }: CollectionOptions<T>): Collection<T> => {
  const fileName = `${name}.json`;

  // Cache en memoria validado contra el mtime del archivo. El stat cuesta
  // microsegundos y hace que una edición hecha directo por FTP se vea sin
  // reiniciar el server.
  let cache: { mtimeMs: number; items: T[] } | null = null;

  // Los guardados se encadenan para que dos ediciones simultáneas no se pisen.
  let writeQueue: Promise<unknown> = Promise.resolve();

  const filePath = () => path.join(getContentDir(), fileName);

  const persist = async (items: T[], author?: string) => {
    const target = filePath();
    await ensureDir(path.dirname(target));

    const payload = `${JSON.stringify(items, null, 2)}\n`;

    // Escritura atómica: archivo temporal y rename. Si el proceso se cae a
    // mitad, el JSON viejo queda intacto en vez de truncado.
    const tempPath = `${target}.tmp-${process.pid}-${Date.now()}`;
    await fs.writeFile(tempPath, payload, 'utf-8');
    await fs.rename(tempPath, target);

    const stats = await fs.stat(target);
    cache = { mtimeMs: stats.mtimeMs, items };

    await snapshot(payload, author);
  };

  /**
   * Copia con fecha de cada guardado. Al salir de git perdimos el historial
   * como red de seguridad; esto lo devuelve y son KB por versión.
   */
  const snapshot = async (payload: string, author?: string) => {
    try {
      const dir = path.join(getHistoryDir(), name);
      await ensureDir(dir);

      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const suffix = author ? `--${author.replace(/[^a-zA-Z0-9_-]/g, '')}` : '';
      await fs.writeFile(path.join(dir, `${stamp}${suffix}.json`), payload, 'utf-8');
    } catch (error) {
      // El historial es una comodidad, no puede hacer fallar un guardado.
      console.warn(`[content] no se pudo guardar el historial de ${name}:`, error);
    }
  };

  const read = async () => {
    const target = filePath();

    let stats;
    try {
      stats = await fs.stat(target);
    } catch {
      // Primer arranque: sembramos el archivo con el contenido actual del sitio.
      await persist(seed);
      return seed;
    }

    if (cache && cache.mtimeMs === stats.mtimeMs) return cache.items;

    try {
      const raw = await fs.readFile(target, 'utf-8');
      const parsed = JSON.parse(raw) as T[];
      if (!Array.isArray(parsed)) throw new Error('El archivo no contiene una lista');

      cache = { mtimeMs: stats.mtimeMs, items: parsed };
      return parsed;
    } catch (error) {
      // Archivo corrupto o ilegible: el sitio sigue en pie con lo último bueno
      // que tengamos, o con el contenido original. Nunca se cae por esto.
      console.error(`[content] no se pudo leer ${fileName}, uso el contenido de respaldo:`, error);
      return cache?.items ?? seed;
    }
  };

  const write = async (items: T[], author?: string) => {
    const task = writeQueue.then(() => persist(items, author));
    writeQueue = task.catch(() => undefined);
    await task;
  };

  const update = async (mutate: (items: T[]) => T[] | Promise<T[]>, author?: string) => {
    const task = writeQueue.then(async () => {
      const next = await mutate(await read());
      await persist(next, author);
      return next;
    });

    writeQueue = task.catch(() => undefined);
    return task;
  };

  return { read, write, update };
};
