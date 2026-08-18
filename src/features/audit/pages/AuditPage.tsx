import { useState, useEffect, useCallback } from 'react';
import {
  Tag,
  DatePicker,
  Select,
  Button,
  Flex,
  Typography,
  Drawer,
  Descriptions,
  App,
} from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageContainer, UserAvatar, DataTable } from '../../../shared/ui';
import { auditApi, type AuditLogRecord } from '../api/audit-api';

export interface AuditLogDisplayItem {
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

export function AuditPage() {
  const { message } = App.useApp();
  const [logs, setLogs] = useState<AuditLogDisplayItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogDisplayItem | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const records = await auditApi.getRecentLogs(50);
      const mapped: AuditLogDisplayItem[] = records.map(
        (r: AuditLogRecord) => ({
          id: r.id,
          timestamp: r.createdAt
            ? dayjs(r.createdAt).format('YYYY-MM-DD HH:mm:ss')
            : '—',
          actorName: r.userEmail ? r.userEmail.split('@')[0] : 'Hệ thống',
          actorEmail: r.userEmail || 'system@quantri.gov.vn',
          action: r.description || r.action || 'Thao tác hệ thống',
          module: r.entityType || 'General',
          ipAddress: r.ipAddress || '127.0.0.1',
          status: 'SUCCESS',
          riskLevel: r.action?.toLowerCase().includes('delete')
            ? 'HIGH'
            : 'LOW',
          details: JSON.stringify(r.changes || r, null, 2),
        }),
      );
      setLogs(mapped);
    } catch {
      setLogs([]);
      message.error('Không thể tải danh sách nhật ký truy vết từ máy chủ');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'ALL' || log.module === category;
    return matchSearch && matchCat;
  });

  const getStatusBadge = (status: AuditLogDisplayItem['status']) => {
    if (status === 'SUCCESS') return <Tag color="success">Thành công</Tag>;
    if (status === 'FAILED') return <Tag color="error">Thất bại</Tag>;
    return <Tag color="warning">Cảnh báo</Tag>;
  };

  const getRiskTag = (risk: AuditLogDisplayItem['riskLevel']) => {
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
      render: (_: unknown, record: AuditLogDisplayItem) => (
        <Flex align="center" gap={12}>
          <UserAvatar
            firstName={record.actorName.split(' ').pop()}
            lastName={record.actorName.split(' ')[0]}
            size={36}
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
      render: (risk: AuditLogDisplayItem['riskLevel']) => getRiskTag(risk),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (s: AuditLogDisplayItem['status']) => getStatusBadge(s),
    },
    {
      title: 'Chi tiết',
      key: 'view',
      width: 90,
      align: 'center' as const,
      render: (_: unknown, record: AuditLogDisplayItem) => (
        <Button
          type="text"
          icon={<EyeOutlined style={{ color: '#0866ff', fontSize: 16 }} />}
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
      <DataTable<AuditLogDisplayItem>
        rowKey="id"
        columns={columns}
        dataSource={filteredLogs}
        loading={loading}
        searchPlaceholder="Tìm theo email, tên, hành động..."
        searchValue={search}
        onSearchChange={setSearch}
        filterControls={
          <Flex gap={12} align="center" wrap="wrap">
            <DatePicker.RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              style={{ height: 42 }}
            />
            <Select
              defaultValue="ALL"
              onChange={(v) => setCategory(v)}
              style={{ width: 180, height: 42 }}
              options={[
                { label: 'Tất cả phân hệ', value: 'ALL' },
                { label: 'Authentication', value: 'Authentication' },
                { label: 'User Management', value: 'User Management' },
                { label: 'System Config', value: 'System Config' },
              ]}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchLogs}
              style={{ height: 42 }}
            >
              Tải lại
            </Button>
          </Flex>
        }
        emptyTitle="Chưa có nhật ký truy vết phù hợp"
        emptyDescription="Thay đổi thời gian hoặc từ khóa tìm kiếm để xem các sự kiện hệ thống."
        pagination={{ pageSize: 10, showTotal: (t) => `Tổng ${t} bản ghi` }}
      />

      <Drawer
        title={
          <Flex align="center" gap={10}>
            <SafetyCertificateOutlined
              style={{ color: '#0866ff', fontSize: 20 }}
            />
            <span style={{ fontSize: 17, fontWeight: 700 }}>
              Chi tiết bản ghi nhật ký
            </span>
          </Flex>
        }
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        width={500}
      >
        {selectedLog && (
          <div>
            <Descriptions column={1} bordered size="middle">
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
                style={{ display: 'block', marginBottom: 8, fontSize: 15 }}
              >
                Payload / Dữ liệu chi tiết:
              </Typography.Text>
              <pre
                style={{
                  background: '#f8fafc',
                  padding: 14,
                  borderRadius: 8,
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
