import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import type { WorkLogEntity } from '../domain/work-log.entity';
import {
  WORK_LOG_REPOSITORY,
  type CreateWorkLogData,
  type WorkLogRepository,
} from '../domain/work-log.repository';

export interface CreateWorkLogsBulkInput {
  entries: Array<{
    performedAt: Date;
    workTypeId: string;
    volume: number;
    workerId: string;
    note?: string | null;
  }>;
  createdById: string;
}

const BULK_LIMIT = 100;

@Injectable()
export class CreateWorkLogsBulkUseCase {
  constructor(@Inject(WORK_LOG_REPOSITORY) private readonly repository: WorkLogRepository) {}

  async execute(input: CreateWorkLogsBulkInput): Promise<WorkLogEntity[]> {
    if (input.entries.length === 0) {
      throw new BadRequestException('Список записей не может быть пустым');
    }
    if (input.entries.length > BULK_LIMIT) {
      throw new BadRequestException(`Максимум записей за один раз: ${BULK_LIMIT}`);
    }
    for (const entry of input.entries) {
      if (entry.volume <= 0) {
        throw new BadRequestException('Все записи должны иметь положительный объём');
      }
    }
    const payload: CreateWorkLogData[] = input.entries.map((entry) => ({
      performedAt: entry.performedAt,
      workTypeId: entry.workTypeId,
      volume: entry.volume,
      workerId: entry.workerId,
      note: entry.note ?? null,
      createdById: input.createdById,
    }));
    return this.repository.createMany(payload);
  }
}
