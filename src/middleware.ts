import { defineMiddleware } from 'astro/middleware';
import { getAdminSessionCookie, verifyAdminSessionValue } from './lib/admin-auth';

const isProtectedAdminPath = (pathname: string) =>
  pathname.startsWith('/admin') && pathname !== '/admin/login';
const isProtectedTinaApiPath = (pathname: string) => pathname.startsWith('/api/tina');

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isProtectedAdminPath(context.url.pathname) && !isProtectedTinaApiPath(context.url.pathname)) {
    return next();
  }

  const sessionCookie = context.cookies.get(getAdminSessionCookie())?.value;
  const session = verifyAdminSessionValue(sessionCookie);

  if (!session) {
    if (isProtectedTinaApiPath(context.url.pathname)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return context.redirect('/admin/login');
  }

  return next();
});
