import type { MeasurementUnit } from '@prisma/client';

export interface WorkTypeEntity {
  id: string;
  name: string;
  unit: MeasurementUnit;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
