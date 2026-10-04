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

  // Se crea completa desde el formulario de "Agregar una serie". Antes se
  // agregaba un borrador vacío al final de la lista, que quedaba escondido
  // detrás de "Ver todas" y parecía que el botón no hacía nada.
  if (action === 'crear') {
    const title = readText(form, 'title');
    const subtitle = readText(form, 'subtitle');
    const description = readText(form, 'description');
    const href = readText(form, 'href');
    const asCurrent = form.get('actual') === 'si';

    if (!title || !subtitle || !description || !href) {
      return backTo(PATH, { error: 'Faltan datos. Completá nombre, bajada, descripción y link.' });
    }

    let image: string | undefined;
    try {
      const uploaded = form.get('image');
      if (uploaded instanceof File && uploaded.size > 0) image = await saveUploadedImage(uploaded);
    } catch (error) {
      const message = error instanceof UploadError ? error.message : 'No se pudo guardar la imagen.';
      return backTo(PATH, { error: message });
    }

    if (!image) {
      return backTo(PATH, { error: 'Falta la portada de la serie.' });
    }

    const nueva: SermonSeries = { title, subtitle, description, href, image, label: 'Serie anterior' };

    await seriesCollection.update((items) => {
      if (!asCurrent) {
        // Como anterior va justo después de la actual: es la más reciente.
        const [first, ...rest] = items;
        return first ? [first, nueva, ...rest] : [{ ...nueva, label: 'Serie actual' }];
      }
      // La etiqueta va atada a la posición: la primera es la actual.
      return [{ ...nueva, label: 'Serie actual' }, ...items.map((item) => ({ ...item, label: 'Serie anterior' }))];
    }, session.username);

    return backTo(PATH, {
      ok: asCurrent ? `${title} ya es la serie actual del inicio.` : `Se agregó ${title} a las series anteriores.`,
    });
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
