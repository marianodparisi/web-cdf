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
  // Sin `accion` es "guardar": así lo mandaban los formularios anteriores.
  const action = readText(form, 'accion') || 'guardar';
  const current = await announcementsCollection.read();

  const eyebrow = readText(form, 'eyebrow');
  const title = readText(form, 'title');
  const description = readText(form, 'description');
  const href = readText(form, 'href');

  const readImage = async () => {
    const uploaded = form.get('image');
    if (!(uploaded instanceof File) || uploaded.size === 0) return undefined;
    return saveUploadedImage(uploaded);
  };

  // Nuevo: va primero, que es lo que se ve antes en el inicio.
  if (action === 'crear') {
    if (!eyebrow || !title || !description || !href) {
      return backTo(PATH, { error: 'Faltan datos. Todos los campos de texto son obligatorios.' });
    }
    let image: string | undefined;
    try {
      image = await readImage();
    } catch (error) {
      const message = error instanceof UploadError ? error.message : 'No se pudo guardar la imagen.';
      return backTo(PATH, { error: message });
    }
    if (!image) return backTo(PATH, { error: 'Falta el flyer o la foto del anuncio.' });

    await announcementsCollection.update(
      (items) => [{ eyebrow, title, description, href, image, alt: title }, ...items],
      session.username
    );
    return backTo(PATH, { ok: 'Se publicó el anuncio. Ya se ve en el inicio.' });
  }

  const index = Number(readText(form, 'indice'));
  if (!Number.isInteger(index) || index < 0 || index >= current.length) {
    return backTo(PATH, { error: 'Ese anuncio ya no existe.' });
  }

  if (action === 'borrar') {
    await announcementsCollection.update(
      (items) => items.filter((_, itemIndex) => itemIndex !== index),
      session.username
    );
    scheduleOrphanSweep();
    return backTo(PATH, { ok: 'Se borró el anuncio.' });
  }

  if (action === 'subir') {
    if (index > 0) {
      await announcementsCollection.update((items) => {
        const next = [...items];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        return next;
      }, session.username);
    }
    return backTo(PATH, { ok: 'Se cambió el orden.' });
  }

  if (action !== 'guardar') {
    return backTo(PATH, { error: 'No se entendió la acción.' });
  }

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
