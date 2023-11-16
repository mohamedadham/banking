import {
  InsufficientBalanceError,
  NotFoundError,
} from './../errors/custom-errors';

import {
  HttpException,
  HttpStatus,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

export const mapErrorToResponse = (
  error: HttpException | Error,
): { status: number; message: string } => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = error.message || 'Internal Server Error';

  if (error instanceof HttpException) {
    statusCode = error.getStatus();
    errorMessage = error.message;
  } else if (error instanceof InsufficientBalanceError) {
    statusCode = HttpStatus.NOT_FOUND;
  } else if (error instanceof NotFoundError) {
    statusCode = HttpStatus.NOT_FOUND;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma known errors
    statusCode = HttpStatus.BAD_REQUEST;
    errorMessage = error.message;
  }

  return { status: statusCode, message: errorMessage };
};

@Catch(InsufficientBalanceError, NotFoundError, Error)
export class CustomExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const { status, message } = mapErrorToResponse(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
