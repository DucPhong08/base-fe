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
      return <Tag color="blue">{roleName}</Tag>;
    }
    if (roleCode === 'manager') {
      return <Tag color="geekblue">{roleName}</Tag>;
    }
    return <Tag>{roleName}</Tag>;
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
              size={34}
              style={{
                background: record.isActive ? '#0866ff' : '#9ca3af',
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
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Hoạt động' : 'Đã khóa'}
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
        <Space size={4}>
          <Tooltip title="Xem & Chỉnh sửa thông tin">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: '#0866ff' }} />}
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
        <Flex gap={8}>
          <Button
            icon={<DownloadOutlined />}
            onClick={() =>
              message.info('Đang xuất danh sách tài khoản dưới dạng CSV...')
            }
          >
            Xuất dữ liệu
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/users/new')}
          >
            Thêm người dùng mới
          </Button>
        </Flex>
      }
    >
      {/* Filter & Role Tabs Bar */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
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

          <Flex align="center" gap={12} style={{ minWidth: 280 }}>
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
      <Card styles={{ body: { padding: 0 } }}>
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
