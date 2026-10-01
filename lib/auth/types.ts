/**
 * NAAG NOOL UP — Authentication & Authorization Type Definitions
 */

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN';

export interface AuthSessionUser {
  id: string;
  email: string;
  fullName?: string | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserMetadata {
  full_name?: string;
  name?: string;
  avatar_url?: string;
}

export interface AppMetadata {
  role?: UserRole;
  provider?: string;
  providers?: string[];
  [key: string]: unknown;
}

export interface AuthErrorDetails {
  code: string;
  message: string;
  status: number;
}
