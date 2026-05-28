import type { MeasurementUnit } from '@prisma/client';

import type { WorkTypeEntity } from './work-type.entity';

export const WORK_TYPE_REPOSITORY = Symbol('WORK_TYPE_REPOSITORY');

export interface CreateWorkTypeData {
  name: string;
  unit: MeasurementUnit;
}

export interface WorkTypeRepository {
  findAll(): Promise<WorkTypeEntity[]>;
  findById(id: string): Promise<WorkTypeEntity | null>;
  create(data: CreateWorkTypeData): Promise<WorkTypeEntity>;
}
