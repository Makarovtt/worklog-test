import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';

import {
  type CreateWorkLogPayload,
  type WorkLog,
  workLogApi,
} from '@/entities/work-log';
import type { ApiError } from '@/shared/api/http-client';
import { queryKeys } from '@/shared/api/query-keys';

export function useCreateWorkLogsBulk() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation<WorkLog[], ApiError, CreateWorkLogPayload[]>({
    mutationFn: (entries) => workLogApi.createBulk(entries),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workLogs.all });
      message.success(`Добавлено записей: ${created.length}`);
    },
    onError: (error) => {
      message.error(error.detail ?? 'Не удалось добавить записи');
    },
  });
}
