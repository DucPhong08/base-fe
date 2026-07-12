import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
    fontSize: 14,
    controlHeight: 38,
    colorBgLayout: '#f5f7fa',
    colorBorderSecondary: '#eef0f4',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    // Table
    Table: {
      headerBg: '#fafbfc',
      headerColor: 'rgba(0,0,0,0.65)',
      headerSortActiveBg: '#f0f2f5',
      rowHoverBg: '#f0f7ff',
      borderColor: '#f0f0f0',
      cellPaddingBlock: 14,
      cellPaddingInline: 16,
      headerBorderRadius: 8,
    },
    // Card
    Card: {
      borderRadiusLG: 10,
      boxShadowTertiary: '0 1px 4px rgba(0,0,0,0.06)',
    },
    // Input
    Input: {
      activeBorderColor: '#1677ff',
      hoverBorderColor: '#69b1ff',
      activeShadow: '0 0 0 3px rgba(22,119,255,0.08)',
    },
    // Button
    Button: {
      primaryShadow: '0 2px 4px rgba(22,119,255,0.2)',
      fontWeight: 500,
    },
    // Menu
    Menu: {
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(22,119,255,0.25)',
      darkItemHoverBg: 'rgba(255,255,255,0.08)',
      itemBorderRadius: 8,
      itemMarginInline: 8,
      iconMarginInlineEnd: 12,
    },
    // Breadcrumb
    Breadcrumb: {
      fontSize: 13,
      separatorMargin: 8,
    },
    // Tag
    Tag: {
      borderRadiusSM: 4,
    },
    // Descriptions
    Descriptions: {
      titleMarginBottom: 12,
    },
    // Modal
    Modal: {
      borderRadiusLG: 12,
    },
    // Tabs
    Tabs: {
      inkBarColor: '#1677ff',
      itemActiveColor: '#1677ff',
      itemHoverColor: '#4096ff',
    },
  },
};
