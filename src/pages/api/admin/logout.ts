import type { APIRoute } from 'astro';
import { getAdminSessionCookie } from '../../../lib/admin-auth';

const clearSession = (cookies: Parameters<APIRoute>[0]['cookies']) => {
  cookies.delete(getAdminSessionCookie(), { path: '/' });
};

export const GET: APIRoute = ({ cookies, redirect }) => {
  clearSession(cookies);
  return redirect('/admin/login');
};

export const POST: APIRoute = ({ cookies }) => {
  clearSession(cookies);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
