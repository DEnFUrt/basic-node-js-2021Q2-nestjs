import { ConfigService } from '@nestjs/config';
// import path from 'path';
import { ConnectionOptions } from 'typeorm';

const configService = new ConfigService();

// const isCompiled = path.extname(__filename).includes('js');

export default {
  type: 'postgres',
  host: 'localhost',
  port: configService.get<number>('PG_PORT') || 5432,
  username: configService.get<string>('PG_USER') || 'postgres',
  password: configService.get<string>('PG_PASSWORD') || 'postgres',
  database: configService.get<string>('PG_DB') || 'test',
  synchronize: !configService.get<boolean>('PG_NO_SYNC'),
  logging: !configService.get<boolean>('PG_NO_LOGS'),
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  // entities: [`src/resources/entity/**/*.${isCompiled ? 'js' : 'ts'}`],
  // migrations: [`src/resources/migration/**/*.${isCompiled ? 'js' : 'ts'}`],
  // subscribers: [`src/resources/subscriber/**/*.${isCompiled ? 'js' : 'ts'}`],
  cli: {
    entitiesDir: 'src/resources/entity',
    migrationsDir: 'src/resources/migration',
  },
} as ConnectionOptions;
