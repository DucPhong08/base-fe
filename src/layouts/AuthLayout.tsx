import { Outlet } from 'react-router-dom';
import { Button, Layout, Tooltip, Typography, theme } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useColorMode } from '../app/theme';

export function AuthLayout() {
  const { token } = theme.useToken();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${token.colorBgLayout} 0%, ${token.colorPrimaryBg} 50%, ${token.colorBgContainer} 100%)`,
        position: 'relative',
        overflow: 'auto',
        padding: '32px 0',
        boxSizing: 'border-box',
      }}
    >
      <Tooltip
        title={
          colorMode === 'dark'
            ? 'Chuyển sang giao diện sáng'
            : 'Chuyển sang giao diện tối'
        }
      >
        <Button
          type="text"
          shape="circle"
          icon={colorMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleColorMode}
          aria-label={
            colorMode === 'dark'
              ? 'Chuyển sang giao diện sáng'
              : 'Chuyển sang giao diện tối'
          }
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}
        />
      </Tooltip>

      {/* Decorative circles */}
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
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${token.colorPrimary}10, transparent 70%)`,
            top: -100,
            right: -100,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${token.colorPrimary}08, transparent 70%)`,
            bottom: -50,
            left: -50,
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 420,
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 32,
            animation: 'fadeInUp 0.5s ease-out',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 16,
              boxShadow: `0 8px 24px ${token.colorPrimary}40`,
            }}
          >
            QT
          </div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Quản trị hệ thống
          </Typography.Title>
          <Typography.Text type="secondary">
            Đăng nhập để tiếp tục
          </Typography.Text>
        </div>

        {/* Form card */}
        <div
          style={{
            background: token.colorBgContainer,
            padding: 'clamp(24px, 5vw, 32px)',
            borderRadius: 12,
            border: `1px solid ${token.colorBorderSecondary}`,
            boxShadow: token.boxShadowSecondary,
            animation: 'fadeInUp 0.5s ease-out 0.1s both',
          }}
        >
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}
