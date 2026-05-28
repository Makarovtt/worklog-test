import { httpClient } from '@/shared/api/http-client';

import type {
  CreateWorkLogPayload,
  UpdateWorkLogPayload,
  WorkLog,
  WorkLogFilter,
  WorkLogListResponse,
} from '../model/types';

export const workLogApi = {
  async list(filter: WorkLogFilter): Promise<WorkLogListResponse> {
    const response = await httpClient.get<WorkLogListResponse>('/v1/work-logs', {
      params: {
        dateFrom: filter.dateFrom,
        dateTo: filter.dateTo,
        workTypeId: filter.workTypeId,
        workerId: filter.workerId,
        page: filter.page,
        pageSize: filter.pageSize,
        sortBy: 'performedAt',
        sortDirection: filter.sortDirection,
      },
    });
    return response.data;
  },

  async create(payload: CreateWorkLogPayload): Promise<WorkLog> {
    const response = await httpClient.post<WorkLog>('/v1/work-logs', payload);
    return response.data;
  },

  async createBulk(entries: CreateWorkLogPayload[]): Promise<WorkLog[]> {
    const response = await httpClient.post<WorkLog[]>('/v1/work-logs/bulk', { entries });
    return response.data;
  },

  async update(id: string, payload: UpdateWorkLogPayload): Promise<WorkLog> {
    const response = await httpClient.patch<WorkLog>(`/v1/work-logs/${id}`, payload);
    return response.data;
  },

  async updateBulkDate(ids: string[], performedAt: string): Promise<WorkLog[]> {
    const response = await httpClient.patch<WorkLog[]>('/v1/work-logs/bulk/date', {
      ids,
      performedAt,
    });
    return response.data;
  },

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const response = await httpClient.delete<{ deletedCount: number }>('/v1/work-logs', {
      data: { ids },
    });
    return response.data;
  },

  async restoreMany(ids: string[]): Promise<{ restoredCount: number }> {
    const response = await httpClient.post<{ restoredCount: number }>('/v1/work-logs/restore', {
      ids,
    });
    return response.data;
  },
};
