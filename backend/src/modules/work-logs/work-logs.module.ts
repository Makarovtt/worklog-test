import { Module } from '@nestjs/common';

import { CreateWorkLogUseCase } from './application/create-work-log.use-case';
import { CreateWorkLogsBulkUseCase } from './application/create-work-logs-bulk.use-case';
import { DeleteWorkLogsUseCase } from './application/delete-work-logs.use-case';
import { ListWorkLogsUseCase } from './application/list-work-logs.use-case';
import { RestoreWorkLogsUseCase } from './application/restore-work-logs.use-case';
import { UpdateWorkLogUseCase } from './application/update-work-log.use-case';
import { UpdateWorkLogsBulkDateUseCase } from './application/update-work-logs-bulk-date.use-case';
import { WORK_LOG_REPOSITORY } from './domain/work-log.repository';
import { WorkLogPrismaRepository } from './infrastructure/work-log.prisma.repository';
import { WorkLogsController } from './presentation/work-logs.controller';

@Module({
  controllers: [WorkLogsController],
  providers: [
    ListWorkLogsUseCase,
    CreateWorkLogUseCase,
    CreateWorkLogsBulkUseCase,
    UpdateWorkLogUseCase,
    UpdateWorkLogsBulkDateUseCase,
    DeleteWorkLogsUseCase,
    RestoreWorkLogsUseCase,
    { provide: WORK_LOG_REPOSITORY, useClass: WorkLogPrismaRepository },
  ],
})
export class WorkLogsModule {}
