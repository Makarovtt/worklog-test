export type UserRole = 'ADMIN' | 'FOREMAN';

export interface PublicUser {
  id: string;
  login: string;
  fullName: string;
  role: UserRole;
}

export interface AuthSession {
  accessToken: string;
  user: PublicUser;
}
