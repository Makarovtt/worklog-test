import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';

import { userApi } from '@/entities/user';
import { authTokenStorage } from '@/shared/api/auth-token-storage';
import { setUnauthorizedHandler } from '@/shared/api/http-client';
import {
  AuthContext,
  type AuthContextValue,
  type AuthSession,
  type PublicUser,
} from '@/shared/auth-session';

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthContextValue['status']>('loading');
  const [user, setUser] = useState<PublicUser | null>(null);

  const signIn = useCallback((session: AuthSession) => {
    authTokenStorage.write(session.accessToken);
    setUser(session.user);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(() => {
    authTokenStorage.clear();
    setUser(null);
    setStatus('unauthenticated');
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      authTokenStorage.clear();
      setUser(null);
      setStatus('unauthenticated');
      queryClient.clear();
    });
  }, [queryClient]);

  useEffect(() => {
    const token = authTokenStorage.read();
    if (!token) {
      setStatus('unauthenticated');
      return;
    }
    userApi
      .me()
      .then((current) => {
        setUser(current);
        setStatus('authenticated');
      })
      .catch(() => {
        authTokenStorage.clear();
        setStatus('unauthenticated');
      });
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
