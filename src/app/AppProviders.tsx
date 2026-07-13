import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, App } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ColorModeContext, getAppTheme, type ColorMode } from './theme';
import { queryClient } from './query-client';
import { AuthProvider } from '../features/auth/auth-provider';
import { router } from './router';

export function AppProviders() {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const savedMode = localStorage.getItem('color_mode');
    if (savedMode === 'light' || savedMode === 'dark') return savedMode;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    localStorage.setItem('color_mode', colorMode);
    document.documentElement.dataset.theme = colorMode;
    document.documentElement.style.colorScheme = colorMode;
  }, [colorMode]);

  const toggleColorMode = useCallback(() => {
    setColorMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
  }, []);

  const colorModeContext = useMemo(
    () => ({ colorMode, toggleColorMode }),
    [colorMode, toggleColorMode],
  );

  return (
    <ColorModeContext.Provider value={colorModeContext}>
      <ConfigProvider theme={getAppTheme(colorMode)} locale={viVN}>
        <App>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </QueryClientProvider>
        </App>
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
}
