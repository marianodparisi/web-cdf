import fs from 'node:fs/promises';
import type { APIRoute } from 'astro';
import { resolveUploadPath } from '../../lib/content/uploads';

/**
 * Sirve las imágenes subidas desde el panel.
 *
 * Viven fuera de `public/` porque `dist/` se borra en cada deploy y se
 * llevaría puestas todas las fotos que cargó la gente.
 */
export const GET: APIRoute = async ({ params }) => {
  const requested = params.file;
  if (!requested) return new Response(null, { status: 404 });

  const filePath = resolveUploadPath(requested);
  if (!filePath) return new Response(null, { status: 403 });

  try {
    const file = await fs.readFile(filePath);

    return new Response(new Uint8Array(file), {
      headers: {
        'Content-Type': 'image/webp',
        // El nombre del archivo es el hash de su contenido, así que nunca
        // cambia de significado y se puede cachear para siempre.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
};
