import type { MeasurementUnit } from '@prisma/client';

import type { WorkLogEntity } from '../domain/work-log.entity';

import type { WorkLogResponseDto } from './dto/work-log.dto';

function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function toWorkLogResponse(entity: WorkLogEntity): WorkLogResponseDto {
  return {
    id: entity.id,
    performedAt: formatDateOnly(entity.performedAt),
    workType: {
      id: entity.workType.id,
      name: entity.workType.name,
      unit: entity.workType.unit as MeasurementUnit,
    },
    worker: {
      id: entity.worker.id,
      fullName: entity.worker.fullName,
      brigade: entity.worker.brigade,
    },
    createdBy: {
      id: entity.createdBy.id,
      fullName: entity.createdBy.fullName,
    },
    volume: entity.volume.toString(),
    note: entity.note,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
