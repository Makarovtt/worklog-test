import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/shared/api/query-keys';

import { workLogApi } from '../api/work-log-api';

import type { WorkLogFilter } from './types';

export function useWorkLogsQuery(filter: WorkLogFilter) {
  return useQuery({
    queryKey: queryKeys.workLogs.list(filter as unknown as Record<string, unknown>),
    queryFn: () => workLogApi.list(filter),
    placeholderData: (previous) => previous,
  });
}
