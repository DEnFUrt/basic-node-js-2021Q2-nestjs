import appRoot from 'app-root-path';

const APPROOT = String(appRoot);

export default () => ({
  // application
  APP_VERSION: 'v.1.0',
  APP_PORT: parseInt(process.env['PORT'] as string, 10),
  // logger
  DIR_LOG: `${APPROOT}/logs`,
  ERROR_LOG: 'error.log',
  INFO_LOG: 'app.log',
  LOG_REWRITE_EVERY_DAY: true,
  LOG_REWRITE_OVERSIZE: 1048576, // 1Mb = 1048576
  // autorization
  AUTH_MODE: process.env['AUTH_MODE'] === 'true',
  NODE_ENV: process.env['NODE_ENV'],
  JWT_SECRET_KEY: process.env['JWT_SECRET_KEY'],
  SOLT_ROUNDS: !process.env['SOLT_ROUNDS'] ? 10 : parseInt(process.env['SOLT_ROUNDS'], 10),
  EXPIRES_IN: process.env['EXPIRES_IN'] || '10m',
  // router proxy
  ROUTE_WHITELIST: ['/', '/doc', '/login', '/favicon.ico'],
  // postgresql
  PG_HOST: process.env['PG_HOST'],
  PG_USER: process.env['PG_USER'],
  PG_PASSWORD: process.env['PG_PASSWORD'],
  PG_DB: process.env['PG_DB'],
  PG_PORT: process.env['PG_PORT'],
  LOGIN_ADMIN: process.env['LOGIN_ADMIN'],
  PASSWORD_ADMIN: process.env['PASSWORD_ADMIN'],
  PG_NO_SYNC: true,
  PG_NO_LOGS: true,
});
