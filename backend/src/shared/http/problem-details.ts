import { HttpStatus } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

export interface ProblemDocument {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: Record<string, unknown>;
}

interface ProblemInput {
  status: number;
  title: string;
  detail: string;
  instance: string;
  errors?: Record<string, unknown>;
}

export function toProblemDocument(input: ProblemInput): ProblemDocument {
  return {
    type: `https://httpstatuses.io/${input.status}`,
    title: input.title,
    status: input.status,
    detail: input.detail,
    instance: input.instance,
    ...(input.errors ? { errors: input.errors } : {}),
  };
}

export function mapPrismaErrorToProblem(
  error: Prisma.PrismaClientKnownRequestError,
  instance: string,
): ProblemDocument {
  if (error.code === 'P2002') {
    return toProblemDocument({
      status: HttpStatus.CONFLICT,
      title: 'Conflict',
      detail: 'Запись с такими параметрами уже существует',
      instance,
    });
  }
  if (error.code === 'P2003') {
    return toProblemDocument({
      status: HttpStatus.BAD_REQUEST,
      title: 'Bad Request',
      detail: 'Ссылка на несуществующую связанную запись',
      instance,
    });
  }
  if (error.code === 'P2025') {
    return toProblemDocument({
      status: HttpStatus.NOT_FOUND,
      title: 'Not Found',
      detail: 'Запись не найдена',
      instance,
    });
  }
  return toProblemDocument({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    title: 'Database Error',
    detail: 'Ошибка взаимодействия с базой данных',
    instance,
  });
}
