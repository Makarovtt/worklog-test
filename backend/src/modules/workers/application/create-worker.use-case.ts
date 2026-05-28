import { Inject, Injectable } from '@nestjs/common';

import type { WorkerEntity } from '../domain/worker.entity';
import { WORKER_REPOSITORY, type WorkerRepository } from '../domain/worker.repository';

export interface CreateWorkerInput {
  fullName: string;
  brigade?: string | null;
}

@Injectable()
export class CreateWorkerUseCase {
  constructor(@Inject(WORKER_REPOSITORY) private readonly repository: WorkerRepository) {}

  execute(input: CreateWorkerInput): Promise<WorkerEntity> {
    return this.repository.create(input);
  }
}
