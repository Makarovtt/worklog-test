import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';

import { type CreateWorkLogPayload, type WorkLog, workLogApi } from '@/entities/work-log';
import type { ApiError } from '@/shared/api/http-client';
import { queryKeys } from '@/shared/api/query-keys';

export function useCreateWorkLog() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation<WorkLog, ApiError, CreateWorkLogPayload>({
    mutationFn: (payload) => workLogApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workLogs.all });
      message.success('Запись добавлена');
    },
    onError: (error) => {
      message.error(error.detail ?? 'Не удалось создать запись');
    },
  });
}
