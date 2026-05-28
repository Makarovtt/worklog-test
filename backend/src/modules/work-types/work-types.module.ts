import { Module } from '@nestjs/common';

import { CreateWorkTypeUseCase } from './application/create-work-type.use-case';
import { ListWorkTypesUseCase } from './application/list-work-types.use-case';
import { WORK_TYPE_REPOSITORY } from './domain/work-type.repository';
import { WorkTypePrismaRepository } from './infrastructure/work-type.prisma.repository';
import { WorkTypesController } from './presentation/work-types.controller';

@Module({
  controllers: [WorkTypesController],
  providers: [
    ListWorkTypesUseCase,
    CreateWorkTypeUseCase,
    { provide: WORK_TYPE_REPOSITORY, useClass: WorkTypePrismaRepository },
  ],
  exports: [WORK_TYPE_REPOSITORY],
})
export class WorkTypesModule {}
