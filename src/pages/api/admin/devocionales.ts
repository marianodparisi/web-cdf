import type { APIRoute } from 'astro';
import type { DevotionalPost } from '../../../data/devotionals';
import {
  buildUniqueSlug,
  devotionalsCollection,
  textToParagraphs,
} from '../../../lib/content/collections';
import { UploadError, saveUploadedImage } from '../../../lib/content/uploads';
import { scheduleOrphanSweep } from '../../../lib/content/orphans';
import { backTo, canEdit, getSession } from '../../../lib/admin-guard';

const LIST_PATH = '/admin/devocionales';

const readText = (form: FormData, field: string) => String(form.get(field) ?? '').trim();

export const POST: APIRoute = async (context) => {
  const session = getSession(context.locals);
  if (!canEdit(session, 'devocionales')) {
    return backTo('/admin', { error: 'No tenés acceso a los devocionales.' });
  }

  const form = await context.request.formData();
  const action = readText(form, 'accion');
  const slug = readText(form, 'slug');

  if (action === 'borrar') {
    await devotionalsCollection.update(
      (posts) => posts.filter((post) => post.slug !== slug),
      session.username
    );

    scheduleOrphanSweep();
    return backTo(LIST_PATH, { ok: 'Se borró.' });
  }

  if (action === 'subir') {
    await devotionalsCollection.update((posts) => {
      const index = posts.findIndex((post) => post.slug === slug);
      if (index <= 0) return posts;

      const reordered = [...posts];
      [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
      return reordered;
    }, session.username);

    return backTo(LIST_PATH, { ok: 'Se cambió el orden.' });
  }

  if (action !== 'guardar') {
    return backTo(LIST_PATH, { error: 'No se entendió la acción.' });
  }

  const title = readText(form, 'title');
  const weekLabel = readText(form, 'weekLabel');
  const excerpt = readText(form, 'excerpt');
  const content = textToParagraphs(readText(form, 'content'));
  const videoUrl = readText(form, 'videoUrl');
  const type = readText(form, 'type') === 'Testimonio' ? 'Testimonio' : 'Devocional';

  if (!title || !weekLabel || !excerpt || content.length === 0) {
    return backTo(slug ? `${LIST_PATH}/${slug}` : `${LIST_PATH}/nuevo`, {
      error: 'Faltan datos: título, referencia, resumen y texto son obligatorios.',
    });
  }

  const existing = (await devotionalsCollection.read()).find((post) => post.slug === slug);

  let image = existing?.image ?? '';
  const uploaded = form.get('image');
  if (uploaded instanceof File && uploaded.size > 0) {
    try {
      image = await saveUploadedImage(uploaded);
    } catch (error) {
      const message =
        error instanceof UploadError ? error.message : 'No se pudo guardar la imagen.';
      return backTo(slug ? `${LIST_PATH}/${slug}` : `${LIST_PATH}/nuevo`, { error: message });
    }
  }

  if (!image) {
    return backTo(`${LIST_PATH}/nuevo`, { error: 'Falta elegir una foto.' });
  }

  await devotionalsCollection.update((posts) => {
    if (existing) {
      return posts.map((post) =>
        post.slug === slug
          ? { ...post, title, type, weekLabel, excerpt, content, image, videoUrl: videoUrl || undefined }
          : post
      );
    }

    const created: DevotionalPost = {
      // El slug se calcula una sola vez, al crear: es la URL pública y
      // cambiarla después rompe los links que ya circularon por WhatsApp.
      slug: buildUniqueSlug(title, posts.map((post) => post.slug)),
      title,
      type,
      weekLabel,
      image,
      excerpt,
      content,
      videoUrl: videoUrl || undefined,
    };

    // Lo nuevo va primero: es lo que se muestra como devocional de la semana.
    return [created, ...posts];
  }, session.username);

  scheduleOrphanSweep();
  return backTo(LIST_PATH, { ok: existing ? 'Se guardó. Ya se ve en el sitio.' : 'Se publicó. Ya se ve en el sitio.' });
};
