import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';

import { type UpdateWorkLogPayload, type WorkLog, workLogApi } from '@/entities/work-log';
import type { ApiError } from '@/shared/api/http-client';
import { queryKeys } from '@/shared/api/query-keys';

interface Variables {
  id: string;
  payload: UpdateWorkLogPayload;
}

export function useUpdateWorkLog() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation<WorkLog, ApiError, Variables>({
    mutationFn: ({ id, payload }) => workLogApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workLogs.all });
      message.success('Запись обновлена');
    },
    onError: (error) => {
      message.error(error.detail ?? 'Не удалось обновить запись');
    },
  });
}
