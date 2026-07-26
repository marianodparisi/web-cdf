import type { APIRoute } from 'astro';
import { ministriesCollection } from '../../../lib/content/collections';
import { UploadError, saveUploadedImage } from '../../../lib/content/uploads';
import { scheduleOrphanSweep } from '../../../lib/content/orphans';
import { backTo, canEdit, getSession } from '../../../lib/admin-guard';
import { ministrySectionKey } from '../../../lib/content/sections';

const readText = (form: FormData, field: string) => String(form.get(field) ?? '').trim();

/** Los textarea mandan saltos de línea con \r\n; el sitio los renderiza como \n. */
const readLines = (form: FormData, field: string) => readText(form, field).replace(/\r\n/g, '\n');

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

  const description = readText(form, 'description');
  const participation = readText(form, 'participation');
  const schedule = readText(form, 'schedule');

  if (!description || !participation || !schedule) {
    return backTo(path, { error: 'Faltan datos. Los textos de la página son obligatorios.' });
  }

  // La ficha se ve fuera de la página del ministerio (navbar, inicio, listado),
  // así que sólo la toca un admin. El chequeo va acá y no sólo en el formulario:
  // un editor puede mandar un POST a mano con los campos que quiera.
  const isAdmin = session.role === 'admin';
  const name = isAdmin ? readText(form, 'name') : current.name;
  const area = isAdmin ? readText(form, 'area') : current.area;
  const excerpt = isAdmin ? readText(form, 'excerpt') : current.excerpt;

  if (!name || !area || !excerpt) {
    return backTo(path, { error: 'Faltan datos. El nombre, el área y el resumen son obligatorios.' });
  }

  const uploadImage = async (field: string, fallback?: string) => {
    const uploaded = form.get(field);
    if (!(uploaded instanceof File) || uploaded.size === 0) return fallback;
    return saveUploadedImage(uploaded);
  };

  let image = current.image;
  let photo = current.photo;

  try {
    // El logo es parte de la ficha: si no es admin ni se mira el archivo.
    if (isAdmin) image = (await uploadImage('image', current.image)) ?? current.image;
    photo = await uploadImage('photo', current.photo);
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
              name,
              area,
              excerpt,
              description,
              participation,
              schedule,
              image,
              photo,
              meetingDay: readText(form, 'meetingDay'),
              meetingHours: readText(form, 'meetingHours'),
              place: readLines(form, 'place'),
              mapUrl: readText(form, 'mapUrl'),
              noticeTitle: readText(form, 'noticeTitle'),
              noticeText: readText(form, 'noticeText'),
              whatsapp: readText(form, 'whatsapp'),
              instagram: readText(form, 'instagram'),
            }
          : item
      ),
    session.username
  );

  scheduleOrphanSweep();
  return backTo(path, { ok: 'Se guardó. Ya se ve en el sitio.' });
};
