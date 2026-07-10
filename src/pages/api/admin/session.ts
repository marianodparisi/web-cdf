import type { APIRoute } from 'astro';
import { getAdminSessionCookie, verifyAdminSessionValue } from '../../../lib/admin-auth';

export const GET: APIRoute = ({ cookies }) => {
  const sessionCookie = cookies.get(getAdminSessionCookie())?.value;
  const session = verifyAdminSessionValue(sessionCookie);

  return new Response(JSON.stringify({ authenticated: Boolean(session) }), {
    status: session ? 200 : 401,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json',
    },
  });
};
