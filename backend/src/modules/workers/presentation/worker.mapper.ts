import type { WorkerEntity } from '../domain/worker.entity';

import type { WorkerResponseDto } from './dto/worker.dto';

export function toWorkerResponse(entity: WorkerEntity): WorkerResponseDto {
  return {
    id: entity.id,
    fullName: entity.fullName,
    brigade: entity.brigade,
    isActive: entity.isActive,
  };
}
