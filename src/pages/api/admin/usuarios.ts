import type { APIRoute } from 'astro';
import {
  countAdmins,
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  updateAdminUser,
} from '../../../lib/admin-auth';
import { backTo, getSession } from '../../../lib/admin-guard';

const PATH = '/admin/usuarios';

const readText = (form: FormData, field: string) => String(form.get(field) ?? '').trim();

export const POST: APIRoute = async (context) => {
  const session = getSession(context.locals);
  if (session.role !== 'admin') {
    return backTo('/admin', { error: 'Solo un administrador puede gestionar los accesos.' });
  }

  const form = await context.request.formData();
  const action = readText(form, 'accion');
  const role = form.get('role') === 'admin' ? ('admin' as const) : ('editor' as const);
  const sections = form.getAll('sections').map(String);

  try {
    if (action === 'crear') {
      const username = readText(form, 'username');
      const password = readText(form, 'password');
      const email = readText(form, 'email') || null;

      if (!username || password.length < 8) {
        return backTo(PATH, { error: 'Falta el usuario o la contraseña es muy corta.' });
      }

      const taken = (await listAdminUsers()).some((user) => user.username === username);
      if (taken) {
        return backTo(PATH, { error: `Ya existe alguien con el usuario ${username}.` });
      }

      await createAdminUser({ username, email, password, role, sections });
      return backTo(PATH, { ok: `Listo. ${username} ya puede entrar al panel.` });
    }

    const id = Number(readText(form, 'id'));
    const users = await listAdminUsers();
    const target = users.find((user) => user.id === id);

    if (!target) {
      return backTo(PATH, { error: 'Esa persona ya no está en la lista.' });
    }

    if (action === 'borrar') {
      if (target.username === session.username) {
        return backTo(PATH, { error: 'No podés sacarte el acceso a vos mismo.' });
      }

      if (target.role === 'admin' && (await countAdmins()) <= 1) {
        return backTo(PATH, { error: 'Es el único administrador. Nombrá otro antes de sacarlo.' });
      }

      await deleteAdminUser(id);
      return backTo(PATH, { ok: `${target.username} ya no tiene acceso.` });
    }

    if (action !== 'guardar') {
      return backTo(PATH, { error: 'No se entendió la acción.' });
    }

    const password = readText(form, 'password');
    if (password && password.length < 8) {
      return backTo(PATH, { error: 'La contraseña tiene que tener al menos 8 caracteres.' });
    }

    // Sin esto, un admin puede bajarse a editor sin querer y dejar el panel sin
    // nadie que pueda gestionar accesos.
    if (target.role === 'admin' && role === 'editor' && (await countAdmins()) <= 1) {
      return backTo(PATH, { error: 'Es el único administrador. Nombrá otro antes de bajarlo a editor.' });
    }

    await updateAdminUser(id, { role, sections, password: password || undefined });
    return backTo(PATH, { ok: `Se guardaron los accesos de ${target.username}.` });
  } catch (error) {
    console.error('[admin] error gestionando usuarios:', error);
    return backTo(PATH, { error: 'Hubo un problema al guardar. Revisá la conexión con la base.' });
  }
};
