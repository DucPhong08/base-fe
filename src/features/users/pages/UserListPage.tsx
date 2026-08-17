import { useCallback, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Input,
  Table,
  Tag,
  App,
  Tooltip,
  Space,
  Avatar,
  Typography,
  Flex,
  Segmented,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  UserOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd';
import dayjs from 'dayjs';
import { PageContainer } from '../../../shared/ui/PageContainer';
import { PageError } from '../../../shared/ui/PageError';
import { ConfirmAction } from '../../../shared/ui/ConfirmAction';
import { useUsersQuery, useDeleteUserMutation } from '../queries';
import type { User } from '../types';

export function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || '';

  const condition = useMemo(() => {
    if (!search) return undefined;
    return JSON.stringify({ email: { $regex: search, $options: 'i' } });
  }, [search]);

  const { data, isLoading, isError, error, refetch } = useUsersQuery({
    page,
    limit,
    condition,
  });
  const deleteMutation = useDeleteUserMutation();

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(pagination.current || 1));
        next.set('limit', String(pagination.pageSize || 10));
        return next;
      });
    },
    [setSearchParams],
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set('search', value);
        } else {
          next.delete('search');
        }
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
        message.success('Đã xóa người dùng thành công');
      } catch {
        message.error('Không thể xóa người dùng này');
      }
    },
    [deleteMutation, message],
  );

  const filteredUsers = useMemo(() => {
    if (!data?.data) return [];
    if (roleFilter === 'all') return data.data;
    return data.data.filter((u) => {
      const code = u.role?.code || u.roles?.[0] || 'user';
      return code === roleFilter;
    });
  }, [data?.data, roleFilter]);

  if (isError) {
    return <PageError message={error?.message} onRetry={refetch} />;
  }

  const getRoleBadge = (user: User) => {
    const roleCode = user.role?.code || user.roles?.[0] || 'user';
    const roleName =
      user.role?.name ||
      (roleCode === 'admin'
        ? 'Quản trị viên'
        : roleCode === 'manager'
          ? 'Trưởng phòng'
          : 'Chuyên viên');

    if (roleCode === 'admin') {
      return (
        <Tag color="purple" style={{ borderRadius: 6, fontWeight: 500 }}>
          {roleName}
        </Tag>
      );
    }
    if (roleCode === 'manager') {
      return (
        <Tag color="blue" style={{ borderRadius: 6, fontWeight: 500 }}>
          {roleName}
        </Tag>
      );
    }
    return (
      <Tag color="default" style={{ borderRadius: 6, fontWeight: 500 }}>
        {roleName}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Họ tên & Email',
      key: 'user_info',
      render: (_: unknown, record: User) => {
        const initials =
          `${record.lastName?.[0] || ''}${record.firstName?.[0] || ''}`.toUpperCase() ||
          'U';
        return (
          <Flex align="center" gap={12}>
            <Avatar
              size={36}
              style={{
                background: record.isActive
                  ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
                  : '#94a3b8',
                fontWeight: 600,
                fontSize: 13,
                flexShrink: 0,
              }}
              icon={!initials ? <UserOutlined /> : undefined}
            >
              {initials}
            </Avatar>
            <div>
              <Typography.Text
                strong
                style={{ display: 'block', lineHeight: 1.3 }}
              >
                {record.lastName} {record.firstName}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {record.email}
              </Typography.Text>
            </div>
          </Flex>
        );
      },
    },
    {
      title: 'Vai trò & Chức vụ',
      key: 'role',
      width: 180,
      render: (_: unknown, record: User) => getRoleBadge(record),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      render: (isActive: boolean) => (
        <Tag
          color={isActive ? 'success' : 'error'}
          style={{
            borderRadius: 12,
            border: 0,
            padding: '2px 10px',
            fontWeight: 500,
          }}
        >
          {isActive ? '● Hoạt động' : '○ Đã khóa'}
        </Tag>
      ),
    },
    {
      title: 'Ngày khởi tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt?: string) => (
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {createdAt ? dayjs(createdAt).format('DD/MM/YYYY') : '—'}
        </Typography.Text>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: unknown, record: User) => (
        <Space size={6}>
          <Tooltip title="Xem & Chỉnh sửa thông tin">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: '#2563eb' }} />}
              onClick={() => navigate(`/users/${record.id}`)}
            />
          </Tooltip>
          <ConfirmAction
            title="Xác nhận xóa người dùng?"
            description="Hành động này sẽ xóa tài khoản khỏi hệ thống."
            onConfirm={() => handleDelete(record.id)}
            loading={deleteMutation.isPending}
          >
            <Tooltip title="Xóa tài khoản">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </ConfirmAction>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="Danh sách người dùng"
      subtitle="Quản lý hồ sơ tài khoản, phân quyền quản trị và trạng thái truy cập."
      extra={
        <Flex gap={10}>
          <Button
            icon={<DownloadOutlined />}
            onClick={() =>
              message.info('Đang xuất danh sách tài khoản dưới dạng CSV...')
            }
            style={{ height: 38 }}
          >
            Xuất dữ liệu
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/users/new')}
            style={{ height: 38 }}
          >
            Thêm người dùng mới
          </Button>
        </Flex>
      }
    >
      {/* Filter & Role Tabs Bar */}
      <Card
        size="small"
        style={{
          marginBottom: 16,
          borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.06)',
        }}
        styles={{ body: { padding: '14px 18px' } }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={14}>
          <Flex align="center" gap={12} wrap="wrap">
            <Segmented
              value={roleFilter}
              onChange={(val) => setRoleFilter(val as string)}
              options={[
                { label: 'Tất cả tài khoản', value: 'all' },
                { label: 'Quản trị viên', value: 'admin' },
                { label: 'Trưởng phòng', value: 'manager' },
                { label: 'Chuyên viên', value: 'user' },
              ]}
            />
          </Flex>

          <Flex align="center" gap={12} style={{ minWidth: 320 }}>
            <Input.Search
              placeholder="Tìm theo email, tên..."
              defaultValue={search}
              onSearch={handleSearch}
              enterButton={
                <Button type="primary" icon={<SearchOutlined />}>
                  Tìm
                </Button>
              }
              allowClear
              style={{ width: '100%' }}
            />
          </Flex>
        </Flex>
      </Card>

      {/* Main Users Table */}
      <Card
        styles={{ body: { padding: 0 } }}
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: filteredUsers.length,
            showSizeChanger: true,
            showTotal: (total) => `Hiển thị ${total} tài khoản`,
          }}
          onChange={handleTableChange}
          locale={{ emptyText: 'Không tìm thấy tài khoản nào phù hợp' }}
          scroll={{ x: 720 }}
        />
      </Card>
    </PageContainer>
  );
}
