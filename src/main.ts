import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
import { CategoryPresenter } from './categories/infrastructure/presenters/category.presenter';
import { DevicePresenter } from './devices/infrastructure/presenters/device.presenter';
import { applyGlobalConfig } from './global-config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app
    .getHttpAdapter()
    .getInstance()
    .register(fastifyCors, {
      origin: '*',
      methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: '*',
    });

  const config = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE)
    .setDescription(process.env.SWAGGER_DESCRIPTION)
    .setVersion(process.env.SWAGGER_VERSION)
    .addServer(process.env.SWAGGER_API_URL)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [CategoryPresenter, DevicePresenter],
  });
  SwaggerModule.setup('swagger', app, document);

  applyGlobalConfig(app);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
