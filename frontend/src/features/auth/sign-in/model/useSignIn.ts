import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';

import { type AuthSession, userApi } from '@/entities/user';
import type { ApiError } from '@/shared/api/http-client';
import { useAuth } from '@/shared/auth-session';
import { ROUTES } from '@/shared/config/routes';

interface SignInPayload {
  login: string;
  password: string;
}

export function useSignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  return useMutation<AuthSession, ApiError, SignInPayload>({
    mutationFn: (payload) => userApi.login(payload),
    onSuccess: (session) => {
      signIn(session);
      message.success(`Добро пожаловать, ${session.user.fullName}`);
      navigate({ to: ROUTES.workLogs });
    },
    onError: (error) => {
      message.error(error.detail ?? 'Не удалось войти');
    },
  });
}
