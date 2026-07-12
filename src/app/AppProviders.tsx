import { ConfigProvider, App } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import { queryClient } from './query-client';
import { AuthProvider } from '../features/auth/auth-provider';
import { router } from './router';

export function AppProviders() {
  return (
    <ConfigProvider theme={theme} locale={viVN}>
      <App>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </App>
    </ConfigProvider>
  );
}
