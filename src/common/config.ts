import appRoot from 'app-root-path';

const APPROOT = String(appRoot);

export default () => ({
  // application
  APP_VERSION: 'v.1.0',
  APP_PORT: parseInt(process.env['APP_PORT'] as string, 10),
  USE_FASTIFY: process.env['USE_FASTIFY'],
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
  SOLT_ROUNDS: !process.env['SOLT_ROUNDS'] ? 11 : parseInt(process.env['SOLT_ROUNDS'], 10),
  EXPIRES_IN: process.env['EXPIRES_IN'] || '10m',
  // router proxy
  ROUTE_WHITELIST: ['/', '/doc', '/login', '/favicon.ico'],
});
