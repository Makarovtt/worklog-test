import { STORAGE_KEYS } from '@/shared/config/storage';

export const authTokenStorage = {
  read(): string | null {
    return window.localStorage.getItem(STORAGE_KEYS.accessToken);
  },
  write(token: string): void {
    window.localStorage.setItem(STORAGE_KEYS.accessToken, token);
  },
  clear(): void {
    window.localStorage.removeItem(STORAGE_KEYS.accessToken);
  },
};
