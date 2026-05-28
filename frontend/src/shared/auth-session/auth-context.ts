import { createContext, useContext } from 'react';

import type { AuthSession, PublicUser } from './types';

export interface AuthContextValue {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: PublicUser | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}
