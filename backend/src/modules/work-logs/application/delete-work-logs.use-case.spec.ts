import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  WORK_LOG_REPOSITORY,
  type WorkLogRepository,
} from '../domain/work-log.repository';

import { DeleteWorkLogsUseCase } from './delete-work-logs.use-case';
import { RestoreWorkLogsUseCase } from './restore-work-logs.use-case';

describe('DeleteWorkLogsUseCase + RestoreWorkLogsUseCase', () => {
  let deleteUseCase: DeleteWorkLogsUseCase;
  let restoreUseCase: RestoreWorkLogsUseCase;
  let repository: jest.Mocked<WorkLogRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteWorkLogsUseCase,
        RestoreWorkLogsUseCase,
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

    deleteUseCase = moduleRef.get(DeleteWorkLogsUseCase);
    restoreUseCase = moduleRef.get(RestoreWorkLogsUseCase);
    repository = moduleRef.get(WORK_LOG_REPOSITORY);
  });

  it('возвращает количество удалённых записей', async () => {
    repository.softDelete.mockResolvedValue(3);
    const result = await deleteUseCase.execute({ ids: ['a', 'b', 'c'] });
    expect(result.deletedCount).toBe(3);
  });

  it('бросает ошибку при пустом списке на удаление', async () => {
    await expect(deleteUseCase.execute({ ids: [] })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('восстанавливает удалённые записи', async () => {
    repository.restore.mockResolvedValue(2);
    const result = await restoreUseCase.execute({ ids: ['a', 'b'] });
    expect(result.restoredCount).toBe(2);
  });

  it('бросает ошибку при пустом списке на восстановление', async () => {
    await expect(restoreUseCase.execute({ ids: [] })).rejects.toBeInstanceOf(BadRequestException);
  });
});
