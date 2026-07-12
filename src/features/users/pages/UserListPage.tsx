import { useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Card, Input, Table, Tag, App, Tooltip, Space } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd';
import { PageContainer } from '../../../shared/ui/PageContainer';
import { PageError } from '../../../shared/ui/PageError';
import { ConfirmAction } from '../../../shared/ui/ConfirmAction';
import { useUsersQuery, useDeleteUserMutation } from '../queries';
import type { User } from '../types';

export function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = App.useApp();

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

  if (isError) {
    return <PageError message={error?.message} onRetry={refetch} />;
  }

  const columns = [
    {
      title: 'Email / Tài khoản',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => (
        <span style={{ fontWeight: 500, color: '#1f1f1f' }}>{email}</span>
      ),
    },
    {
      title: 'Họ',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Tên',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      render: (isActive: boolean) => (
        <Tag
          color={isActive ? 'success' : 'error'}
          style={{ padding: '2px 8px', borderRadius: 4 }}
        >
          {isActive ? 'Hoạt động' : 'Đã khóa'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 110,
      align: 'center' as const,
      render: (_: unknown, record: User) => (
        <Space size={4}>
          <Tooltip title="Xem & Sửa thông tin">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/users/${record.id}`)}
              style={{ color: '#1677ff' }}
            />
          </Tooltip>
          <ConfirmAction
            title="Xác nhận xóa người dùng?"
            description="Hành động này sẽ xóa vĩnh viễn tài khoản người dùng và không thể hoàn tác."
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
      subtitle="Quản lý thông tin tài khoản, phân quyền và trạng thái hoạt động của thành viên."
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/new')}
          style={{ height: 38, display: 'flex', alignItems: 'center' }}
        >
          Thêm người dùng mới
        </Button>
      }
    >
      <Card
        size="small"
        style={{
          marginBottom: 16,
          borderRadius: 8,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        }}
      >
        <Input.Search
          placeholder="Tìm kiếm theo địa chỉ email..."
          defaultValue={search}
          onSearch={handleSearch}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          }
          allowClear
          style={{ maxWidth: 450, width: '100%' }}
        />
      </Card>

      <Card
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 10, overflow: 'hidden' }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data?.data}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} người dùng`,
          }}
          onChange={handleTableChange}
          locale={{ emptyText: 'Không tìm thấy người dùng nào phù hợp' }}
        />
      </Card>
    </PageContainer>
  );
}
