import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { getUploadsDir } from './store';

const MAX_INPUT_BYTES = 20 * 1024 * 1024;

/** Ancho suficiente para los heroes del sitio sin dejar archivos enormes. */
const MAX_WIDTH = 1600;

export class UploadError extends Error {}

/**
 * Procesa una imagen subida desde el panel y devuelve su ruta pública.
 *
 * Las fotos llegan de celulares: 4-6 MB y a veces acostadas. `rotate()` va
 * primero para aplicar la orientación del EXIF, porque si no la imagen se
 * guarda girada. Al reescribirla en WebP también se descartan los metadatos,
 * que en fotos de campamentos suelen traer coordenadas GPS.
 *
 * El original no se conserva: es lo que haría explotar el disco.
 */
export const saveUploadedImage = async (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    throw new UploadError('El archivo tiene que ser una imagen.');
  }

  if (file.size > MAX_INPUT_BYTES) {
    throw new UploadError('La imagen es demasiado grande. El máximo es 20 MB.');
  }

  const input = Buffer.from(await file.arrayBuffer());

  let output: Buffer;
  try {
    output = await sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    throw new UploadError('No se pudo procesar la imagen. Probá con otro archivo.');
  }

  // El nombre sale del contenido: subir dos veces la misma foto no duplica el
  // archivo, y permite cachear para siempre porque el nombre nunca se reusa.
  const hash = crypto.createHash('sha256').update(output).digest('hex').slice(0, 16);
  const now = new Date();
  const folder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  const relativePath = `${folder}/${hash}.webp`;
  const target = path.join(getUploadsDir(), relativePath);

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, output);

  return `/uploads/${relativePath}`;
};

/**
 * Resuelve una ruta pedida a la ruta real dentro del directorio de subidas.
 * Devuelve null si se escapa del directorio (`..`, rutas absolutas, symlinks).
 */
export const resolveUploadPath = (requestedPath: string) => {
  const uploadsDir = getUploadsDir();
  const resolved = path.resolve(uploadsDir, requestedPath);

  const prefix = uploadsDir.endsWith(path.sep) ? uploadsDir : uploadsDir + path.sep;
  if (!resolved.startsWith(prefix)) return null;

  return resolved;
};
