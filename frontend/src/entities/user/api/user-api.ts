import { httpClient } from '@/shared/api/http-client';
import type { AuthSession, PublicUser } from '@/shared/auth-session';

interface LoginPayload {
  login: string;
  password: string;
}

interface RegisterPayload {
  login: string;
  password: string;
  fullName: string;
}

export const userApi = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const response = await httpClient.post<AuthSession>('/v1/auth/login', payload);
    return response.data;
  },
  async register(payload: RegisterPayload): Promise<AuthSession> {
    const response = await httpClient.post<AuthSession>('/v1/auth/register', payload);
    return response.data;
  },
  async me(): Promise<PublicUser> {
    const response = await httpClient.get<PublicUser>('/v1/auth/me');
    return response.data;
  },
};
