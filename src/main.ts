import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

import { createAdmin } from './utils/init-BD-createAdmin';
import { ManMadeExceptionFilter } from './common/man-made-exception.filter';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerCustomOptions } from './common/swagger-interface';

declare const module: any;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  const APP_PORT = configService.get('PORT') as number;
  const APP_VERSION = configService.get('PG_DB') as string;
  const PG_DB = configService.get('PG_DB') as string;

  app.useGlobalFilters(new ManMadeExceptionFilter());

  void createAdmin({ PG_DB })
    .then(() =>
      Logger.log(`Admin user exists or has been created: login - admin, password - admin`),
    )
    .catch((e) => Logger.error(`Error create user Admin: ${e}`));

  const options = new DocumentBuilder()
    .setTitle('Basic Nest JS API')
    .setDescription('Nest Framework Rest API')
    .setVersion(APP_VERSION)
    .addBearerAuth()
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'My API Docs',
  };
  const document = SwaggerModule.createDocument(app, options);
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
