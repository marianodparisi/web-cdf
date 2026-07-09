import * as mongodbLevelNamespace from 'mongodb-level';
import { MongoClient } from 'mongodb';
import ModuleError from 'module-error';

const { MongodbLevel } =
  'default' in mongodbLevelNamespace
    ? (mongodbLevelNamespace.default as typeof mongodbLevelNamespace)
    : mongodbLevelNamespace;

type OpenCallback = (error?: Error) => void;

const isOpenAlreadyExistsError = (error: unknown) => {
  if (!(error instanceof Error)) return false;
  const code = 'code' in error ? String(error.code) : '';
  return code === 'EEXIST' || error.message === 'open EEXIST' || error.message.includes('EEXIST');
};

export class TinaMongodbLevel<KDefault = string, VDefault = unknown> extends MongodbLevel<
  KDefault,
  VDefault
> {
  async _open(options: unknown, callback: OpenCallback) {
    try {
      const instance = this as any;

      if (!instance.mongoUri) {
        return this.nextTick(
          callback,
          new ModuleError('mongoUri is required', { code: 'MONGO_URI_REQUIRED' })
        );
      }

      if (!instance.dbName) {
        return this.nextTick(
          callback,
          new ModuleError('dbName is required', { code: 'DB_NAME_REQUIRED' })
        );
      }

      if (!instance.collectionName) {
        return this.nextTick(
          callback,
          new ModuleError('collectionName is required', { code: 'COLLECTION_NAME_REQUIRED' })
        );
      }

      instance.client = new MongoClient(instance.mongoUri, {
        connectTimeoutMS: 8000,
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 15000,
        maxPoolSize: 5,
      });
      await instance.client.connect();
      instance.db = instance.client.db(instance.dbName);
      instance.collection = instance.db.collection(instance.collectionName);
      await instance.collection.createIndex({ key: 1 }, { unique: true });
      this.nextTick(callback);
    } catch (error) {
      if (isOpenAlreadyExistsError(error)) {
        this.nextTick(callback);
        return;
      }

      const message = error instanceof Error ? error.message : 'Unable to open MongoDB level';
      this.nextTick(callback, new ModuleError(message));
    }
  }
}
