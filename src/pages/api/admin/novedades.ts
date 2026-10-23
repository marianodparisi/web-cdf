import type { APIRoute } from 'astro';
import type { MinistryNotice } from '../../../data/ministries';
import { ministriesCollection } from '../../../lib/content/collections';
import { readEndDate } from '../../../lib/content/expiry';
import { newNoticeId, noticesOf, withNotices } from '../../../lib/content/notices';
import { UploadError, saveUploadedImage } from '../../../lib/content/uploads';
import { scheduleOrphanSweep } from '../../../lib/content/orphans';
import { backTo, canEdit, getSession } from '../../../lib/admin-guard';
import { ministrySectionKey } from '../../../lib/content/sections';

const readText = (form: FormData, field: string) => String(form.get(field) ?? '').trim();

/**
 * Novedades de los ministerios: crear, guardar, borrar y subir (orden).
 *
 * Lo usan la pestaña Novedad de cada ministerio y la pantalla Novedades del
 * panel; `volver` dice a cuál regresar. El permiso es el del ministerio de la
 * novedad, y se controla acá: el formulario no alcanza.
 */
export const POST: APIRoute = async (context) => {
  const session = getSession(context.locals);
  const form = await context.request.formData();

  // Sólo se vuelve a pantallas del panel: nada de redirigir afuera.
  const requested = readText(form, 'volver');
  const back = /^\/admin(\/[\w\-/#]*)?$/.test(requested) ? requested : '/admin/novedades';

  const slug = readText(form, 'ministerio');
  const ministry = (await ministriesCollection.read()).find((item) => item.slug === slug);
  if (!ministry) return backTo(back, { error: 'Elegí de qué ministerio es la novedad.' });
  if (!canEdit(session, ministrySectionKey(slug))) {
    return backTo(back, { error: `No tenés acceso a ${ministry.name}.` });
  }

  const action = readText(form, 'accion') || 'guardar';
  const notices = noticesOf(ministry);
  const id = readText(form, 'id');
  const index = notices.findIndex((notice) => notice.id === id);

  const save = async (next: MinistryNotice[]) => {
    await ministriesCollection.update(
      (items) => items.map((item) => (item.slug === slug ? withNotices(item, next) : item)),
      session.username,
    );
    scheduleOrphanSweep();
  };

  if (action === 'borrar' || action === 'subir') {
    if (index === -1) return backTo(back, { error: 'Esa novedad ya no existe.' });
    if (action === 'borrar') {
      await save(notices.filter((notice) => notice.id !== id));
      return backTo(back, { ok: 'Se borró la novedad.' });
    }
    if (index > 0) {
      const next = [...notices];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      await save(next);
    }
    return backTo(back, { ok: 'Se cambió el orden.' });
  }

  if (action !== 'crear' && action !== 'guardar') {
    return backTo(back, { error: 'No se entendió la acción.' });
  }
  if (action === 'guardar' && index === -1) return backTo(back, { error: 'Esa novedad ya no existe.' });

  const title = readText(form, 'title');
  if (!title) return backTo(back, { error: 'La novedad necesita un título.' });

  const showHome = form.get('showHome') === 'si';
  const showPage = form.get('showPage') === 'si';

  let image = action === 'guardar' ? notices[index].image : undefined;
  const uploaded = form.get('image');
  if (uploaded instanceof File && uploaded.size > 0) {
    try {
      image = await saveUploadedImage(uploaded);
    } catch (error) {
      const message = error instanceof UploadError ? error.message : 'No se pudo guardar la imagen.';
      return backTo(back, { error: message });
    }
  }
  if (form.get('quitarImagen') === 'si') image = undefined;

  const notice: MinistryNotice = {
    id: action === 'guardar' ? id : newNoticeId(),
    title,
    text: readText(form, 'text').replace(/\r\n/g, '\n') || undefined,
    image,
    endDate: readEndDate(form.get('endDate')),
    showHome,
    showPage,
  };

  if (action === 'crear') {
    // La nueva va primero: es la más reciente.
    await save([notice, ...notices]);
    return backTo(back, { ok: `Se publicó la novedad de ${ministry.name}.` });
  }

  await save(notices.map((item) => (item.id === id ? notice : item)));
  return backTo(back, { ok: 'Se guardó la novedad.' });
};
