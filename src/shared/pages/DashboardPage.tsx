import { useState } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Tag,
  List,
  Avatar,
  Button,
  Flex,
  Space,
  theme,
  Segmented,
} from 'antd';
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  ArrowUpOutlined,
  UserAddOutlined,
  PlusOutlined,
  KeyOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/auth-provider';
import {
  MOCK_DASHBOARD_STATS,
  MOCK_RECENT_ACTIVITIES,
  type SystemStatMetric,
  type ActivityLogItem,
} from '../mocks';
import dayjs from 'dayjs';

export function DashboardPage() {
  const { user } = useAuth();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [activityFilter, setActivityFilter] = useState<string>('all');

  const stats: SystemStatMetric[] = MOCK_DASHBOARD_STATS;
  const recentActivities: ActivityLogItem[] = MOCK_RECENT_ACTIVITIES;

  const filteredActivities = recentActivities.filter(
    (a) => activityFilter === 'all' || a.type === activityFilter,
  );

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Executive Welcome Banner */}
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
        styles={{ body: { padding: '24px 28px' } }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <div>
            <Space align="center" style={{ marginBottom: 6 }}>
              <Typography.Title
                level={3}
                style={{ color: '#f8fafc', margin: 0 }}
              >
                Xin chào, {user?.firstName} {user?.lastName} 👋
              </Typography.Title>
              <Tag
                color="blue"
                style={{ borderRadius: 12, border: 0, fontWeight: 500 }}
              >
                Quản trị viên
              </Tag>
            </Space>
            <Typography.Text
              style={{ color: '#94a3b8', fontSize: 14, display: 'block' }}
            >
              Bảng điều khiển hệ thống quản trị đào tạo & khảo thí tập trung.
            </Typography.Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Typography.Text
              style={{ color: '#64748b', fontSize: 13, display: 'block' }}
            >
              Thời gian hệ thống
            </Typography.Text>
            <Typography.Text strong style={{ color: '#e2e8f0', fontSize: 15 }}>
              {dayjs().format('DD/MM/YYYY — HH:mm:ss')}
            </Typography.Text>
          </div>
        </Flex>
      </Card>

      {/* Stats Grid */}
      <Row gutter={[16, 16]}>
        {stats.map((s: SystemStatMetric, i: number) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card
              style={{
                borderRadius: 10,
                border: `1px solid ${token.colorBorderSecondary}`,
                animation: `fadeInUp 0.35s ease-out ${i * 0.06}s both`,
              }}
              styles={{ body: { padding: 20 } }}
            >
              <Flex justify="space-between" align="flex-start">
                <div>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 13, fontWeight: 500 }}
                  >
                    {s.title}
                  </Typography.Text>
                  <div style={{ marginTop: 6, marginBottom: 8 }}>
                    <Typography.Title
                      level={3}
                      style={{ margin: 0, fontWeight: 700 }}
                    >
                      {typeof s.value === 'number'
                        ? s.value.toLocaleString()
                        : s.value}
                    </Typography.Title>
                  </div>
                  <Space size={4}>
                    <Tag
                      color={s.trendType === 'up' ? 'success' : 'warning'}
                      style={{
                        borderRadius: 10,
                        fontSize: 11,
                        padding: '1px 8px',
                        border: 0,
                      }}
                    >
                      <ArrowUpOutlined
                        style={{ fontSize: 10, marginRight: 2 }}
                      />
                      {s.trend}
                    </Tag>
                  </Space>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: s.bg,
                    color: s.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  {
                    [
                      <TeamOutlined key="1" />,
                      <CheckCircleOutlined key="2" />,
                      <SafetyCertificateOutlined key="3" />,
                      <ClockCircleOutlined key="4" />,
                    ][i % 4]
                  }
                </div>
              </Flex>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Grid */}
      <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
        {/* Left Column: Recent Activities */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Flex align="center" justify="space-between" wrap="wrap" gap={10}>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  📋 Nhật ký hoạt động hệ thống
                </Typography.Text>
                <Flex gap={8} align="center">
                  <Segmented
                    size="small"
                    value={activityFilter}
                    onChange={(v) => setActivityFilter(v as string)}
                    options={[
                      { label: 'Tất cả', value: 'all' },
                      { label: 'Tài khoản', value: 'user' },
                      { label: 'Tự động', value: 'system' },
                      { label: 'Kiểm soát', value: 'audit' },
                    ]}
                  />
                  <Button type="text" size="small" icon={<ReloadOutlined />}>
                    Làm mới
                  </Button>
                </Flex>
              </Flex>
            }
            style={{
              borderRadius: 10,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={filteredActivities}
              renderItem={(item: ActivityLogItem) => (
                <List.Item style={{ padding: '14px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          background:
                            item.type === 'user'
                              ? token.colorPrimaryBg
                              : item.type === 'system'
                                ? token.colorSuccessBg
                                : token.colorWarningBg,
                          color:
                            item.type === 'user'
                              ? token.colorPrimary
                              : item.type === 'system'
                                ? token.colorSuccess
                                : token.colorWarning,
                        }}
                        icon={
                          item.type === 'user' ? (
                            <UserAddOutlined />
                          ) : item.type === 'system' ? (
                            <ClockCircleOutlined />
                          ) : (
                            <KeyOutlined />
                          )
                        }
                      />
                    }
                    title={
                      <Flex justify="space-between">
                        <Typography.Text strong>{item.title}</Typography.Text>
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 12 }}
                        >
                          {item.time}
                        </Typography.Text>
                      </Flex>
                    }
                    description={
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: 13 }}
                      >
                        {item.action}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Right Column: Quick Actions & System Info */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <Card
              title={
                <Typography.Text strong style={{ fontSize: 16 }}>
                  ⚡ Lối tắt quản trị
                </Typography.Text>
              }
              style={{
                borderRadius: 10,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <Button
                  type="primary"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/users/new')}
                  style={{ height: 40 }}
                >
                  Thêm người dùng mới
                </Button>
                <Button
                  block
                  icon={<TeamOutlined />}
                  onClick={() => navigate('/users')}
                  style={{ height: 40 }}
                >
                  Danh sách người dùng
                </Button>
              </Space>
            </Card>

            <Card
              title={
                <Typography.Text strong style={{ fontSize: 16 }}>
                  ⚙️ Thông tin hệ thống
                </Typography.Text>
              }
              style={{
                borderRadius: 10,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Flex vertical gap={12}>
                <Flex justify="space-between">
                  <Typography.Text type="secondary">
                    Phiên bản UI
                  </Typography.Text>
                  <Tag color="blue">v2.4.0-prod</Tag>
                </Flex>
                <Flex justify="space-between">
                  <Typography.Text type="secondary">Môi trường</Typography.Text>
                  <Tag color="cyan">Development (Mock active)</Tag>
                </Flex>
                <Flex justify="space-between">
                  <Typography.Text type="secondary">
                    Nguồn xác thực
                  </Typography.Text>
                  <Tag color="geekblue">SSO / Local Auth</Tag>
                </Flex>
              </Flex>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
