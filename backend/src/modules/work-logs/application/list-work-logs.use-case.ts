import { Inject, Injectable } from '@nestjs/common';

import {
  WORK_LOG_REPOSITORY,
  type ListWorkLogsFilter,
  type ListWorkLogsResult,
  type WorkLogRepository,
} from '../domain/work-log.repository';

@Injectable()
export class ListWorkLogsUseCase {
  constructor(@Inject(WORK_LOG_REPOSITORY) private readonly repository: WorkLogRepository) {}

  execute(filter: ListWorkLogsFilter): Promise<ListWorkLogsResult> {
    return this.repository.list(filter);
  }
}
