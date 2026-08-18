import { useState, useEffect } from 'react';
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
import { useUsersQuery } from '../../features/users/queries';
import {
  auditApi,
  type AuditLogRecord,
} from '../../features/audit/api/audit-api';
import dayjs from 'dayjs';

interface DashboardActivity {
  id: string;
  title: string;
  action: string;
  time: string;
  type: string;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [recentActivities, setRecentActivities] = useState<DashboardActivity[]>(
    [],
  );
  const [loadingActivities, setLoadingActivities] = useState(false);

  const { data: usersData } = useUsersQuery({ page: 1, limit: 1 });
  const totalUsers = usersData?.total ?? 0;

  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const logs = await auditApi.getRecentLogs(10);
      const mapped: DashboardActivity[] = logs.map((l: AuditLogRecord) => ({
        id: l.id,
        title: l.description || l.action || 'Thao tác hệ thống',
        action: `${l.userEmail || 'Hệ thống'} — IP: ${l.ipAddress || '127.0.0.1'}`,
        time: l.createdAt ? dayjs(l.createdAt).format('HH:mm:ss DD/MM') : '—',
        type: l.entityType === 'user' ? 'user' : 'audit',
      }));
      setRecentActivities(mapped);
    } catch {
      setRecentActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = recentActivities.filter(
    (a) => activityFilter === 'all' || a.type === activityFilter,
  );

  const stats = [
    {
      title: 'Tổng người dùng',
      value: totalUsers,
      trend: '+100%',
      trendType: 'up' as const,
    },
    {
      title: 'Phiên hoạt động',
      value: 1,
      trend: 'Bình thường',
      trendType: 'up' as const,
    },
    {
      title: 'Nhật ký hệ thống',
      value: recentActivities.length,
      trend: 'Realtime',
      trendType: 'up' as const,
    },
    {
      title: 'Độ khả dụng API',
      value: '99.9%',
      trend: 'Ổn định',
      trendType: 'up' as const,
    },
  ];

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
              Xin chào, {user?.lastName} {user?.firstName}
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
        {stats.map((s, i) => (
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
                      { label: 'Kiểm soát', value: 'audit' },
                    ]}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    loading={loadingActivities}
                    onClick={fetchActivities}
                  >
                    Làm mới
                  </Button>
                </Flex>
              </Flex>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={filteredActivities}
              renderItem={(item: DashboardActivity) => (
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
                    NestJS API Connected
                  </Typography.Text>
                </Flex>
                <Flex justify="space-between">
                  <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                    Nguồn xác thực
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 14, fontWeight: 600 }}>
                    NestJS Auth JWT
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
