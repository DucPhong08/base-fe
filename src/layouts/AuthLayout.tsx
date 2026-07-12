import { Outlet } from 'react-router-dom';
import { Layout, Typography, theme } from 'antd';

export function AuthLayout() {
  const { token } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, #f0f5ff 50%, #e6f4ff 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
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

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 420,
          padding: '0 16px',
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
            background: '#fff',
            padding: 32,
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            animation: 'fadeInUp 0.5s ease-out 0.1s both',
          }}
        >
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}
