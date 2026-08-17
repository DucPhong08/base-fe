import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { Spin } from 'antd';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { BlankLayout } from '../layouts/BlankLayout';
import { ProtectedRoute } from '../features/auth/protected-route';

// Lazy-loaded pages
const LoginPage = lazy(() =>
  import('../features/auth/pages/LoginPage').then((m) => ({
    default: m.LoginPage,
  })),
);
const DashboardPage = lazy(() =>
  import('../shared/pages/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
);
const ForbiddenPage = lazy(() =>
  import('../shared/pages/ForbiddenPage').then((m) => ({
    default: m.ForbiddenPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('../shared/pages/NotFoundPage').then((m) => ({
    default: m.NotFoundPage,
  })),
);
const UserListPage = lazy(() =>
  import('../features/users/pages/UserListPage').then((m) => ({
    default: m.UserListPage,
  })),
);
const UserDetailPage = lazy(() =>
  import('../features/users/pages/UserDetailPage').then((m) => ({
    default: m.UserDetailPage,
  })),
);
const AuditPage = lazy(() =>
  import('../features/audit/pages/AuditPage').then((m) => ({
    default: m.AuditPage,
  })),
);
const SettingsPage = lazy(() =>
  import('../features/settings/pages/SettingsPage').then((m) => ({
    default: m.SettingsPage,
  })),
);

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Spin size="large" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  // Public: auth routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // Error pages (accessible without auth)
  {
    element: <BlankLayout />,
    children: [
      {
        path: '/403',
        element: (
          <SuspenseWrapper>
            <ForbiddenPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/404',
        element: (
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // Protected: main app
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'users',
        element: (
          <SuspenseWrapper>
            <UserListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'users/:id',
        element: (
          <SuspenseWrapper>
            <UserDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'audit',
        element: (
          <SuspenseWrapper>
            <AuditPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // Catch-all → 404
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
