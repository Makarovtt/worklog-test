import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { z } from 'zod';

import { LoginPage } from '@/pages/login';
import { RegisterPage } from '@/pages/register';
import { WorkLogsPage } from '@/pages/work-logs';
import { authTokenStorage } from '@/shared/api/auth-token-storage';
import { ROUTES } from '@/shared/config/routes';

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.root,
  beforeLoad: () => {
    throw redirect({ to: ROUTES.workLogs });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.login,
  beforeLoad: () => {
    if (authTokenStorage.read()) {
      throw redirect({ to: ROUTES.workLogs });
    }
  },
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.register,
  beforeLoad: () => {
    if (authTokenStorage.read()) {
      throw redirect({ to: ROUTES.workLogs });
    }
  },
  component: RegisterPage,
});

export const workLogsSearchSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  workTypeId: z.string().uuid().optional(),
  workerId: z.string().uuid().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(200).default(20),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

export type WorkLogsSearch = z.infer<typeof workLogsSearchSchema>;

const workLogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.workLogs,
  validateSearch: workLogsSearchSchema,
  beforeLoad: ({ location }) => {
    if (!authTokenStorage.read()) {
      throw redirect({ to: ROUTES.login, search: { redirect: location.href } });
    }
  },
  component: WorkLogsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, registerRoute, workLogsRoute]);

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter;
  }
}
