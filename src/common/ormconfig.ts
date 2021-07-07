// import path from 'path';
import { ConnectionOptions } from 'typeorm';
// import config from './config';

// const isCompiled = path.extname(__filename).includes('js');

const { PG_HOST, PG_USER, PG_PASSWORD, PG_DB, PG_PORT, PG_NO_LOGS, PG_NO_SYNC } = process.env;

export default {
  type: 'postgres',
  host: PG_HOST || 'localhost',
  port: PG_PORT || 5432,
  username: PG_USER || 'postgres',
  password: PG_PASSWORD || 'Manager1',
  database: PG_DB || 'basicsdb',
  synchronize: !PG_NO_SYNC || false,
  logging: !PG_NO_LOGS || false,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  // entities: [`src/resources/entity/**/*.${isCompiled ? 'js' : 'ts'}`],
  // migrations: [`src/resources/migration/**/*.${isCompiled ? 'js' : 'ts'}`],
  // subscribers: [`src/resources/subscriber/**/*.${isCompiled ? 'js' : 'ts'}`],
  entities: [`src/resources/entity/**/*.ts`],
  migrations: [`src/resources/migration/**/*.ts`],
  subscribers: [`src/resources/subscriber/**/*.ts`],
  cli: {
    entitiesDir: 'src/resources/entity',
    migrationsDir: 'src/resources/migration',
  },
} as ConnectionOptions;
