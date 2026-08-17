import { createContext, useContext } from 'react';
import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';

export type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue | null>(
  null,
);

export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within ColorModeContext');
  }
  return context;
}

export function getAppTheme(colorMode: ColorMode): ThemeConfig {
  const isDark = colorMode === 'dark';

  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#2563eb', // Royal Indigo Blue
      colorPrimaryHover: '#3b82f6',
      colorPrimaryActive: '#1d4ed8',
      borderRadius: 8,
      fontSize: 14,
      controlHeight: 38,
      colorBgLayout: isDark ? '#090d16' : '#f8fafc',
      colorBgContainer: isDark ? '#111827' : '#ffffff',
      colorBorderSecondary: isDark ? '#1f293d' : '#e2e8f0',
      colorText: isDark ? '#f3f4f6' : '#0f172a',
      colorTextSecondary: isDark ? '#9ca3af' : '#64748b',
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
      Table: {
        cellPaddingBlock: 12,
        cellPaddingInline: 16,
        headerBg: isDark ? '#1a2333' : '#f1f5f9',
        headerColor: isDark ? '#e5e7eb' : '#334155',
        headerBorderRadius: 8,
        rowHoverBg: isDark ? '#1a2333' : '#f8fafc',
      },
      Card: {
        borderRadiusLG: 10,
        colorBgContainer: isDark ? '#111827' : '#ffffff',
      },
      Button: {
        fontWeight: 500,
        borderRadius: 6,
      },
      Menu: {
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
        darkItemSelectedBg: 'rgba(37, 99, 235, 0.2)',
        darkItemSelectedColor: '#60a5fa',
        darkItemHoverBg: 'rgba(255, 255, 255, 0.05)',
        itemBorderRadius: 6,
        itemMarginInline: 8,
        iconMarginInlineEnd: 10,
      },
      Breadcrumb: {
        fontSize: 13,
        separatorMargin: 6,
      },
      Tag: {
        borderRadiusSM: 4,
      },
      Descriptions: {
        titleMarginBottom: 12,
      },
      Modal: {
        borderRadiusLG: 12,
      },
    },
  };
}
