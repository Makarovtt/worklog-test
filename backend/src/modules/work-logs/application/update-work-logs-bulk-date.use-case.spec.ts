import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  WORK_LOG_REPOSITORY,
  type WorkLogRepository,
} from '../domain/work-log.repository';

import { UpdateWorkLogsBulkDateUseCase } from './update-work-logs-bulk-date.use-case';

describe('UpdateWorkLogsBulkDateUseCase', () => {
  let useCase: UpdateWorkLogsBulkDateUseCase;
  let repository: jest.Mocked<WorkLogRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateWorkLogsBulkDateUseCase,
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

    useCase = moduleRef.get(UpdateWorkLogsBulkDateUseCase);
    repository = moduleRef.get(WORK_LOG_REPOSITORY);
  });

  it('передаёт массив идентификаторов и новую дату в репозиторий', async () => {
    const performedAt = new Date('2026-05-28');
    repository.updateManyDate.mockResolvedValue([]);

    await useCase.execute({ ids: ['a', 'b'], performedAt });

    expect(repository.updateManyDate).toHaveBeenCalledWith(['a', 'b'], performedAt);
  });

  it('бросает ошибку при пустом списке', async () => {
    await expect(
      useCase.execute({ ids: [], performedAt: new Date() }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
