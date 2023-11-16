import { ValidationPipe as NestValidationPipe } from '@nestjs/common';
import { ValidationOptions } from 'class-validator';

export class ValidationPipe extends NestValidationPipe {
  constructor(validationOptions?: ValidationOptions) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: true, value: true },
      ...validationOptions,
    });
  }
}
