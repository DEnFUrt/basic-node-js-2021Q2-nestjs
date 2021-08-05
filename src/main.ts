import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { customOptions, options } from './common/swagger-options';

declare const module: any;

async function bootstrap(): Promise<void> {
  const USE_FASTIFY = process.env['USE_FASTIFY'] === 'true' ? true : false;

  const app = USE_FASTIFY
    ? await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        cors: true,
      })
    : await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);

  const APP_PORT = configService.get('APP_PORT') as number;
  const APP_VERSION = configService.get('APP_VERSION') as string;

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
