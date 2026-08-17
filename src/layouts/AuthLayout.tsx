import { Outlet } from 'react-router-dom';
import { Button, Layout, Tooltip, Typography, theme, Flex } from 'antd';
import {
  MoonOutlined,
  SunOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useColorMode } from '../app/theme';

export function AuthLayout() {
  const { token } = theme.useToken();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: token.colorBgLayout,
        position: 'relative',
        padding: '32px 16px',
        boxSizing: 'border-box',
      }}
    >
      <Tooltip
        title={
          isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'
        }
      >
        <Button
          type="text"
          shape="circle"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleColorMode}
          aria-label={
            isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'
          }
          style={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }}
        />
      </Tooltip>

      <div
        style={{
          width: '100%',
          maxWidth: 420,
          boxSizing: 'border-box',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Flex justify="center" align="center" style={{ marginBottom: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: '#0866ff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              QT
            </div>
          </Flex>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 600 }}>
            Hệ Thống Quản Trị Enterprise
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            Cổng xác thực & phân quyền quản lý tập trung
          </Typography.Text>
        </div>

        {/* Card Form */}
        <div
          style={{
            background: token.colorBgContainer,
            padding: '28px 24px',
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Outlet />
        </div>

        {/* Footer info */}
        <Flex justify="center" align="center" gap={6} style={{ marginTop: 20 }}>
          <SafetyCertificateOutlined style={{ color: '#10b981' }} />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Bảo mật mã hóa kết nối SSL 256-bit — 2026 Base FE
          </Typography.Text>
        </Flex>
      </div>
    </Layout>
  );
}
