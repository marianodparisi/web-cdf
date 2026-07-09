import database, { resetTinaDatabase } from './database';
import graphQLSchema from './__generated__/_graphql.json';
import lookup from './__generated__/_lookup.json';
import schema from './__generated__/_schema.json';

let bootstrapPromise: Promise<void> | null = null;

const knownContentPaths = ['content/site-content/home.json', 'content/dev-notes/probe.md'];

const isDatabaseClosedError = (error: unknown) =>
  error instanceof Error && error.message.includes('Database is not open');

export const isMissingTinaIndexError = (error: unknown) =>
  error instanceof Error &&
  (error.message.includes('GraphQL schema not found') ||
    error.message.includes('Unable to get schema from level db') ||
    error.message.includes('Database is not open') ||
    error.message.includes('No indexDefinitions for collection') ||
    error.message.includes('tina/__generated__/_schema.json') ||
    error.message.includes('tina/__generated__/_graphql.json'));

const indexContent = () =>
  database.indexContent({
    graphQLSchema,
    tinaSchema: { schema },
    lookup,
  });

const hasExpectedSchema = (storedGraphQLSchema: unknown) =>
  JSON.stringify(storedGraphQLSchema).includes('DevNotes');

const hasExpectedContent = async () => {
  const indexedContentChecks = await Promise.all(
    knownContentPaths.map((contentPath) => database.documentExists(contentPath))
  );

  return indexedContentChecks.every(Boolean);
};

export const ensureTinaDatabaseIndexed = async () => {
  if (!bootstrapPromise) {
    bootstrapPromise = database
      .getGraphQLSchema()
      .then(async (storedGraphQLSchema) => {
        if (hasExpectedSchema(storedGraphQLSchema) && (await hasExpectedContent())) return;

        await indexContent();
      })
      .catch(async (error: unknown) => {
        if (!isMissingTinaIndexError(error)) throw error;

        if (isDatabaseClosedError(error)) {
          await resetTinaDatabase();
        }

        await indexContent();
      })
      .catch((error: unknown) => {
        bootstrapPromise = null;
        throw error;
      });
  }

  return bootstrapPromise;
};
