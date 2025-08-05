import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });
  await app.listen(3001);
  Logger.log(`App is running on: ${process.env.NEXT_PUBLIC_ENDPOINT_URL}`, 'Bootstrap');
}

bootstrap();
