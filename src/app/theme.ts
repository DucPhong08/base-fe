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
      borderRadius: 8,
      fontSize: 16, // Scaled global base font size to 16px for crisp legibility
      lineHeight: 1.55,
      controlHeight: 44, // Taller controls for easy clicking and modern feel
      colorBgLayout: isDark ? '#0b0f19' : '#f4f6f8',
      colorBgContainer: isDark ? '#151d2a' : '#ffffff',
      colorBorderSecondary: isDark ? '#263347' : '#e4e6eb',
      colorText: isDark ? '#f0f2f5' : '#050505',
      colorTextSecondary: isDark ? '#a0a6b1' : '#55575c',
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
      Table: {
        cellPaddingBlock: 16,
        cellPaddingInline: 20,
        headerBg: isDark ? '#1c2638' : '#f8fafc',
        headerColor: isDark ? '#f0f2f5' : '#050505',
        headerBorderRadius: 8,
        rowHoverBg: isDark ? '#1c2638' : '#f0f4f9',
        fontSize: 15,
      },
      Card: {
        borderRadiusLG: 10,
      },
      Button: {
        fontWeight: 600,
        fontSizeLG: 16,
        controlHeightLG: 46,
      },
      Menu: {
        fontSize: 16,
        itemColor: isDark ? '#cbd5e1' : '#334155',
        itemSelectedColor: isDark ? '#ffffff' : '#0866ff',
        itemSelectedBg: isDark ? '#0866ff' : '#e7f1ff',
        itemHoverBg: isDark ? 'rgba(255, 255, 255, 0.12)' : '#f1f5f9',
        itemHoverColor: '#0866ff',
        darkItemBg: 'transparent',
        darkItemColor: '#cbd5e1',
        darkSubMenuItemBg: 'transparent',
        darkItemSelectedBg: '#0866ff',
        darkItemSelectedColor: '#ffffff',
        darkItemHoverBg: 'rgba(255, 255, 255, 0.12)',
        itemBorderRadius: 8,
        itemMarginInline: 12,
        iconMarginInlineEnd: 14,
        iconSize: 20,
      },
      Breadcrumb: {
        fontSize: 14,
        separatorMargin: 8,
        itemColor: isDark ? '#a0a6b1' : '#65676b',
        lastItemColor: isDark ? '#f0f2f5' : '#050505',
      },
      Tag: {
        borderRadiusSM: 6,
        fontSize: 13,
      },
      Descriptions: {
        titleMarginBottom: 14,
        labelBg: isDark ? '#1c2638' : '#f8fafc',
        fontSize: 15,
      },
      Modal: {
        borderRadiusLG: 10,
      },
      Typography: {
        titleMarginBottom: 0,
      },
    },
  };
}
