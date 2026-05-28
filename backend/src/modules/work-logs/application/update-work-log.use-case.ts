import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { WorkLogEntity } from '../domain/work-log.entity';
import {
  WORK_LOG_REPOSITORY,
  type UpdateWorkLogData,
  type WorkLogRepository,
} from '../domain/work-log.repository';

export interface UpdateWorkLogInput {
  id: string;
  performedAt?: Date;
  workTypeId?: string;
  volume?: number;
  workerId?: string;
  note?: string | null;
}

@Injectable()
export class UpdateWorkLogUseCase {
  constructor(@Inject(WORK_LOG_REPOSITORY) private readonly repository: WorkLogRepository) {}

  async execute(input: UpdateWorkLogInput): Promise<WorkLogEntity> {
    const existing = await this.repository.findById(input.id);
    if (!existing) {
      throw new NotFoundException('Запись не найдена');
    }
    if (input.volume !== undefined && input.volume <= 0) {
      throw new BadRequestException('Объём должен быть положительным');
    }
    const payload: UpdateWorkLogData = {};
    if (input.performedAt !== undefined) payload.performedAt = input.performedAt;
    if (input.workTypeId !== undefined) payload.workTypeId = input.workTypeId;
    if (input.volume !== undefined) payload.volume = input.volume;
    if (input.workerId !== undefined) payload.workerId = input.workerId;
    if (input.note !== undefined) payload.note = input.note;
    return this.repository.update(input.id, payload);
  }
}
