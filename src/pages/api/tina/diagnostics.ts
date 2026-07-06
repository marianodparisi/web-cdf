import type { APIRoute } from 'astro';

type CheckResult = {
  ok: boolean;
  detail?: unknown;
  error?: string;
};

const readEnv = (name: string) => {
  const metaEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return metaEnv?.[name] ?? process.env[name];
};

const sanitizeError = (error: unknown) => {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
};

const checkMongo = async (): Promise<CheckResult> => {
  try {
    const { MongoClient } = await import('mongodb');
    const mongoUri = readEnv('MONGODB_URI');
    const dbName = readEnv('MONGODB_DB_NAME') || 'tina_cdf';

    if (!mongoUri) return { ok: false, error: 'Missing MONGODB_URI' };

    const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    await client
      .db(dbName)
      .collection('__tina_diagnostics')
      .updateOne({ _id: 'ping' }, { $set: { checkedAt: new Date() } }, { upsert: true });
    await client.close();

    return { ok: true, detail: { dbName } };
  } catch (error) {
    return { ok: false, error: sanitizeError(error) };
  }
};

const checkGithub = async (): Promise<CheckResult> => {
  try {
    const owner = readEnv('GITHUB_OWNER');
    const repo = readEnv('GITHUB_REPO');
    const branch = readEnv('GITHUB_BRANCH') || readEnv('NEXT_PUBLIC_TINA_BRANCH') || 'dev';
    const token = readEnv('GITHUB_PERSONAL_ACCESS_TOKEN');

    if (!owner || !repo || !token) {
      return {
        ok: false,
        error: `Missing ${[
          !owner && 'GITHUB_OWNER',
          !repo && 'GITHUB_REPO',
          !token && 'GITHUB_PERSONAL_ACCESS_TOKEN',
        ]
          .filter(Boolean)
          .join(', ')}`,
      };
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    const contentResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/content/site-content/home.json?ref=${branch}`,
      { headers }
    );

    const repoBody = repoResponse.ok ? await repoResponse.json() : await repoResponse.text();
    const contentBody = contentResponse.ok ? await contentResponse.json() : await contentResponse.text();

    return {
      ok: repoResponse.ok && contentResponse.ok,
      detail: {
        owner,
        repo,
        branch,
        repoStatus: repoResponse.status,
        contentStatus: contentResponse.status,
        permissions: typeof repoBody === 'object' && repoBody ? repoBody.permissions : undefined,
        contentPath: typeof contentBody === 'object' && contentBody ? contentBody.path : undefined,
        repoError: repoResponse.ok ? undefined : String(repoBody).slice(0, 300),
        contentError: contentResponse.ok ? undefined : String(contentBody).slice(0, 300),
      },
    };
  } catch (error) {
    return { ok: false, error: sanitizeError(error) };
  }
};

const checkTina = async (): Promise<CheckResult> => {
  try {
    const { default: databaseClient } = await import('../../../../tina/__generated__/databaseClient');
    const result = await databaseClient.request({
      query: 'query { collections { name label path format } }',
      variables: {},
      user: { name: 'diagnostics', sub: 'diagnostics' },
    });

    return {
      ok: !result.errors,
      detail: result.errors ? { errors: result.errors } : { data: result.data },
    };
  } catch (error) {
    return { ok: false, error: sanitizeError(error) };
  }
};

export const GET: APIRoute = async () => {
  const env = {
    GITHUB_OWNER: Boolean(readEnv('GITHUB_OWNER')),
    GITHUB_REPO: Boolean(readEnv('GITHUB_REPO')),
    GITHUB_BRANCH: readEnv('GITHUB_BRANCH') || readEnv('NEXT_PUBLIC_TINA_BRANCH') || 'dev',
    GITHUB_PERSONAL_ACCESS_TOKEN: Boolean(readEnv('GITHUB_PERSONAL_ACCESS_TOKEN')),
    MONGODB_URI: Boolean(readEnv('MONGODB_URI')),
    MONGODB_DB_NAME: readEnv('MONGODB_DB_NAME') || 'tina_cdf',
    TINA_PUBLIC_IS_LOCAL: readEnv('TINA_PUBLIC_IS_LOCAL') || '',
  };

  const [mongo, github, tina] = await Promise.all([checkMongo(), checkGithub(), checkTina()]);

  return new Response(JSON.stringify({ env, mongo, github, tina }, null, 2), {
    status: mongo.ok && github.ok && tina.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
};
