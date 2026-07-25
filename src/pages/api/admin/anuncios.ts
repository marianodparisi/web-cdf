import type { APIRoute } from 'astro';
import { announcementsCollection } from '../../../lib/content/collections';
import { UploadError, saveUploadedImage } from '../../../lib/content/uploads';
import { scheduleOrphanSweep } from '../../../lib/content/orphans';
import { backTo, canEdit, getSession } from '../../../lib/admin-guard';

const PATH = '/admin/anuncios';

const readText = (form: FormData, field: string) => String(form.get(field) ?? '').trim();

export const POST: APIRoute = async (context) => {
  const session = getSession(context.locals);
  if (!canEdit(session, 'anuncios')) {
    return backTo('/admin', { error: 'No tenés acceso a los anuncios.' });
  }

  const form = await context.request.formData();
  const index = Number(readText(form, 'indice'));

  const current = await announcementsCollection.read();
  if (!Number.isInteger(index) || index < 0 || index >= current.length) {
    return backTo(PATH, { error: 'Ese anuncio ya no existe.' });
  }

  const eyebrow = readText(form, 'eyebrow');
  const title = readText(form, 'title');
  const description = readText(form, 'description');
  const href = readText(form, 'href');

  if (!eyebrow || !title || !description || !href) {
    return backTo(PATH, { error: 'Faltan datos. Todos los campos de texto son obligatorios.' });
  }

  let image = current[index].image;
  const uploaded = form.get('image');
  if (uploaded instanceof File && uploaded.size > 0) {
    try {
      image = await saveUploadedImage(uploaded);
    } catch (error) {
      const message = error instanceof UploadError ? error.message : 'No se pudo guardar la imagen.';
      return backTo(PATH, { error: message });
    }
  }

  await announcementsCollection.update(
    (items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, eyebrow, title, description, href, image, alt: title } : item
      ),
    session.username
  );

  scheduleOrphanSweep();
  return backTo(PATH, { ok: 'Se guardó. Ya se ve en el inicio.' });
};
