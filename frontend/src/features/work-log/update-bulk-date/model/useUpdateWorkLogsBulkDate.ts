import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';

import { type WorkLog, workLogApi } from '@/entities/work-log';
import type { ApiError } from '@/shared/api/http-client';
import { queryKeys } from '@/shared/api/query-keys';

interface Variables {
  ids: string[];
  performedAt: string;
}

export function useUpdateWorkLogsBulkDate() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation<WorkLog[], ApiError, Variables>({
    mutationFn: ({ ids, performedAt }) => workLogApi.updateBulkDate(ids, performedAt),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workLogs.all });
      message.success(`Обновлено записей: ${updated.length}`);
    },
    onError: (error) => {
      message.error(error.detail ?? 'Не удалось обновить даты');
    },
  });
}
