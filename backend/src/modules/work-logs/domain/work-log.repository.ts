import type { WorkLogEntity } from './work-log.entity';

export const WORK_LOG_REPOSITORY = Symbol('WORK_LOG_REPOSITORY');

export type SortDirection = 'asc' | 'desc';

export interface ListWorkLogsFilter {
  dateFrom?: Date;
  dateTo?: Date;
  workTypeId?: string;
  workerId?: string;
  page: number;
  pageSize: number;
  sortBy: 'performedAt' | 'createdAt';
  sortDirection: SortDirection;
}

export interface ListWorkLogsResult {
  items: WorkLogEntity[];
  total: number;
}

export interface CreateWorkLogData {
  performedAt: Date;
  workTypeId: string;
  volume: number | string;
  workerId: string;
  note?: string | null;
  createdById: string;
}

export interface UpdateWorkLogData {
  performedAt?: Date;
  workTypeId?: string;
  volume?: number | string;
  workerId?: string;
  note?: string | null;
}

export interface WorkLogRepository {
  list(filter: ListWorkLogsFilter): Promise<ListWorkLogsResult>;
  findById(id: string): Promise<WorkLogEntity | null>;
  create(data: CreateWorkLogData): Promise<WorkLogEntity>;
  createMany(data: CreateWorkLogData[]): Promise<WorkLogEntity[]>;
  update(id: string, data: UpdateWorkLogData): Promise<WorkLogEntity>;
  updateManyDate(ids: string[], performedAt: Date): Promise<WorkLogEntity[]>;
  softDelete(ids: string[]): Promise<number>;
  restore(ids: string[]): Promise<number>;
}
