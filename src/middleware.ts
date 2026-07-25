import { defineMiddleware } from 'astro/middleware';
import { getAdminSessionCookie, loadAdminSession } from './lib/admin-auth';

const isProtectedAdminPath = (pathname: string) =>
  pathname.startsWith('/admin') && pathname !== '/admin/login';

/** Las rutas que guardan contenido responden JSON, así que un 401 es más útil
 *  que un redirect: el formulario puede mostrar el error sin perder lo escrito. */
const isProtectedAdminApiPath = (pathname: string) =>
  pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login');

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (!isProtectedAdminPath(pathname) && !isProtectedAdminApiPath(pathname)) {
    return next();
  }

  // El logout tiene que funcionar aunque la sesión ya no sea válida.
  if (pathname === '/api/admin/logout') return next();

  const sessionCookie = context.cookies.get(getAdminSessionCookie())?.value;
  const session = await loadAdminSession(sessionCookie);

  if (!session) {
    if (isProtectedAdminApiPath(pathname)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return context.redirect('/admin/login');
  }

  context.locals.adminSession = session;
  return next();
});
