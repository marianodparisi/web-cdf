import type { APIRoute } from 'astro';
import { getAdminSessionCookie, verifyAdminSessionValue } from '../../../lib/admin-auth';
import { stabilizeNodeStdin } from '../../../lib/node-stdio';

const readEnv = (name: string) => {
  const metaEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return metaEnv?.[name] ?? process.env[name];
};

const getMissingTinaEnv = () => {
  if (readEnv('TINA_PUBLIC_IS_LOCAL') === 'true') return [];

  return ['GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_PERSONAL_ACCESS_TOKEN', 'MONGODB_URI'].filter(
    (name) => !readEnv(name)
  );
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = verifyAdminSessionValue(cookies.get(getAdminSessionCookie())?.value);

  if (!session) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const body = await request.json().catch(() => null);
  if (!body?.query || body.variables === undefined) {
    return jsonResponse({ error: 'Invalid Tina GraphQL payload' }, 400);
  }

  const missingEnv = getMissingTinaEnv();
  if (missingEnv.length > 0) {
    return jsonResponse(
      {
        errors: [
          {
            message: `Missing Tina environment variables: ${missingEnv.join(', ')}`,
          },
        ],
      },
      500
    );
  }

  try {
    stabilizeNodeStdin();
    const { default: databaseClient } = await import('../../../../tina/__generated__/databaseClient');
    const result = await databaseClient.request({
      query: body.query,
      variables: body.variables,
      user: { name: session.username, sub: session.username },
    });

    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Tina API error';
    console.error('Tina GraphQL error:', error);

    return jsonResponse(
      {
        errors: [
          {
            message,
          },
        ],
      },
      500
    );
  }
};
