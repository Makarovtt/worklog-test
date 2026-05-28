import { httpClient } from '@/shared/api/http-client';

import type { WorkType } from '../model/types';

export const workTypeApi = {
  async list(): Promise<WorkType[]> {
    const response = await httpClient.get<WorkType[]>('/v1/work-types');
    return response.data;
  },
};
