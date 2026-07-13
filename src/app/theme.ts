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
  return {
    algorithm:
      colorMode === 'dark'
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#1677ff',
      borderRadius: 8,
      fontSize: 15,
      controlHeight: 40,
      colorBgLayout: colorMode === 'dark' ? '#0f1115' : '#f5f7fa',
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    components: {
      Table: {
        cellPaddingBlock: 13,
        cellPaddingInline: 16,
        headerBorderRadius: 8,
      },
      Card: {
        borderRadiusLG: 10,
      },
      Button: {
        fontWeight: 500,
      },
      Menu: {
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
        darkItemSelectedBg: 'rgba(22,119,255,0.25)',
        darkItemHoverBg: 'rgba(255,255,255,0.08)',
        itemBorderRadius: 8,
        itemMarginInline: 8,
        iconMarginInlineEnd: 12,
      },
      Breadcrumb: {
        fontSize: 14,
        separatorMargin: 8,
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
