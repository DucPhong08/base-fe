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
        background: isDark
          ? 'radial-gradient(ellipse at top, #0f172a 0%, #090d16 100%)'
          : 'radial-gradient(ellipse at top, #eff6ff 0%, #f8fafc 100%)',
        position: 'relative',
        overflow: 'auto',
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

      {/* Modern Background Blur Elements */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(37, 99, 235, 0.12), transparent 70%)',
            top: -150,
            right: -100,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(16, 185, 129, 0.08), transparent 70%)',
            bottom: -100,
            left: -50,
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
          boxSizing: 'border-box',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 28,
            animation: 'fadeInUp 0.4s ease-out',
          }}
        >
          <Flex justify="center" align="center" style={{ marginBottom: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                fontWeight: 700,
                color: '#ffffff',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
              }}
            >
              QT
            </div>
          </Flex>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            Hệ Thống Quản Trị Enterprise
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
            Cổng xác thực & phân quyền quản lý tập trung
          </Typography.Text>
        </div>

        {/* Card Form */}
        <div
          style={{
            background: token.colorBgContainer,
            padding: '32px 28px',
            borderRadius: 14,
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
            animation: 'fadeInUp 0.4s ease-out 0.1s both',
          }}
        >
          <Outlet />
        </div>

        {/* Footer info */}
        <Flex justify="center" align="center" gap={8} style={{ marginTop: 24 }}>
          <SafetyCertificateOutlined style={{ color: '#10b981' }} />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Bảo mật mã hóa kết nối SSL 256-bit — 2026 Base FE
          </Typography.Text>
        </Flex>
      </div>
    </Layout>
  );
}
