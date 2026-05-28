import type { MeasurementUnit } from '@/shared/lib/format-volume';

export interface WorkLog {
  id: string;
  performedAt: string;
  workType: { id: string; name: string; unit: MeasurementUnit };
  worker: { id: string; fullName: string; brigade: string | null };
  createdBy: { id: string; fullName: string };
  volume: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLogListResponse {
  items: WorkLog[];
  total: number;
  page: number;
  pageSize: number;
}

export interface WorkLogFilter {
  dateFrom?: string;
  dateTo?: string;
  workTypeId?: string;
  workerId?: string;
  page: number;
  pageSize: number;
  sortDirection: 'asc' | 'desc';
}

export interface CreateWorkLogPayload {
  performedAt: string;
  workTypeId: string;
  volume: number;
  workerId: string;
  note?: string | null;
}

export interface UpdateWorkLogPayload {
  performedAt?: string;
  workTypeId?: string;
  volume?: number;
  workerId?: string;
  note?: string | null;
}
