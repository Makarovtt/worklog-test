import { httpClient } from '@/shared/api/http-client';

import type { Worker } from '../model/types';

export const workerApi = {
  async list(): Promise<Worker[]> {
    const response = await httpClient.get<Worker[]>('/v1/workers');
    return response.data;
  },
};
