import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { App } from 'antd';

import { type AuthSession, userApi } from '@/entities/user';
import type { ApiError } from '@/shared/api/http-client';
import { useAuth } from '@/shared/auth-session';
import { ROUTES } from '@/shared/config/routes';

interface SignUpPayload {
  login: string;
  password: string;
  fullName: string;
}

export function useSignUp() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();

  return useMutation<AuthSession, ApiError, SignUpPayload>({
    mutationFn: (payload) => userApi.register(payload),
    onSuccess: (session) => {
      signIn(session);
      message.success('Регистрация прошла успешно');
      navigate({ to: ROUTES.workLogs });
    },
    onError: (error) => {
      message.error(error.detail ?? 'Не удалось зарегистрироваться');
    },
  });
}
