import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerCustomOptions } from './swagger-interface';

export const options = (props: any) => {
  const APP_VERSION = props.version || '1.0.1';
  return new DocumentBuilder()
    .setTitle('Basic Nest JS API')
    .setDescription('Nest Framework Rest API')
    .setVersion(APP_VERSION)
    .addBearerAuth()
    .build();
};

export const customOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'My API Docs',
};
