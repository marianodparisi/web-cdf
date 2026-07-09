import type { APIRoute } from 'astro';
import { getAdminSessionCookie, verifyAdminSessionValue } from '../../../lib/admin-auth';

export const GET: APIRoute = ({ cookies }) => {
  const session = verifyAdminSessionValue(cookies.get(getAdminSessionCookie())?.value);

  return new Response(JSON.stringify({ authenticated: Boolean(session) }), {
    status: session ? 200 : 401,
    headers: { 'Content-Type': 'application/json' },
  });
};
