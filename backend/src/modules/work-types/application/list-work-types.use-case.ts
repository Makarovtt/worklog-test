import { Inject, Injectable } from '@nestjs/common';

import type { WorkTypeEntity } from '../domain/work-type.entity';
import { WORK_TYPE_REPOSITORY, type WorkTypeRepository } from '../domain/work-type.repository';

@Injectable()
export class ListWorkTypesUseCase {
  constructor(
    @Inject(WORK_TYPE_REPOSITORY) private readonly repository: WorkTypeRepository,
  ) {}

  execute(): Promise<WorkTypeEntity[]> {
    return this.repository.findAll();
  }
}
