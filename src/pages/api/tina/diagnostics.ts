import type { APIRoute } from 'astro';
import { stabilizeNodeStdin } from '../../../lib/node-stdio';

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
  if (error instanceof Error) {
    return {
      message: `${error.name}: ${error.message}`,
      code: 'code' in error ? String(error.code) : undefined,
      stack: error.stack?.split('\n').slice(0, 8),
    };
  }
  return String(error);
};

const withTimeout = async <T>(promise: Promise<T>, label: string, timeoutMs = 12000) => {
  let timeout: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeout!);
  }
};

const checkMongo = async (): Promise<CheckResult> => {
  try {
    const { MongoClient } = await import('mongodb');
    const mongoUri = readEnv('MONGODB_URI');
    const dbName = readEnv('MONGODB_DB_NAME') || 'tina_cdf';
    const branch = readEnv('GITHUB_BRANCH') || readEnv('NEXT_PUBLIC_TINA_BRANCH') || 'dev';
    const tinaCollectionName = `tinacms-${branch}`;

    if (!mongoUri) return { ok: false, error: 'Missing MONGODB_URI' };

    const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    const db = client.db(dbName);
    await db
      .collection('__tina_diagnostics')
      .updateOne({ _id: 'ping' }, { $set: { checkedAt: new Date() } }, { upsert: true });

    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const tinaCollection = db.collection(tinaCollectionName);
    const tinaCollectionExists = collections.some((collection) => collection.name === tinaCollectionName);
    const tinaDocumentCount = tinaCollectionExists ? await tinaCollection.countDocuments() : 0;
    const expectedContentKeys = ['content/site-content/home.json', 'content/dev-notes/probe.md'];
    const expectedContent = tinaCollectionExists
      ? await tinaCollection
          .find({ key: { $in: expectedContentKeys } }, { projection: { _id: 0, key: 1 } })
          .sort({ key: 1 })
          .toArray()
      : [];
    const sampleKeys = tinaCollectionExists
      ? await tinaCollection
          .find({}, { projection: { _id: 0, key: 1 } })
          .sort({ key: 1 })
          .limit(80)
          .toArray()
      : [];
    const schemaKeys = tinaCollectionExists
      ? await tinaCollection
          .find(
            { key: { $regex: 'schema|graphql|lookup|index|definition', $options: 'i' } },
            { projection: { _id: 0, key: 1 } }
          )
          .sort({ key: 1 })
          .limit(80)
          .toArray()
      : [];
    await client.close();

    return {
      ok: true,
      detail: {
        dbName,
        branch,
        tinaCollectionName,
        collections: collections.map((collection) => collection.name).sort(),
        tinaCollectionExists,
        tinaDocumentCount,
        expectedContentKeys,
        indexedExpectedContentKeys: expectedContent.map((item) => item.key),
        sampleKeys: sampleKeys.map((item) => item.key),
        schemaKeys: schemaKeys.map((item) => item.key),
      },
    };
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
    stabilizeNodeStdin();
    const { ensureTinaDatabaseIndexed } = await import('../../../../tina/bootstrap');
    await withTimeout(ensureTinaDatabaseIndexed(), 'Tina bootstrap');
    const { default: databaseClient } = await import('../../../../tina/__generated__/databaseClient');
    const result = await withTimeout(
      databaseClient.request({
        query: 'query { collections { name label path format } }',
        variables: {},
        user: { name: 'diagnostics', sub: 'diagnostics' },
      }),
      'Tina diagnostics query'
    );

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
