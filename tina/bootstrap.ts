import database from './database';
import graphQLSchema from './__generated__/_graphql.json';
import lookup from './__generated__/_lookup.json';
import schema from './__generated__/_schema.json';

let bootstrapPromise: Promise<void> | null = null;

const knownContentPath = 'content/site-content/home.json';

export const isMissingTinaIndexError = (error: unknown) =>
  error instanceof Error &&
  (error.message.includes('GraphQL schema not found') ||
    error.message.includes('Unable to get schema from level db') ||
    error.message.includes('No indexDefinitions for collection') ||
    error.message.includes('tina/__generated__/_schema.json') ||
    error.message.includes('tina/__generated__/_graphql.json'));

export const ensureTinaDatabaseIndexed = async () => {
  if (!bootstrapPromise) {
    bootstrapPromise = database
      .getGraphQLSchema()
      .then(async () => {
        const hasIndexedContent = await database.documentExists(knownContentPath);
        if (hasIndexedContent) return;

        await database.indexContent({
          graphQLSchema,
          tinaSchema: { schema },
          lookup,
        });
      })
      .catch(async (error: unknown) => {
        if (!isMissingTinaIndexError(error)) throw error;

        await database.indexContent({
          graphQLSchema,
          tinaSchema: { schema },
          lookup,
        });
      })
      .catch((error: unknown) => {
        bootstrapPromise = null;
        throw error;
      });
  }

  return bootstrapPromise;
};
