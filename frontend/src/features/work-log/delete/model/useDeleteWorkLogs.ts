import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';

import { workLogApi } from '@/entities/work-log';
import type { ApiError } from '@/shared/api/http-client';
import { queryKeys } from '@/shared/api/query-keys';
import { useUndoToast } from '@/shared/lib/use-undo-toast';

interface DeleteResult {
  deletedCount: number;
  ids: string[];
}

export function useDeleteWorkLogs() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const showUndoToast = useUndoToast();

  const restore = async (ids: string[]) => {
    try {
      await workLogApi.restoreMany(ids);
      void queryClient.invalidateQueries({ queryKey: queryKeys.workLogs.all });
      message.success(`Восстановлено записей: ${ids.length}`);
    } catch {
      message.error('Не удалось восстановить записи');
    }
  };

  return useMutation<DeleteResult, ApiError, string[]>({
    mutationFn: async (ids) => {
      const response = await workLogApi.deleteMany(ids);
      return { deletedCount: response.deletedCount, ids };
    },
    onSuccess: ({ deletedCount, ids }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workLogs.all });
      showUndoToast(
        {
          message:
            deletedCount === 1
              ? 'Запись удалена'
              : `Удалено записей: ${deletedCount}`,
        },
        { onUndo: () => restore(ids) },
      );
    },
    onError: (error) => {
      message.error(error.detail ?? 'Не удалось удалить запись');
    },
  });
}
