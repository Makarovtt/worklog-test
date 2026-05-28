import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/api/query-keys';

import { workerApi } from '../api/worker-api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useWorkersQuery() {
  return useQuery({
    queryKey: queryKeys.workers.all,
    queryFn: () => workerApi.list(),
    staleTime: STALE_TIME_MS,
  });
}
