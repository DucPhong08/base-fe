import { Navigate, useLocation } from 'react-router-dom';
import { Spin, theme } from 'antd';
import { useAuth } from './auth-provider';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const { initializing, authenticated, hasRole } = useAuth();
  const location = useLocation();
  const { token } = theme.useToken();

  if (initializing) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 16,
          background: token.colorBgLayout,
          animation: 'fadeIn 0.3s ease',
        }}
      >
        <Spin size="large" />
        <span style={{ color: token.colorTextSecondary, fontSize: 14 }}>
          Đang tải...
        </span>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && !requiredRoles.some(hasRole)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
