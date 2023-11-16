import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as dotenv from 'dotenv';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.useGlobalFilters(new CustomExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(port, '0.0.0.0');
}
bootstrap();
