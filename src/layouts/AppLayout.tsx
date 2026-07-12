import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Flex,
  Typography,
  Breadcrumb,
  Avatar,
  theme,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '../features/auth/auth-provider';

const { Header, Sider, Content } = Layout;

const SYSTEM_NAME = 'Quản trị hệ thống';

/** Menu items — extend this when adding new features */
function useMenuItems(): MenuProps['items'] {
  const { hasRole } = useAuth();

  const items: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
  ];

  if (hasRole('admin')) {
    items.push({
      key: '/users',
      icon: <TeamOutlined />,
      label: 'Người dùng',
    });
  }

  return items;
}

/** Map pathname to breadcrumb segments */
function useBreadcrumbItems() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    users: 'Người dùng',
  };

  const items = [{ title: 'Trang chủ' }];
  segments.forEach((seg) => {
    items.push({ title: breadcrumbMap[seg] || seg });
  });

  return items;
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const menuItems = useMenuItems();
  const breadcrumbItems = useBreadcrumbItems();
  const { token } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '4px 0' }}>
          <Typography.Text strong>
            {user?.firstName} {user?.lastName}
          </Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {user?.email}
          </Typography.Text>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout();
    }
  };

  const selectedKey = '/' + (location.pathname.split('/')[1] || '');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
          overflow: 'auto',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '0 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            QT
          </div>
          {!collapsed && (
            <Typography.Text
              strong
              style={{
                color: '#fff',
                fontSize: 15,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                animation: 'fadeIn 0.3s ease',
              }}
            >
              {SYSTEM_NAME}
            </Typography.Text>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ background: 'transparent', borderRight: 0, marginTop: 8 }}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <Flex align="center" gap={16}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <Breadcrumb items={breadcrumbItems} />
          </Flex>

          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Flex
              align="center"
              gap={8}
              style={{
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: 8,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = token.colorBgTextHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Avatar
                size={32}
                style={{
                  background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                }}
                icon={<UserOutlined />}
              />
              <Typography.Text
                style={{
                  maxWidth: 120,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.firstName} {user?.lastName}
              </Typography.Text>
            </Flex>
          </Dropdown>
        </Header>

        <Content style={{ margin: 24 }}>
          <div className="page-animate">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
