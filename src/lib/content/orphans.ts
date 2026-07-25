import fs from 'node:fs/promises';
import path from 'node:path';
import {
  announcementsCollection,
  devotionalsCollection,
  ministriesCollection,
  seriesCollection,
} from './collections';
import { getUploadsDir } from './store';

/**
 * Una imagen recién subida todavía no está referenciada: el formulario se
 * manda después. Sin esta ventana, un guardado de otra persona la borraría
 * mientras la primera todavía está escribiendo el devocional.
 */
const GRACE_MS = 60 * 60 * 1000;

let sweeping = false;

/**
 * Recorre el contenido buscando rutas `/uploads/...`.
 *
 * Es genérico a propósito: mira todos los strings en vez de una lista de
 * campos. Si mañana se suma otro campo de imagen, esto lo toma solo. Con una
 * lista fija, olvidarse de agregarlo ahí significaría borrar una imagen en uso.
 */
const collectReferences = async () => {
  const contents = await Promise.all([
    devotionalsCollection.read(),
    announcementsCollection.read(),
    seriesCollection.read(),
    ministriesCollection.read(),
  ]);

  const references = new Set<string>();

  const visit = (value: unknown) => {
    if (typeof value === 'string') {
      if (value.startsWith('/uploads/')) references.add(value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (value && typeof value === 'object') {
      Object.values(value).forEach(visit);
    }
  };

  visit(contents);
  return references;
};

const listFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    })
  );

  return nested.flat();
};

/** Borra las carpetas por año/mes que quedaron sin archivos. */
const pruneEmptyDirs = async (dir: string, root: string) => {
  if (dir === root) return;

  try {
    const entries = await fs.readdir(dir);
    if (entries.length > 0) return;

    await fs.rmdir(dir);
    await pruneEmptyDirs(path.dirname(dir), root);
  } catch {
    // Otra petición pudo haberla borrado o vuelto a llenar. No importa.
  }
};

export interface SweepResult {
  deleted: string[];
  referenced: number;
  skippedRecent: number;
}

/**
 * Borra las imágenes que ya no usa ningún contenido.
 *
 * Los nombres son hashes del contenido, así que la misma foto usada en dos
 * lugares es un solo archivo. Por eso no alcanza con borrar la imagen de lo que
 * se elimina: hay que confirmar que no la referencie nadie más.
 */
export const sweepOrphanUploads = async ({ dryRun = false } = {}): Promise<SweepResult> => {
  const uploadsDir = getUploadsDir();

  let files: string[];
  try {
    files = await listFiles(uploadsDir);
  } catch {
    // Todavía no se subió ninguna imagen.
    return { deleted: [], referenced: 0, skippedRecent: 0 };
  }

  // Si el contenido no se puede leer, las referencias saldrían vacías y esto
  // borraría todas las fotos del sitio. Ante la duda, no se toca nada.
  let references: Set<string>;
  try {
    references = await collectReferences();
  } catch (error) {
    console.error('[content] no se pudo leer el contenido, se cancela la limpieza:', error);
    return { deleted: [], referenced: 0, skippedRecent: 0 };
  }

  const now = Date.now();
  const deleted: string[] = [];
  let skippedRecent = 0;

  for (const file of files) {
    const publicPath = `/uploads/${path.relative(uploadsDir, file).split(path.sep).join('/')}`;
    if (references.has(publicPath)) continue;

    const stats = await fs.stat(file);
    if (now - stats.mtimeMs < GRACE_MS) {
      skippedRecent += 1;
      continue;
    }

    if (!dryRun) {
      await fs.unlink(file);
      await pruneEmptyDirs(path.dirname(file), uploadsDir);
    }

    deleted.push(publicPath);
  }

  return { deleted, referenced: references.size, skippedRecent };
};

/**
 * Limpieza en segundo plano después de guardar. No se espera ni puede hacer
 * fallar la petición: si algo sale mal, el peor caso es que sobre un archivo.
 */
export const scheduleOrphanSweep = () => {
  if (sweeping) return;
  sweeping = true;

  void sweepOrphanUploads()
    .then(({ deleted }) => {
      if (deleted.length > 0) {
        console.log(`[content] se borraron ${deleted.length} imágenes sin usar.`);
      }
    })
    .catch((error) => {
      console.warn('[content] no se pudieron limpiar las imágenes sin usar:', error);
    })
    .finally(() => {
      sweeping = false;
    });
};
