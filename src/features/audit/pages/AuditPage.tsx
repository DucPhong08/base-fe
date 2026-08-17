import { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  DatePicker,
  Input,
  Select,
  Button,
  Flex,
  Typography,
  Drawer,
  Descriptions,
  Empty,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageContainer, UserAvatar } from '../../../shared/ui';

interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  action: string;
  module: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  details: string;
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    actorName: 'Nguyễn Đức Phong',
    actorEmail: 'admin.phong@quantri.gov.vn',
    action: 'Cập nhật phân quyền người dùng',
    module: 'User Management',
    ipAddress: '14.225.18.42',
    status: 'SUCCESS',
    riskLevel: 'MEDIUM',
    details: JSON.stringify(
      { targetUser: 'usr-002', oldRole: 'user', newRole: 'manager' },
      null,
      2,
    ),
  },
  {
    id: 'log-002',
    timestamp: dayjs().subtract(32, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    actorName: 'Trần Thị Thu',
    actorEmail: 'thu.tran@quantri.gov.vn',
    action: 'Đăng nhập hệ thống qua SSO',
    module: 'Authentication',
    ipAddress: '113.190.22.15',
    status: 'SUCCESS',
    riskLevel: 'LOW',
    details: JSON.stringify(
      { provider: 'SSO Đào tạo', device: 'Chrome 124' },
      null,
      2,
    ),
  },
  {
    id: 'log-003',
    timestamp: dayjs().subtract(2, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    actorName: 'Lê Văn Hoàng',
    actorEmail: 'hoang.le@quantri.gov.vn',
    action: 'Thử nghiệm nhập sai mật khẩu 3 lần',
    module: 'Authentication',
    ipAddress: '42.112.98.110',
    status: 'FAILED',
    riskLevel: 'HIGH',
    details: JSON.stringify({ attempts: 3, alertTriggered: true }, null, 2),
  },
  {
    id: 'log-004',
    timestamp: dayjs().subtract(5, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    actorName: 'Nguyễn Đức Phong',
    actorEmail: 'admin.phong@quantri.gov.vn',
    action: 'Cấu hình thời gian Session Timeout',
    module: 'System Config',
    ipAddress: '14.225.18.42',
    status: 'SUCCESS',
    riskLevel: 'HIGH',
    details: JSON.stringify({ key: 'SESSION_TIMEOUT', value: '30m' }, null, 2),
  },
];

export function AuditPage() {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'ALL' || log.module === category;
    return matchSearch && matchCat;
  });

  const getStatusBadge = (status: AuditLog['status']) => {
    if (status === 'SUCCESS') return <Tag color="success">Thành công</Tag>;
    if (status === 'FAILED') return <Tag color="error">Thất bại</Tag>;
    return <Tag color="warning">Cảnh báo</Tag>;
  };

  const getRiskTag = (risk: AuditLog['riskLevel']) => {
    if (risk === 'HIGH') return <Tag color="red">Cao (High)</Tag>;
    if (risk === 'MEDIUM') return <Tag color="orange">Trung bình</Tag>;
    return <Tag color="blue">Thông thường</Tag>;
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 170,
      render: (t: string) => (
        <Typography.Text style={{ fontSize: 14 }}>{t}</Typography.Text>
      ),
    },
    {
      title: 'Người thực hiện',
      key: 'actor',
      render: (_: unknown, record: AuditLog) => (
        <Flex align="center" gap={10}>
          <UserAvatar
            firstName={record.actorName.split(' ').pop()}
            lastName={record.actorName.split(' ')[0]}
            size={32}
          />
          <div>
            <Typography.Text strong style={{ fontSize: 15, display: 'block' }}>
              {record.actorName}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {record.actorEmail}
            </Typography.Text>
          </div>
        </Flex>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Typography.Text strong style={{ fontSize: 15 }}>
          {action}
        </Typography.Text>
      ),
    },
    {
      title: 'Phân hệ',
      dataIndex: 'module',
      key: 'module',
      width: 160,
      render: (m: string) => <Tag color="geekblue">{m}</Tag>,
    },
    {
      title: 'Địa chỉ IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
      render: (ip: string) => (
        <Typography.Text style={{ fontSize: 14, fontFamily: 'monospace' }}>
          {ip}
        </Typography.Text>
      ),
    },
    {
      title: 'Mức rủi ro',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      width: 130,
      render: (risk: AuditLog['riskLevel']) => getRiskTag(risk),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s: AuditLog['status']) => getStatusBadge(s),
    },
    {
      title: 'Chi tiết',
      key: 'view',
      width: 90,
      align: 'center' as const,
      render: (_: unknown, record: AuditLog) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined style={{ color: '#0866ff' }} />}
          onClick={() => setSelectedLog(record)}
        />
      ),
    },
  ];

  return (
    <PageContainer
      title="Nhật ký truy vết hệ thống"
      subtitle="Ghi nhận toàn bộ thao tác, sự kiện đăng nhập và biến động phân quyền để kiểm soát an ninh."
      extra={<Button icon={<DownloadOutlined />}>Xuất nhật ký (CSV)</Button>}
    >
      {/* Filter Bar */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <Flex gap={12} align="center" wrap="wrap">
            <DatePicker.RangePicker placeholder={['Từ ngày', 'Đến ngày']} />
            <Select
              defaultValue="ALL"
              onChange={(v) => setCategory(v)}
              style={{ width: 180 }}
              options={[
                { label: 'Tất cả phân hệ', value: 'ALL' },
                { label: 'Authentication', value: 'Authentication' },
                { label: 'User Management', value: 'User Management' },
                { label: 'System Config', value: 'System Config' },
              ]}
            />
          </Flex>

          <Flex gap={12} align="center" style={{ minWidth: 260 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Tìm theo email, tên, hành động..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
            <Button icon={<ReloadOutlined />}>Tải lại</Button>
          </Flex>
        </Flex>
      </Card>

      {/* Main Table */}
      <Card styles={{ body: { padding: 0 } }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredLogs}
          pagination={{ pageSize: 10, showTotal: (t) => `Tổng ${t} bản ghi` }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Typography.Text
                      strong
                      style={{ display: 'block', fontSize: 14 }}
                    >
                      Chưa có nhật ký truy vết phù hợp
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      Thay đổi thời gian hoặc từ khóa tìm kiếm để xem các sự
                      kiện hệ thống.
                    </Typography.Text>
                  </div>
                }
              />
            ),
          }}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={
          <Flex align="center" gap={8}>
            <SafetyCertificateOutlined style={{ color: '#0866ff' }} />
            <span>Chi tiết bản ghi nhật ký</span>
          </Flex>
        }
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        width={480}
      >
        {selectedLog && (
          <div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã log">
                {selectedLog.id}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                {selectedLog.timestamp}
              </Descriptions.Item>
              <Descriptions.Item label="Người thực hiện">
                {selectedLog.actorName} ({selectedLog.actorEmail})
              </Descriptions.Item>
              <Descriptions.Item label="Hành động">
                {selectedLog.action}
              </Descriptions.Item>
              <Descriptions.Item label="Phân hệ">
                {selectedLog.module}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ IP">
                {selectedLog.ipAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Mức độ rủi ro">
                {getRiskTag(selectedLog.riskLevel)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusBadge(selectedLog.status)}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 20 }}>
              <Typography.Text
                strong
                style={{ display: 'block', marginBottom: 8 }}
              >
                Payload / Dữ liệu chi tiết:
              </Typography.Text>
              <pre
                style={{
                  background: '#f8fafc',
                  padding: 12,
                  borderRadius: 6,
                  border: '1px solid #e4e6eb',
                  fontSize: 13,
                  overflowX: 'auto',
                }}
              >
                {selectedLog.details}
              </pre>
            </div>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
}
