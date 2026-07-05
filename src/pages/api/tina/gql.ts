import type { APIRoute } from 'astro';
import databaseClient from '../../../../tina/__generated__/databaseClient';
import { getAdminSessionCookie, verifyAdminSessionValue } from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = verifyAdminSessionValue(cookies.get(getAdminSessionCookie())?.value);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json().catch(() => null);
  if (!body?.query || body.variables === undefined) {
    return new Response(JSON.stringify({ error: 'Invalid Tina GraphQL payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await databaseClient.request({
    query: body.query,
    variables: body.variables,
    user: { name: session.username, sub: session.username },
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
