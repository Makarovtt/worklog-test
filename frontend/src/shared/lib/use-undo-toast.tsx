import { App } from 'antd';
import { useCallback } from 'react';

export interface UndoToastOptions {
  message: string;
  undoLabel?: string;
  durationMs?: number;
}

interface Args {
  onUndo: () => void | Promise<void>;
}

const DEFAULT_DURATION_MS = 5000;

export function useUndoToast() {
  const { notification } = App.useApp();

  return useCallback(
    (options: UndoToastOptions, args: Args) => {
      const key = `undo-${Date.now()}-${Math.random()}`;
      let undone = false;

      notification.open({
        key,
        message: options.message,
        description: 'Нажмите «Отменить», чтобы восстановить удалённые записи',
        duration: (options.durationMs ?? DEFAULT_DURATION_MS) / 1000,
        btn: (
          <button
            type="button"
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              padding: '4px 12px',
              background: '#fff',
              cursor: 'pointer',
              fontWeight: 500,
            }}
            onClick={() => {
              undone = true;
              notification.destroy(key);
              void args.onUndo();
            }}
          >
            {options.undoLabel ?? 'Отменить'}
          </button>
        ),
        onClose: () => {
          if (!undone) {
            // Действие подтверждено — отмены не было.
          }
        },
      });
    },
    [notification],
  );
}
