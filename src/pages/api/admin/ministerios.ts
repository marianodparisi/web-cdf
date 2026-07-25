import type { APIRoute } from 'astro';
import { ministriesCollection } from '../../../lib/content/collections';
import { UploadError, saveUploadedImage } from '../../../lib/content/uploads';
import { scheduleOrphanSweep } from '../../../lib/content/orphans';
import { backTo, canEdit, getSession } from '../../../lib/admin-guard';
import { ministrySectionKey } from '../../../lib/content/sections';

const readText = (form: FormData, field: string) => String(form.get(field) ?? '').trim();

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

  const name = readText(form, 'name');
  const area = readText(form, 'area');
  const excerpt = readText(form, 'excerpt');
  const description = readText(form, 'description');
  const participation = readText(form, 'participation');
  const schedule = readText(form, 'schedule');

  if (!name || !area || !excerpt || !description || !participation || !schedule) {
    return backTo(path, { error: 'Faltan datos. Todos los campos son obligatorios.' });
  }

  let image = current.image;
  const uploaded = form.get('image');
  if (uploaded instanceof File && uploaded.size > 0) {
    try {
      image = await saveUploadedImage(uploaded);
    } catch (error) {
      const message = error instanceof UploadError ? error.message : 'No se pudo guardar la imagen.';
      return backTo(path, { error: message });
    }
  }

  await ministriesCollection.update(
    (items) =>
      items.map((item) =>
        item.slug === slug
          ? { ...item, name, area, excerpt, description, participation, schedule, image }
          : item
      ),
    session.username
  );

  scheduleOrphanSweep();
  return backTo(path, { ok: 'Se guardó. Ya se ve en el sitio.' });
};
