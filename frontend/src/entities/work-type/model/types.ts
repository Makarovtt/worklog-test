import type { MeasurementUnit } from '@/shared/lib/format-volume';

export interface WorkType {
  id: string;
  name: string;
  unit: MeasurementUnit;
  isActive: boolean;
}
