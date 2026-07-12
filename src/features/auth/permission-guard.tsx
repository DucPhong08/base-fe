import { useAuth } from './auth-provider';
import type { ReactNode } from 'react';

interface PermissionGuardProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * UI-only guard. Hides children if user lacks required roles.
 * This is NOT a security measure — backend must enforce authorization.
 */
export function PermissionGuard({
  roles,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasRole } = useAuth();

  if (!roles.some(hasRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
