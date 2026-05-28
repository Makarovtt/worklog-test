import axios, { type AxiosError, type AxiosInstance } from 'axios';

import { env } from '@/shared/config/env';

import { authTokenStorage } from './auth-token-storage';

export interface ApiProblemDocument {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: Record<string, unknown>;
}

export interface ApiError extends Error {
  status: number;
  detail: string;
  problem?: ApiProblemDocument;
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

export function createHttpClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    timeout: 15000,
  });

  instance.interceptors.request.use((config) => {
    const token = authTokenStorage.read();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiProblemDocument>) => {
      if (error.response?.status === 401 && unauthorizedHandler) {
        unauthorizedHandler();
      }
      const problem = error.response?.data;
      const apiError = new Error(
        problem?.detail ?? error.message ?? 'Неизвестная ошибка',
      ) as ApiError;
      apiError.status = error.response?.status ?? 0;
      apiError.detail = problem?.detail ?? error.message ?? 'Неизвестная ошибка';
      apiError.problem = problem;
      return Promise.reject(apiError);
    },
  );

  return instance;
}

export const httpClient = createHttpClient();
