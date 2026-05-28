import { Module } from '@nestjs/common';

import { CreateWorkerUseCase } from './application/create-worker.use-case';
import { ListWorkersUseCase } from './application/list-workers.use-case';
import { WORKER_REPOSITORY } from './domain/worker.repository';
import { WorkerPrismaRepository } from './infrastructure/worker.prisma.repository';
import { WorkersController } from './presentation/workers.controller';

@Module({
  controllers: [WorkersController],
  providers: [
    ListWorkersUseCase,
    CreateWorkerUseCase,
    { provide: WORKER_REPOSITORY, useClass: WorkerPrismaRepository },
  ],
  exports: [WORKER_REPOSITORY],
})
export class WorkersModule {}
