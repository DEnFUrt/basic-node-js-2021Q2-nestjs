import { ConfigService } from '@nestjs/config';
// import path from 'path';
import { ConnectionOptions } from 'typeorm';
// import config from './config';

const configService = new ConfigService();

// const isCompiled = path.extname(__filename).includes('js');

export default {
  type: 'postgres',
  host: configService.get<string>('PG_HOST') || 'localhost',
  port: configService.get<number>('PG_PORT') || 5432,
  username: configService.get<string>('PG_USER') || 'postgres',
  password: configService.get<string>('PG_PASSWORD') || 'Manager1',
  database: configService.get<string>('PG_DB') || 'basicsdb',
  synchronize: configService.get<boolean>('PG_NO_SYNC') || false,
  logging: configService.get<boolean>('PG_NO_LOGS') || false,
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
