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
      colorSuccess: '#31a24c',
      colorWarning: '#d97706',
      colorError: '#fa383e',
      colorInfo: '#0866ff',
      borderRadius: 6,
      fontSize: 15, // Raised global base font size (+1px) for legibility
      lineHeight: 1.55, // Optimized reading line height
      controlHeight: 40, // Slightly taller controls for easier clicking
      colorBgLayout: isDark ? '#0b0f19' : '#f0f2f5',
      colorBgContainer: isDark ? '#151d2a' : '#ffffff',
      colorBorderSecondary: isDark ? '#263347' : '#e4e6eb',
      colorText: isDark ? '#f0f2f5' : '#050505',
      colorTextSecondary: isDark ? '#a0a6b1' : '#55575c',
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
      Table: {
        cellPaddingBlock: 14,
        cellPaddingInline: 18,
        headerBg: isDark ? '#1c2638' : '#f7f8fa',
        headerColor: isDark ? '#f0f2f5' : '#050505',
        headerBorderRadius: 6,
        rowHoverBg: isDark ? '#1c2638' : '#f2f4f7',
        fontSize: 15,
      },
      Card: {
        borderRadiusLG: 8,
      },
      Button: {
        fontWeight: 600,
        fontSizeLG: 16,
      },
      Menu: {
        fontSize: 15,
        itemColor: isDark ? '#cbd5e1' : '#050505',
        itemSelectedColor: '#ffffff',
        itemSelectedBg: '#0866ff',
        darkItemBg: 'transparent',
        darkItemColor: '#e2e8f0',
        darkSubMenuItemBg: 'transparent',
        darkItemSelectedBg: '#0866ff',
        darkItemSelectedColor: '#ffffff',
        darkItemHoverBg: 'rgba(255, 255, 255, 0.12)',
        itemBorderRadius: 6,
        itemMarginInline: 10,
        iconMarginInlineEnd: 12,
        iconSize: 18,
      },
      Breadcrumb: {
        fontSize: 14,
        separatorMargin: 8,
        itemColor: isDark ? '#a0a6b1' : '#65676b',
        lastItemColor: isDark ? '#f0f2f5' : '#050505',
      },
      Tag: {
        borderRadiusSM: 4,
        fontSize: 13,
      },
      Descriptions: {
        titleMarginBottom: 12,
        labelBg: isDark ? '#1c2638' : '#f7f8fa',
        fontSize: 15,
      },
      Modal: {
        borderRadiusLG: 8,
      },
      Typography: {
        titleMarginBottom: 0,
      },
    },
  };
}
