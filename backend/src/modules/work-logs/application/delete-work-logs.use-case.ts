import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { WORK_LOG_REPOSITORY, type WorkLogRepository } from '../domain/work-log.repository';

export interface DeleteWorkLogsInput {
  ids: string[];
}

export interface DeleteWorkLogsResult {
  deletedCount: number;
}

@Injectable()
export class DeleteWorkLogsUseCase {
  constructor(@Inject(WORK_LOG_REPOSITORY) private readonly repository: WorkLogRepository) {}

  async execute(input: DeleteWorkLogsInput): Promise<DeleteWorkLogsResult> {
    if (input.ids.length === 0) {
      throw new BadRequestException('Не выбраны записи для удаления');
    }
    const deletedCount = await this.repository.softDelete(input.ids);
    return { deletedCount };
  }
}
