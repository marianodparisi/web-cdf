import type { APIRoute } from 'astro';
import { changeOwnPassword } from '../../../lib/admin-auth';
import { backTo, getSession } from '../../../lib/admin-guard';

const PATH = '/admin/mi-cuenta';

const readText = (form: FormData, field: string) => String(form.get(field) ?? '').trim();

export const POST: APIRoute = async (context) => {
  const session = getSession(context.locals);
  const form = await context.request.formData();

  const current = readText(form, 'actual');
  const next = readText(form, 'nueva');
  const repeat = readText(form, 'repetir');

  if (!current || !next) {
    return backTo(PATH, { error: 'Faltan datos. Poné tu contraseña de ahora y la nueva.' });
  }

  if (next.length < 8) {
    return backTo(PATH, { error: 'La contraseña nueva tiene que tener al menos 8 caracteres.' });
  }

  if (next !== repeat) {
    return backTo(PATH, { error: 'Las dos contraseñas nuevas no son iguales. Probá de nuevo.' });
  }

  if (next === current) {
    return backTo(PATH, { error: 'La contraseña nueva es igual a la de ahora.' });
  }

  try {
    const result = await changeOwnPassword(session.username, current, next);

    if (result === 'wrong-password') {
      return backTo(PATH, { error: 'La contraseña de ahora no es correcta.' });
    }

    if (result === 'not-found') {
      return backTo('/admin', { error: 'Tu cuenta ya no está disponible.' });
    }

    return backTo(PATH, { ok: 'Listo, ya tenés una contraseña nueva. Usala la próxima vez que entres.' });
  } catch (error) {
    console.error('[admin] error cambiando la contraseña propia:', error);
    return backTo(PATH, { error: 'Hubo un problema al guardar. Revisá la conexión con la base.' });
  }
};
