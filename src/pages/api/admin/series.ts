import type { APIRoute } from 'astro';
import type { SermonSeries } from '../../../data/series';
import { seriesCollection } from '../../../lib/content/collections';
import { UploadError, saveUploadedImage } from '../../../lib/content/uploads';
import { scheduleOrphanSweep } from '../../../lib/content/orphans';
import { backTo, canEdit, getSession } from '../../../lib/admin-guard';

const PATH = '/admin/series';

const readText = (form: FormData, field: string) => String(form.get(field) ?? '').trim();

export const POST: APIRoute = async (context) => {
  const session = getSession(context.locals);
  if (!canEdit(session, 'series')) {
    return backTo('/admin', { error: 'No tenés acceso a las series.' });
  }

  const form = await context.request.formData();
  const action = readText(form, 'accion');

  if (action === 'crear') {
    await seriesCollection.update(
      (items) => [
        ...items,
        {
          title: 'Serie nueva',
          subtitle: 'Completá los datos',
          label: 'Serie anterior',
          image: '',
          href: '',
          description: '',
        },
      ],
      session.username
    );

    return backTo(PATH, { ok: 'Se agregó al final de la lista. Completala y guardala.' });
  }

  const index = Number(readText(form, 'indice'));
  const current = await seriesCollection.read();

  if (!Number.isInteger(index) || index < 0 || index >= current.length) {
    return backTo(PATH, { error: 'Esa serie ya no existe.' });
  }

  if (action === 'borrar') {
    await seriesCollection.update(
      (items) => items.filter((_, itemIndex) => itemIndex !== index),
      session.username
    );

    scheduleOrphanSweep();
    return backTo(PATH, { ok: 'Se borró.' });
  }

  if (action === 'destacar') {
    await seriesCollection.update((items) => {
      const promoted = items[index];
      const rest = items.filter((_, itemIndex) => itemIndex !== index);

      // La etiqueta va atada a la posición: la primera es la actual.
      return [
        { ...promoted, label: 'Serie actual' },
        ...rest.map((item) => ({ ...item, label: 'Serie anterior' })),
      ];
    }, session.username);

    return backTo(PATH, { ok: 'Ya es la serie actual.' });
  }

  if (action !== 'guardar') {
    return backTo(PATH, { error: 'No se entendió la acción.' });
  }

  const title = readText(form, 'title');
  const subtitle = readText(form, 'subtitle');
  const description = readText(form, 'description');
  const href = readText(form, 'href');

  if (!title || !subtitle || !description || !href) {
    return backTo(PATH, { error: 'Faltan datos. Todos los campos de texto son obligatorios.' });
  }

  const saveImage = async (field: string, fallback?: string) => {
    const uploaded = form.get(field);
    if (!(uploaded instanceof File) || uploaded.size === 0) return fallback;
    return saveUploadedImage(uploaded);
  };

  let image: string | undefined;
  let mobileImage: string | undefined;
  try {
    image = await saveImage('image', current[index].image);
    mobileImage = await saveImage('mobileImage', current[index].mobileImage);
  } catch (error) {
    const message = error instanceof UploadError ? error.message : 'No se pudo guardar la imagen.';
    return backTo(PATH, { error: message });
  }

  if (!image) {
    return backTo(PATH, { error: 'Falta la portada de la serie.' });
  }

  await seriesCollection.update(
    (items) =>
      items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const updated: SermonSeries = {
          ...item,
          title,
          subtitle,
          description,
          href,
          image,
        };

        if (mobileImage) updated.mobileImage = mobileImage;
        return updated;
      }),
    session.username
  );

  scheduleOrphanSweep();
  return backTo(PATH, { ok: 'Se guardó. Ya se ve en el inicio.' });
};
