import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { WORK_LOG_REPOSITORY, type WorkLogRepository } from '../domain/work-log.repository';

export interface RestoreWorkLogsInput {
  ids: string[];
}

export interface RestoreWorkLogsResult {
  restoredCount: number;
}

@Injectable()
export class RestoreWorkLogsUseCase {
  constructor(@Inject(WORK_LOG_REPOSITORY) private readonly repository: WorkLogRepository) {}

  async execute(input: RestoreWorkLogsInput): Promise<RestoreWorkLogsResult> {
    if (input.ids.length === 0) {
      throw new BadRequestException('Не выбраны записи для восстановления');
    }
    const restoredCount = await this.repository.restore(input.ids);
    return { restoredCount };
  }
}
