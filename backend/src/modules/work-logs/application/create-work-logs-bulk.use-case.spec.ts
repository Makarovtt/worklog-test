import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  WORK_LOG_REPOSITORY,
  type WorkLogRepository,
} from '../domain/work-log.repository';

import { CreateWorkLogsBulkUseCase } from './create-work-logs-bulk.use-case';

function buildEntry(volume = 10): {
  performedAt: Date;
  workTypeId: string;
  volume: number;
  workerId: string;
} {
  return {
    performedAt: new Date('2026-05-28'),
    workTypeId: 'work-type-id',
    volume,
    workerId: 'worker-id',
  };
}

describe('CreateWorkLogsBulkUseCase', () => {
  let useCase: CreateWorkLogsBulkUseCase;
  let repository: jest.Mocked<WorkLogRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateWorkLogsBulkUseCase,
        {
          provide: WORK_LOG_REPOSITORY,
          useValue: {
            list: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            createMany: jest.fn(),
            update: jest.fn(),
            updateManyDate: jest.fn(),
            softDelete: jest.fn(),
            restore: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = moduleRef.get(CreateWorkLogsBulkUseCase);
    repository = moduleRef.get(WORK_LOG_REPOSITORY);
  });

  it('создаёт несколько записей одним вызовом репозитория', async () => {
    repository.createMany.mockResolvedValue([] as Awaited<ReturnType<typeof repository.createMany>>);

    await useCase.execute({
      createdById: 'user-id',
      entries: [buildEntry(10), buildEntry(20), buildEntry(30)],
    });

    expect(repository.createMany).toHaveBeenCalledTimes(1);
    const argument = repository.createMany.mock.calls[0]?.[0];
    expect(argument).toHaveLength(3);
    expect(argument?.[0]?.createdById).toBe('user-id');
  });

  it('отклоняет пустой список', async () => {
    await expect(useCase.execute({ createdById: 'u', entries: [] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.createMany).not.toHaveBeenCalled();
  });

  it('отклоняет пакет, превышающий лимит', async () => {
    const oversized = Array.from({ length: 101 }, () => buildEntry());
    await expect(
      useCase.execute({ createdById: 'u', entries: oversized }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('отклоняет пакет, если хотя бы одна запись с непозитивным объёмом', async () => {
    await expect(
      useCase.execute({
        createdById: 'u',
        entries: [buildEntry(10), buildEntry(0), buildEntry(20)],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.createMany).not.toHaveBeenCalled();
  });
});
