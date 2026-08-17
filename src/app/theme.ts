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
      colorPrimary: '#0866ff',
      borderRadius: 6,
      fontSize: 14,
      controlHeight: 38,
      colorBgLayout: isDark ? '#0b0f19' : '#f0f2f5',
      colorBgContainer: isDark ? '#151d2a' : '#ffffff',
      colorBorderSecondary: isDark ? '#263347' : '#e4e6eb',
      colorText: isDark ? '#f0f2f5' : '#050505',
      colorTextSecondary: isDark ? '#a0a6b1' : '#65676b',
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
      Table: {
        cellPaddingBlock: 12,
        cellPaddingInline: 16,
        headerBg: isDark ? '#1c2638' : '#f7f8fa',
        headerColor: isDark ? '#f0f2f5' : '#050505',
        headerBorderRadius: 6,
        rowHoverBg: isDark ? '#1c2638' : '#f2f4f7',
      },
      Card: {
        borderRadiusLG: 8,
      },
      Button: {
        fontWeight: 600,
      },
      Menu: {
        itemColor: isDark ? '#cbd5e1' : '#050505',
        itemSelectedColor: '#0866ff',
        itemSelectedBg: isDark ? 'rgba(8, 102, 255, 0.2)' : '#e7f3ff',
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
        darkItemSelectedBg: 'rgba(8, 102, 255, 0.2)',
        darkItemSelectedColor: '#4793ff',
        darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
        itemBorderRadius: 6,
        itemMarginInline: 8,
        iconMarginInlineEnd: 10,
      },
      Breadcrumb: {
        fontSize: 13,
        separatorMargin: 6,
        itemColor: isDark ? '#a0a6b1' : '#65676b',
        lastItemColor: isDark ? '#f0f2f5' : '#050505',
      },
      Tag: {
        borderRadiusSM: 4,
      },
      Descriptions: {
        titleMarginBottom: 12,
        labelBg: isDark ? '#1c2638' : '#f7f8fa',
      },
      Modal: {
        borderRadiusLG: 8,
      },
    },
  };
}
