import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import type { WorkLogEntity } from '../domain/work-log.entity';
import { WORK_LOG_REPOSITORY, type WorkLogRepository } from '../domain/work-log.repository';

export interface UpdateWorkLogsBulkDateInput {
  ids: string[];
  performedAt: Date;
}

@Injectable()
export class UpdateWorkLogsBulkDateUseCase {
  constructor(@Inject(WORK_LOG_REPOSITORY) private readonly repository: WorkLogRepository) {}

  async execute(input: UpdateWorkLogsBulkDateInput): Promise<WorkLogEntity[]> {
    if (input.ids.length === 0) {
      throw new BadRequestException('Не выбраны записи для обновления');
    }
    return this.repository.updateManyDate(input.ids, input.performedAt);
  }
}
