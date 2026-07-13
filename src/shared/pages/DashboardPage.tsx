import { Typography, Card, Row, Col, Statistic, theme } from 'antd';
import {
  TeamOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../features/auth/auth-provider';

export function DashboardPage() {
  const { user } = useAuth();
  const { token } = theme.useToken();
  const stats = [
    {
      title: 'Người dùng',
      icon: <TeamOutlined />,
      color: token.colorPrimary,
      bg: token.colorPrimaryBg,
    },
    {
      title: 'Túi thi',
      icon: <SafetyCertificateOutlined />,
      color: token.colorSuccess,
      bg: token.colorSuccessBg,
    },
    {
      title: 'Bài thi',
      icon: <FileTextOutlined />,
      color: token.colorWarning,
      bg: token.colorWarningBg,
    },
    {
      title: 'Đã duyệt',
      icon: <CheckCircleOutlined />,
      color: token.colorPrimaryActive,
      bg: token.colorPrimaryBgHover,
    },
  ];

  return (
    <div>
      {/* Welcome banner */}
      <Card
        style={{
          marginBottom: 24,
          background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
          border: 'none',
          borderRadius: 12,
        }}
      >
        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
          👋 Xin chào, {user?.firstName} {user?.lastName}
        </Typography.Title>
        <Typography.Text
          style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}
        >
          Chào mừng bạn trở lại hệ thống quản trị
        </Typography.Text>
      </Card>

      {/* Stats cards */}
      <Row gutter={[16, 16]}>
        {stats.map((s, i) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card
              style={{
                borderRadius: 10,
                animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both`,
              }}
            >
              <Statistic
                title={s.title}
                value="—"
                prefix={
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: s.bg,
                      color: s.color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      marginRight: 8,
                    }}
                  >
                    {s.icon}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick start */}
      <Card style={{ marginTop: 24, borderRadius: 10 }}>
        <Typography.Title level={5} style={{ marginTop: 0 }}>
          Bắt đầu nhanh
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Chọn mục từ menu bên trái để quản lý. Các module nghiệp vụ (Túi thi,
          Chấm thi, Phúc khảo) sẽ được thêm khi backend sẵn sàng.
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
