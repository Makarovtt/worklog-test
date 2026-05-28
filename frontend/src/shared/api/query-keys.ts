export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  workTypes: {
    all: ['work-types'] as const,
  },
  workers: {
    all: ['workers'] as const,
  },
  workLogs: {
    all: ['work-logs'] as const,
    list: (filter: Record<string, unknown>) => ['work-logs', 'list', filter] as const,
  },
} as const;
