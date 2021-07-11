import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { createAdmin } from './utils/init-BD-createAdmin';
import { ManMadeExceptionFilter } from './common/man-made-exception.filter';
import { SwaggerCustomOptions } from './common/swagger-interface';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { Streams } from './logger/streams';

declare const module: any;

const options = (props: any) => {
  const APP_VERSION = props?.version || '1.0.1';
  return new DocumentBuilder()
    .setTitle('Basic Nest JS API')
    .setDescription('Nest Framework Rest API')
    .setVersion(APP_VERSION)
    .addBearerAuth()
    .build();
};

const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'My API Docs',
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  const APP_PORT = configService.get('PORT') as number;
  const APP_VERSION = configService.get('APP_VERSION') as string;
  const PG_DB = configService.get('PG_DB') as string;

  const streams = new Streams(configService);
  app.useGlobalFilters(new ManMadeExceptionFilter(configService, streams));
  app.useGlobalInterceptors(new LoggingInterceptor(configService, streams));

  void createAdmin({ PG_DB })
    .then(() =>
      Logger.log(`Admin user exists or has been created: login - admin, password - admin`),
    )
    .catch((e) => Logger.error(`Error create user Admin: ${e}`));

  const document = SwaggerModule.createDocument(app, options({ version: APP_VERSION }));
  SwaggerModule.setup('/doc', app, document, customOptions);

  await app.listen(APP_PORT, '0.0.0.0');
  const url = await app.getUrl();

  Logger.log(`Application is running on: ${url} or swagger at: ${url}/doc`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
