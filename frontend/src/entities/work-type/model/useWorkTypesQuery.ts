import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/api/query-keys';

import { workTypeApi } from '../api/work-type-api';

const STALE_TIME_MS = 5 * 60 * 1000;

export function useWorkTypesQuery() {
  return useQuery({
    queryKey: queryKeys.workTypes.all,
    queryFn: () => workTypeApi.list(),
    staleTime: STALE_TIME_MS,
  });
}
