import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

import { createAdmin } from './utils/init-BD-createAdmin';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') as number;
  const PG_DB = configService.get('PG_DB') as string;

  void createAdmin({ PG_DB })
  .then(() =>
    console.log(`Admin user exists or has been created: login - admin, password - admin`),
  )
  .catch((e) => console.log('Error: ', e));

  await app.listen(PORT, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
