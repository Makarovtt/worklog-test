import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

import { mapPrismaErrorToProblem, toProblemDocument } from './problem-details';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<{ url?: string }>();

    const problem = this.buildProblemDocument(exception, request.url ?? '');

    if (problem.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`Unhandled exception at ${request.url}`, exception as Error);
    }

    response
      .status(problem.status)
      .setHeader('Content-Type', 'application/problem+json')
      .json(problem);
  }

  private buildProblemDocument(exception: unknown, instance: string) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const isObject = typeof response === 'object' && response !== null;
      const detail = isObject
        ? ((response as { message?: string | string[] }).message ?? exception.message)
        : exception.message;

      return toProblemDocument({
        status,
        title: this.getTitleForStatus(status),
        detail: Array.isArray(detail) ? detail.join('; ') : detail,
        instance,
        errors: isObject ? (response as Record<string, unknown>) : undefined,
      });
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return mapPrismaErrorToProblem(exception, instance);
    }

    return toProblemDocument({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      title: 'Internal Server Error',
      detail: 'Произошла внутренняя ошибка сервера',
      instance,
    });
  }

  private getTitleForStatus(status: number): string {
    const titles: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
    };
    return titles[status] ?? 'Error';
  }
}
