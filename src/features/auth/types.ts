/** Matches backend AuthUserProfile */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  provider: string;
  avatar?: string;
  isActive: boolean;
}

/** Matches backend LoginResponse */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  initializing: boolean;
  authenticated: boolean;
  user: AuthUser | null;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  getAccessToken: () => string | null;
}
