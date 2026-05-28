import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import type { WorkLogEntity } from '../domain/work-log.entity';
import {
  WORK_LOG_REPOSITORY,
  type WorkLogRepository,
} from '../domain/work-log.repository';

import { UpdateWorkLogUseCase } from './update-work-log.use-case';

const EXISTING_ENTITY = { id: 'existing-id' } as WorkLogEntity;

describe('UpdateWorkLogUseCase', () => {
  let useCase: UpdateWorkLogUseCase;
  let repository: jest.Mocked<WorkLogRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateWorkLogUseCase,
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

    useCase = moduleRef.get(UpdateWorkLogUseCase);
    repository = moduleRef.get(WORK_LOG_REPOSITORY);
  });

  it('бросает NotFound, если запись отсутствует', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(useCase.execute({ id: 'missing' })).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('бросает BadRequest при попытке выставить непозитивный объём', async () => {
    repository.findById.mockResolvedValue(EXISTING_ENTITY);
    await expect(useCase.execute({ id: 'existing-id', volume: 0 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('передаёт в репозиторий только переданные поля', async () => {
    repository.findById.mockResolvedValue(EXISTING_ENTITY);
    repository.update.mockResolvedValue(EXISTING_ENTITY);

    await useCase.execute({ id: 'existing-id', note: 'обновлённый комментарий' });

    expect(repository.update).toHaveBeenCalledWith('existing-id', {
      note: 'обновлённый комментарий',
    });
  });
});
