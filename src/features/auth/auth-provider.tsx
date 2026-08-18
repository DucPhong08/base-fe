import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import {
  httpClient,
  setTokenGetter,
  setOnUnauthorized,
} from '../../shared/api/http-client';
import type {
  AuthContextValue,
  AuthUser,
  LoginCredentials,
  LoginResponse,
} from './types';

const REFRESH_TOKEN_KEY = 'refresh_token';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const accessTokenRef = useRef<string | null>(null);

  const getAccessToken = useCallback(() => accessTokenRef.current, []);

  const clearAuth = useCallback(() => {
    accessTokenRef.current = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
  }, []);

  const setAuth = useCallback((data: LoginResponse) => {
    accessTokenRef.current = data.accessToken;
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUser(data.user);
  }, []);

  // Register token getter & unauthorized handler with http-client
  useEffect(() => {
    setTokenGetter(getAccessToken);
    setOnUnauthorized(clearAuth);
  }, [getAccessToken, clearAuth]);

  // Restore session from refresh token on mount
  useEffect(() => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      setUser(null);
      setInitializing(false);
      return;
    }

    httpClient
      .post<LoginResponse>('/auth/refresh', { refreshToken })
      .then((data) => {
        setAuth(data as unknown as LoginResponse);
      })
      .catch(() => {
        clearAuth();
      })
      .finally(() => {
        setInitializing(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const data = (await httpClient.post(
        '/auth/login',
        credentials,
      )) as unknown as LoginResponse;
      setAuth(data);
    },
    [setAuth],
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const hasRole = useCallback(
    (role: string) => {
      return user?.roles.includes(role) ?? false;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      initializing,
      authenticated: !!user,
      user,
      login,
      logout,
      hasRole,
      getAccessToken,
    }),
    [initializing, user, login, logout, hasRole, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
