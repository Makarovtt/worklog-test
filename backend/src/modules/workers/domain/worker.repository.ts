import type { WorkerEntity } from './worker.entity';

export const WORKER_REPOSITORY = Symbol('WORKER_REPOSITORY');

export interface CreateWorkerData {
  fullName: string;
  brigade?: string | null;
}

export interface WorkerRepository {
  findAll(): Promise<WorkerEntity[]>;
  findById(id: string): Promise<WorkerEntity | null>;
  create(data: CreateWorkerData): Promise<WorkerEntity>;
}
