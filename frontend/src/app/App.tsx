import { QueryClient } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useState } from 'react';

import { AntdProvider } from './providers/AntdProvider';
import { AuthProvider } from './providers/auth';
import { ErrorBoundary } from './providers/ErrorBoundary';
import { QueryProvider } from './providers/QueryProvider';
import { createAppRouter } from './router/router';

const STALE_TIME_MS = 30_000;

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME_MS,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 0 },
        },
      }),
  );
  const [router] = useState(() => createAppRouter(queryClient));

  return (
    <ErrorBoundary>
      <AntdProvider>
        <QueryProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryProvider>
      </AntdProvider>
    </ErrorBoundary>
  );
}
