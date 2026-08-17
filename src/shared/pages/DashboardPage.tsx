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
import { MetricCard } from '../ui';
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

  const icons = [
    <TeamOutlined key="1" />,
    <CheckCircleOutlined key="2" />,
    <SafetyCertificateOutlined key="3" />,
    <ClockCircleOutlined key="4" />,
  ];

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
            <Typography.Title level={4} style={{ margin: 0, fontWeight: 700 }}>
              Xin chào, {user?.firstName} {user?.lastName}
            </Typography.Title>
            <Tag color="blue" style={{ border: 0, fontWeight: 600 }}>
              Quản trị viên
            </Tag>
          </Space>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 14, display: 'block', marginTop: 4 }}
          >
            Bảng điều khiển hệ thống quản trị đào tạo & khảo thí tập trung.
          </Typography.Text>
        </div>
        <div>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 13, display: 'block', textAlign: 'right' }}
          >
            Thời gian hệ thống
          </Typography.Text>
          <Typography.Text style={{ fontSize: 15, fontWeight: 600 }}>
            {dayjs().format('DD/MM/YYYY — HH:mm:ss')}
          </Typography.Text>
        </div>
      </Flex>

      {/* Stats Grid */}
      <Row gutter={[16, 16]}>
        {stats.map((s: SystemStatMetric, i: number) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <MetricCard
              title={s.title}
              value={s.value}
              trend={s.trend}
              trendType={s.trendType}
              icon={icons[i % icons.length]}
            />
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
                  <Typography.Text strong style={{ fontSize: 16 }}>
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
                        size={34}
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
                        <Typography.Text strong style={{ fontSize: 15 }}>
                          {item.title}
                        </Typography.Text>
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 13 }}
                        >
                          {item.time}
                        </Typography.Text>
                      </Flex>
                    }
                    description={
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: 14 }}
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
                  <Typography.Text strong style={{ fontSize: 16 }}>
                    Lối tắt quản trị
                  </Typography.Text>
                </Space>
              }
            >
              <Space direction="vertical" size={10} style={{ width: '100%' }}>
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/users/new')}
                >
                  Thêm người dùng mới
                </Button>
                <Button
                  block
                  size="large"
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
                  <Typography.Text strong style={{ fontSize: 16 }}>
                    Thông tin hệ thống
                  </Typography.Text>
                </Space>
              }
            >
              <Flex vertical gap={12}>
                <Flex justify="space-between">
                  <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                    Phiên bản UI
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 14, fontWeight: 600 }}>
                    v2.4.0-prod
                  </Typography.Text>
                </Flex>
                <Flex justify="space-between">
                  <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                    Môi trường
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 14, fontWeight: 600 }}>
                    Development (Mock active)
                  </Typography.Text>
                </Flex>
                <Flex justify="space-between">
                  <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                    Nguồn xác thực
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 14, fontWeight: 600 }}>
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
