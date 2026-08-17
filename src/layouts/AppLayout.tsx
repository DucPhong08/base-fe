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
  Grid,
  Tooltip,
  Badge,
  Popover,
  List,
  theme,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  MoonOutlined,
  SunOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuth } from '../features/auth/auth-provider';
import { useColorMode } from '../app/theme';
import { MOCK_NOTIFICATIONS, type SystemNotification } from '../shared/mocks';

const { Header, Sider, Content } = Layout;

const SYSTEM_NAME = 'Quản trị hệ thống';

/** Menu items — extend this when adding new features */
function useMenuItems(): MenuProps['items'] {
  const { hasRole } = useAuth();

  const items: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined style={{ fontSize: 18 }} />,
      label: 'Tổng quan điều hành',
    },
  ];

  if (hasRole('admin')) {
    items.push({
      key: '/users',
      icon: <TeamOutlined style={{ fontSize: 18 }} />,
      label: 'Quản lý người dùng',
    });
  }

  items.push({
    key: '/audit',
    icon: <SafetyCertificateOutlined style={{ fontSize: 18 }} />,
    label: 'Nhật ký truy vết',
  });

  items.push({
    key: '/settings',
    icon: <SettingOutlined style={{ fontSize: 18 }} />,
    label: 'Cấu hình hệ thống',
  });

  return items;
}

/** Map pathname to breadcrumb segments */
function useBreadcrumbItems() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    users: 'Quản lý người dùng',
    new: 'Thêm mới',
    audit: 'Nhật ký truy vết',
    settings: 'Cấu hình hệ thống',
  };

  const items = [{ title: 'Trang chủ' }];
  segments.forEach((seg) => {
    items.push({ title: breadcrumbMap[seg] || seg });
  });

  return items;
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const screens = Grid.useBreakpoint();
  const isMobile = screens.lg === false;
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const menuItems = useMenuItems();
  const breadcrumbItems = useBreadcrumbItems();
  const { token } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
    if (isMobile) setCollapsed(true);
  };

  const notifications = MOCK_NOTIFICATIONS;

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div style={{ padding: '6px 4px' }}>
          <Typography.Text strong style={{ display: 'block', fontSize: 15 }}>
            {user?.lastName} {user?.firstName}
          </Typography.Text>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 13, display: 'block' }}
          >
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
      label: 'Đăng xuất tài khoản',
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
        width={260}
        collapsedWidth={isMobile ? 0 : 80}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          background: '#0b1120',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'auto',
        }}
      >
        {/* Logo Header */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 12,
            padding: '0 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: '#0866ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#ffffff',
              flexShrink: 0,
            }}
          >
            QT
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <Typography.Text
                strong
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  display: 'block',
                  lineHeight: 1.2,
                  fontWeight: 700,
                }}
              >
                {SYSTEM_NAME}
              </Typography.Text>
              <Typography.Text
                style={{
                  color: '#94a3b8',
                  fontSize: 12,
                  display: 'block',
                  fontWeight: 500,
                }}
              >
                Cổng Điều Hành Enterprise
              </Typography.Text>
            </div>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            borderRight: 0,
            marginTop: 14,
            fontWeight: 600,
          }}
        />
      </Sider>

      {isMobile && !collapsed && (
        <div
          className="app-sider-backdrop"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}

      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 260,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <Header
          style={{
            padding: isMobile ? '0 16px' : '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <Flex align="center" gap={isMobile ? 8 : 16} style={{ minWidth: 0 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 18 }}
              aria-label={collapsed ? 'Mở menu' : 'Thu gọn menu'}
            />
            <Breadcrumb className="app-breadcrumb" items={breadcrumbItems} />
          </Flex>

          <Flex align="center" gap={14}>
            {/* System Live Status */}
            {!isMobile && (
              <Flex
                align="center"
                gap={8}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: colorMode === 'dark' ? '#34d399' : '#059669',
                  whiteSpace: 'nowrap',
                }}
              >
                <span className="status-pulse-dot" />
                Hệ thống sẵn sàng
              </Flex>
            )}

            {/* Notification Popover */}
            <Popover
              content={
                <div style={{ width: 300 }}>
                  <Typography.Text
                    strong
                    style={{ display: 'block', marginBottom: 8, fontSize: 15 }}
                  >
                    Thông báo mới
                  </Typography.Text>
                  <List
                    size="small"
                    dataSource={notifications}
                    renderItem={(item: SystemNotification) => (
                      <List.Item key={item.id} style={{ padding: '8px 0' }}>
                        <List.Item.Meta
                          title={
                            <Typography.Text
                              style={{
                                fontSize: 14,
                                fontWeight: item.read ? 400 : 600,
                              }}
                            >
                              {item.title}
                            </Typography.Text>
                          }
                          description={
                            <Typography.Text
                              type="secondary"
                              style={{ fontSize: 12 }}
                            >
                              {item.time}
                            </Typography.Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              }
              trigger="click"
              placement="bottomRight"
            >
              <Badge count={2} size="small" offset={[-2, 4]}>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  style={{ fontSize: 18 }}
                />
              </Badge>
            </Popover>

            {/* Theme Toggle */}
            <Tooltip
              title={
                colorMode === 'dark'
                  ? 'Chuyển sang giao diện sáng'
                  : 'Chuyển sang giao diện tối'
              }
            >
              <Button
                type="text"
                icon={colorMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleColorMode}
                style={{ fontSize: 18 }}
                aria-label={
                  colorMode === 'dark'
                    ? 'Chuyển sang giao diện sáng'
                    : 'Chuyển sang giao diện tối'
                }
              />
            </Tooltip>

            {/* User Dropdown Menu */}
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Flex
                align="center"
                gap={10}
                style={{
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                <Avatar
                  size={34}
                  style={{
                    background: '#0866ff',
                    fontWeight: 600,
                  }}
                  icon={<UserOutlined />}
                />
                <Typography.Text
                  className="app-header-user-name"
                  ellipsis
                  style={{ maxWidth: 180, fontSize: 15, fontWeight: 600 }}
                >
                  {user?.lastName} {user?.firstName}
                </Typography.Text>
              </Flex>
            </Dropdown>
          </Flex>
        </Header>

        <Content style={{ margin: screens.md === false ? 16 : 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
