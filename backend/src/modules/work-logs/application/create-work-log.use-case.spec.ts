import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  WORK_LOG_REPOSITORY,
  type WorkLogRepository,
} from '../domain/work-log.repository';

import { CreateWorkLogUseCase } from './create-work-log.use-case';

describe('CreateWorkLogUseCase', () => {
  let useCase: CreateWorkLogUseCase;
  let repository: jest.Mocked<WorkLogRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateWorkLogUseCase,
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

    useCase = moduleRef.get(CreateWorkLogUseCase);
    repository = moduleRef.get(WORK_LOG_REPOSITORY);
  });

  it('создаёт запись через репозиторий при валидных данных', async () => {
    const created = { id: 'work-log-id' } as Awaited<ReturnType<typeof repository.create>>;
    repository.create.mockResolvedValue(created);

    const result = await useCase.execute({
      performedAt: new Date('2026-05-28'),
      workTypeId: 'work-type-id',
      volume: 24.5,
      workerId: 'worker-id',
      createdById: 'user-id',
    });

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(result).toBe(created);
  });

  it('отклоняет запись с нулевым объёмом', async () => {
    await expect(
      useCase.execute({
        performedAt: new Date('2026-05-28'),
        workTypeId: 'work-type-id',
        volume: 0,
        workerId: 'worker-id',
        createdById: 'user-id',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('отклоняет запись с отрицательным объёмом', async () => {
    await expect(
      useCase.execute({
        performedAt: new Date('2026-05-28'),
        workTypeId: 'work-type-id',
        volume: -5,
        workerId: 'worker-id',
        createdById: 'user-id',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
