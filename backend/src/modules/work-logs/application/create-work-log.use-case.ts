import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import type { WorkLogEntity } from '../domain/work-log.entity';
import { WORK_LOG_REPOSITORY, type WorkLogRepository } from '../domain/work-log.repository';

export interface CreateWorkLogInput {
  performedAt: Date;
  workTypeId: string;
  volume: number;
  workerId: string;
  note?: string | null;
  createdById: string;
}

@Injectable()
export class CreateWorkLogUseCase {
  constructor(@Inject(WORK_LOG_REPOSITORY) private readonly repository: WorkLogRepository) {}

  async execute(input: CreateWorkLogInput): Promise<WorkLogEntity> {
    if (input.volume <= 0) {
      throw new BadRequestException('Объём должен быть положительным');
    }
    return this.repository.create(input);
  }
}
