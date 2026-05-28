import { Inject, Injectable } from '@nestjs/common';

import type { WorkerEntity } from '../domain/worker.entity';
import { WORKER_REPOSITORY, type WorkerRepository } from '../domain/worker.repository';

@Injectable()
export class ListWorkersUseCase {
  constructor(@Inject(WORKER_REPOSITORY) private readonly repository: WorkerRepository) {}

  execute(): Promise<WorkerEntity[]> {
    return this.repository.findAll();
  }
}
