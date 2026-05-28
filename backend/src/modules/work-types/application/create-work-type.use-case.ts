import { Inject, Injectable } from '@nestjs/common';
import type { MeasurementUnit } from '@prisma/client';

import type { WorkTypeEntity } from '../domain/work-type.entity';
import { WORK_TYPE_REPOSITORY, type WorkTypeRepository } from '../domain/work-type.repository';

export interface CreateWorkTypeInput {
  name: string;
  unit: MeasurementUnit;
}

@Injectable()
export class CreateWorkTypeUseCase {
  constructor(
    @Inject(WORK_TYPE_REPOSITORY) private readonly repository: WorkTypeRepository,
  ) {}

  execute(input: CreateWorkTypeInput): Promise<WorkTypeEntity> {
    return this.repository.create(input);
  }
}
