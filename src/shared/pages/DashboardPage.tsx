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
  UnorderedListOutlined,
  SettingOutlined,
  ThunderboltOutlined,
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
      {/* Header Banner */}
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={16}
        style={{ marginBottom: 20 }}
      >
        <div>
          <Space align="center" size={10}>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Xin chào, {user?.firstName} {user?.lastName}
            </Typography.Title>
            <Tag color="blue" style={{ border: 0, fontWeight: 500 }}>
              Quản trị viên
            </Tag>
          </Space>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 13, display: 'block', marginTop: 2 }}
          >
            Bảng điều khiển hệ thống quản trị đào tạo & khảo thí tập trung.
          </Typography.Text>
        </div>
        <div>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 12, display: 'block', textAlign: 'right' }}
          >
            Thời gian hệ thống
          </Typography.Text>
          <Typography.Text style={{ fontSize: 14, fontWeight: 500 }}>
            {dayjs().format('DD/MM/YYYY — HH:mm:ss')}
          </Typography.Text>
        </div>
      </Flex>

      {/* Stats Grid */}
      <Row gutter={[16, 16]}>
        {stats.map((s: SystemStatMetric, i: number) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card styles={{ body: { padding: 16 } }}>
              <Flex justify="space-between" align="flex-start">
                <div>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {s.title}
                  </Typography.Text>
                  <div style={{ marginTop: 4, marginBottom: 6 }}>
                    <Typography.Title
                      level={3}
                      style={{ margin: 0, fontWeight: 600 }}
                    >
                      {typeof s.value === 'number'
                        ? s.value.toLocaleString()
                        : s.value}
                    </Typography.Title>
                  </div>
                  <Tag
                    color={s.trendType === 'up' ? 'success' : 'warning'}
                    style={{ fontSize: 11, padding: '0 6px', border: 0 }}
                  >
                    <ArrowUpOutlined style={{ fontSize: 10, marginRight: 2 }} />
                    {s.trend}
                  </Tag>
                </div>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 6,
                    background: token.colorBgLayout,
                    color: token.colorPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
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
      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {/* Left Column: Recent Activities */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Flex align="center" justify="space-between" wrap="wrap" gap={10}>
                <Space align="center" size={8}>
                  <UnorderedListOutlined
                    style={{ color: token.colorPrimary }}
                  />
                  <Typography.Text strong style={{ fontSize: 15 }}>
                    Nhật ký hoạt động hệ thống
                  </Typography.Text>
                </Space>
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
          >
            <List
              itemLayout="horizontal"
              dataSource={filteredActivities}
              renderItem={(item: ActivityLogItem) => (
                <List.Item style={{ padding: '12px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={32}
                        style={{
                          background: token.colorBgLayout,
                          color: token.colorPrimary,
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
                        <Typography.Text strong style={{ fontSize: 14 }}>
                          {item.title}
                        </Typography.Text>
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
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card
              title={
                <Space align="center" size={8}>
                  <ThunderboltOutlined style={{ color: token.colorPrimary }} />
                  <Typography.Text strong style={{ fontSize: 15 }}>
                    Lối tắt quản trị
                  </Typography.Text>
                </Space>
              }
            >
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Button
                  type="primary"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/users/new')}
                >
                  Thêm người dùng mới
                </Button>
                <Button
                  block
                  icon={<TeamOutlined />}
                  onClick={() => navigate('/users')}
                >
                  Danh sách người dùng
                </Button>
              </Space>
            </Card>

            <Card
              title={
                <Space align="center" size={8}>
                  <SettingOutlined style={{ color: token.colorPrimary }} />
                  <Typography.Text strong style={{ fontSize: 15 }}>
                    Thông tin hệ thống
                  </Typography.Text>
                </Space>
              }
            >
              <Flex vertical gap={10}>
                <Flex justify="space-between">
                  <Typography.Text type="secondary">
                    Phiên bản UI
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 13 }}>
                    v2.4.0-prod
                  </Typography.Text>
                </Flex>
                <Flex justify="space-between">
                  <Typography.Text type="secondary">Môi trường</Typography.Text>
                  <Typography.Text style={{ fontSize: 13 }}>
                    Development (Mock active)
                  </Typography.Text>
                </Flex>
                <Flex justify="space-between">
                  <Typography.Text type="secondary">
                    Nguồn xác thực
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 13 }}>
                    SSO / Local Auth
                  </Typography.Text>
                </Flex>
              </Flex>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
