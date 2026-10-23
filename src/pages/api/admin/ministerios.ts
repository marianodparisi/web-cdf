import type { APIRoute } from 'astro';
import { ministriesCollection } from '../../../lib/content/collections';
import { readEndDate } from '../../../lib/content/expiry';
import { UploadError, saveUploadedImage } from '../../../lib/content/uploads';
import { scheduleOrphanSweep } from '../../../lib/content/orphans';
import { backTo, canEdit, getSession } from '../../../lib/admin-guard';
import { ministrySectionKey } from '../../../lib/content/sections';

const readText = (form: FormData, field: string) => String(form.get(field) ?? '').trim();

/**
 * Guarda lo único que se edita de un ministerio desde el panel: la novedad
 * (título, texto, imagen y "Mostrar hasta") y la foto de la última actividad.
 *
 * Nombre, área, resumen, logo, textos, horarios, lugar y contactos se cambian
 * sólo por código (pedido del usuario), para todos los roles. Este endpoint
 * no los lee aunque vengan en el POST: siempre conserva los que están.
 */
export const POST: APIRoute = async (context) => {
  const session = getSession(context.locals);
  const form = await context.request.formData();

  // El slug viaja en un campo oculto y nunca se edita: es la URL pública y de
  // él depende también el permiso de sección.
  const slug = readText(form, 'slug');
  const path = `/admin/ministerios/${slug}`;

  const current = (await ministriesCollection.read()).find((item) => item.slug === slug);
  if (!current) {
    return backTo('/admin', { error: 'Ese ministerio no existe.' });
  }

  if (!canEdit(session, ministrySectionKey(slug))) {
    return backTo('/admin', { error: `No tenés acceso a ${current.name}.` });
  }

  const noticeTitle = readText(form, 'noticeTitle');

  const uploadImage = async (field: string, fallback?: string) => {
    const uploaded = form.get(field);
    if (!(uploaded instanceof File) || uploaded.size === 0) return fallback;
    return saveUploadedImage(uploaded);
  };

  let photo = current.photo;
  let noticeImage = current.noticeImage;

  try {
    photo = await uploadImage('photo', current.photo);
    noticeImage = await uploadImage('noticeImage', current.noticeImage);
  } catch (error) {
    const message = error instanceof UploadError ? error.message : 'No se pudo guardar la imagen.';
    return backTo(path, { error: message });
  }

  await ministriesCollection.update(
    (items) =>
      items.map((item) =>
        item.slug === slug
          ? {
              ...item,
              photo,
              noticeTitle,
              noticeText: readText(form, 'noticeText'),
              // Vaciar el título borra el aviso entero: si no, la imagen vieja
              // reaparecería sola en el próximo aviso que se cargue.
              noticeImage: noticeTitle ? noticeImage : undefined,
              noticeEndDate: noticeTitle ? readEndDate(form.get('noticeEndDate')) : undefined,
            }
          : item
      ),
    session.username
  );

  scheduleOrphanSweep();
  return backTo(path, { ok: 'Se guardó. Ya se ve en el sitio.' });
};
