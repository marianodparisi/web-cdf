import { createDatabase, createLocalDatabase } from '@tinacms/datalayer';
import { GitHubProvider } from 'tinacms-gitprovider-github';
import { TinaMongodbLevel } from './mongodb-level';

type TinaDatabase = ReturnType<typeof createDatabase> | ReturnType<typeof createLocalDatabase>;

declare global {
  // eslint-disable-next-line no-var
  var __cdfTinaDatabase: TinaDatabase | undefined;
}

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.HEAD ||
  'dev';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const createTinaDatabase = () =>
  isLocal
    ? createLocalDatabase()
    : createDatabase({
        gitProvider: new GitHubProvider({
          branch,
          owner: process.env.GITHUB_OWNER as string,
          repo: process.env.GITHUB_REPO as string,
          token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN as string,
        }),
        databaseAdapter: new TinaMongodbLevel<string, Record<string, any>>({
          collectionName: `tinacms-${branch}`,
          dbName: process.env.MONGODB_DB_NAME || 'tina_cdf',
          mongoUri: process.env.MONGODB_URI as string,
        }),
        namespace: branch,
      });

globalThis.__cdfTinaDatabase ||= createTinaDatabase();

export default globalThis.__cdfTinaDatabase;
