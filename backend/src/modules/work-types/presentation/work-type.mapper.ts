import type { WorkTypeEntity } from '../domain/work-type.entity';

import type { WorkTypeResponseDto } from './dto/work-type.dto';

export function toWorkTypeResponse(entity: WorkTypeEntity): WorkTypeResponseDto {
  return {
    id: entity.id,
    name: entity.name,
    unit: entity.unit,
    isActive: entity.isActive,
  };
}
