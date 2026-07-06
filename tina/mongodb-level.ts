import * as mongodbLevelNamespace from 'mongodb-level';

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
      await super._open(options, callback);
    } catch (error) {
      if (isOpenAlreadyExistsError(error)) {
        this.nextTick(callback);
        return;
      }

      throw error;
    }
  }
}
