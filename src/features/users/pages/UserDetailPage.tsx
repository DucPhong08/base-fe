import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Tabs,
  App,
  Form,
  Input,
  Switch,
  Avatar,
  Space,
  Typography,
  Row,
  Col,
  Flex,
  Timeline,
  Select,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  CalendarOutlined,
  GlobalOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { PageContainer } from '../../../shared/ui/PageContainer';
import { PageError } from '../../../shared/ui/PageError';
import { PageLoading } from '../../../shared/ui/PageLoading';
import { FormActions } from '../../../shared/ui/FormActions';
import {
  useUserQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
} from '../queries';
import type { CreateUserPayload, UpdateUserPayload } from '../types';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const isNew = id === 'new';

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserQuery(isNew ? '' : id!);
  const updateMutation = useUpdateUserMutation();
  const createMutation = useCreateUserMutation();
  const [submitting, setSubmitting] = useState(false);

  // Populate form when user data loads
  useEffect(() => {
    if (user && !isNew) {
      form.setFieldsValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        roleCode: user.role?.code || user.roles?.[0] || 'user',
      });
    }
  }, [user, form, isNew]);

  const handleSubmit = useCallback(
    async (values: CreateUserPayload & UpdateUserPayload) => {
      setSubmitting(true);
      try {
        if (isNew) {
          await createMutation.mutateAsync(values as CreateUserPayload);
          message.success('Đã khởi tạo tài khoản mới thành công');
        } else {
          await updateMutation.mutateAsync({
            id: id!,
            data: {
              firstName: values.firstName,
              lastName: values.lastName,
              isActive: values.isActive,
            },
          });
          message.success('Đã cập nhật thông tin người dùng thành công');
        }
        navigate('/users');
      } catch {
        message.error(
          isNew
            ? 'Không thể tạo người dùng mới'
            : 'Không thể cập nhật thông tin người dùng',
        );
      } finally {
        setSubmitting(false);
      }
    },
    [isNew, id, createMutation, updateMutation, navigate, message],
  );

  if (!isNew && isLoading) return <PageLoading />;
  if (!isNew && isError)
    return <PageError message={error?.message} onRetry={refetch} />;

  // Get user avatar initials
  const initials = user
    ? `${user.lastName?.[0] || ''}${user.firstName?.[0] || ''}`.toUpperCase()
    : 'U';

  const activityLogs = [
    {
      color: 'blue',
      children: (
        <div>
          <Typography.Text strong style={{ fontSize: 13 }}>
            Cập nhật trạng thái phân quyền
          </Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Hôm nay lúc 09:15 bởi Admin Phong
          </Typography.Text>
        </div>
      ),
    },
    {
      color: 'green',
      children: (
        <div>
          <Typography.Text strong style={{ fontSize: 13 }}>
            Đăng nhập hệ thống thành công
          </Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Địa chỉ IP: 14.225.18.42 (Hà Nội, Việt Nam)
          </Typography.Text>
        </div>
      ),
    },
    {
      color: 'gray',
      children: (
        <div>
          <Typography.Text strong style={{ fontSize: 13 }}>
            Đồng bộ tài khoản từ SSO Đào tạo
          </Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Tự động kích hoạt quyền Chuyên viên
          </Typography.Text>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title={isNew ? 'Thêm người dùng mới' : 'Hồ sơ người dùng'}
      subtitle={
        isNew
          ? 'Tạo mới một tài khoản người dùng và thiết lập vai trò ban đầu.'
          : 'Xem thông tin tài khoản, nhật ký thao tác và điều chỉnh phân quyền.'
      }
    >
      {!isNew && user && (
        <Card
          style={{
            marginBottom: 20,
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
          styles={{ body: { padding: '20px 24px' } }}
        >
          <Row gutter={[24, 16]} align="middle">
            <Col xs={24} sm={16}>
              <Flex gap={16} align="center" wrap="wrap">
                <Avatar
                  size={60}
                  style={{
                    background: user.isActive
                      ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'
                      : '#94a3b8',
                    fontSize: 22,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  }}
                >
                  {initials || <UserOutlined />}
                </Avatar>
                <div>
                  <Space align="center" wrap style={{ marginBottom: 4 }}>
                    <Typography.Title
                      level={4}
                      style={{ margin: 0, fontWeight: 700 }}
                    >
                      {user.lastName} {user.firstName}
                    </Typography.Title>
                    <Tag
                      color={user.isActive ? 'success' : 'error'}
                      style={{
                        borderRadius: 12,
                        border: 0,
                        padding: '2px 10px',
                        fontWeight: 500,
                      }}
                    >
                      {user.isActive ? '● Hoạt động' : '○ Đã khóa'}
                    </Tag>
                  </Space>
                  <Typography.Text
                    type="secondary"
                    style={{ display: 'block', fontSize: 13 }}
                  >
                    <MailOutlined style={{ marginRight: 6 }} /> {user.email}
                  </Typography.Text>
                </div>
              </Flex>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                <CalendarOutlined style={{ marginRight: 6 }} /> Ngày khởi tạo:{' '}
                <Typography.Text strong style={{ fontSize: 13 }}>
                  {user.createdAt
                    ? dayjs(user.createdAt).format('DD/MM/YYYY')
                    : '—'}
                </Typography.Text>
              </Typography.Text>
            </Col>
          </Row>
        </Card>
      )}

      <Tabs
        defaultActiveKey="info"
        type="card"
        style={{ marginBottom: 16 }}
        items={[
          {
            key: 'info',
            label: 'Thông tin tài khoản',
            children: (
              <Row gutter={[20, 20]}>
                {!isNew && user && (
                  <Col xs={24} lg={9}>
                    <Card
                      title={
                        <Typography.Text strong style={{ fontSize: 15 }}>
                          📌 Thẻ căn cước hệ thống
                        </Typography.Text>
                      }
                      style={{
                        height: '100%',
                        borderRadius: 10,
                        border: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <Descriptions bordered column={1} size="small">
                        <Descriptions.Item
                          label={
                            <span>
                              <MailOutlined style={{ marginRight: 6 }} /> Email
                            </span>
                          }
                        >
                          <Typography.Text copyable>
                            {user.email}
                          </Typography.Text>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span>
                              <GlobalOutlined style={{ marginRight: 6 }} />{' '}
                              Nguồn xác thực
                            </span>
                          }
                        >
                          <Tag
                            color="blue"
                            style={{ borderRadius: 6, fontWeight: 500 }}
                          >
                            {user.provider?.toUpperCase() || 'LOCAL'}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span>
                              <KeyOutlined style={{ marginRight: 6 }} /> Vai trò
                            </span>
                          }
                        >
                          <Tag
                            color="purple"
                            style={{ borderRadius: 6, fontWeight: 500 }}
                          >
                            {user.role?.name ||
                              user.role?.code ||
                              user.roles?.[0] ||
                              'Chuyên viên'}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span>
                              <CalendarOutlined style={{ marginRight: 6 }} />{' '}
                              Ngày gia nhập
                            </span>
                          }
                        >
                          {user.createdAt
                            ? dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')
                            : '—'}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Col>
                )}

                <Col xs={24} lg={!isNew ? 15 : 24}>
                  <Card
                    title={
                      <Typography.Text strong style={{ fontSize: 15 }}>
                        {isNew
                          ? 'Thông tin người dùng mới'
                          : '✏️ Chỉnh sửa thông tin'}
                      </Typography.Text>
                    }
                    style={{
                      borderRadius: 10,
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      initialValues={{ isActive: true, roleCode: 'user' }}
                    >
                      <Row gutter={16}>
                        {isNew && (
                          <Col xs={24} sm={12}>
                            <Form.Item
                              name="email"
                              label="Địa chỉ Email"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập email',
                                },
                                {
                                  type: 'email',
                                  message: 'Email không hợp lệ',
                                },
                              ]}
                            >
                              <Input
                                prefix={
                                  <MailOutlined style={{ color: '#94a3b8' }} />
                                }
                                placeholder="example@quantri.gov.vn"
                              />
                            </Form.Item>
                          </Col>
                        )}
                        {isNew && (
                          <Col xs={24} sm={12}>
                            <Form.Item
                              name="password"
                              label="Mật khẩu ban đầu"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng đặt mật khẩu',
                                },
                                {
                                  min: 6,
                                  message: 'Mật khẩu tối thiểu 6 ký tự',
                                },
                              ]}
                            >
                              <Input.Password
                                prefix={
                                  <LockOutlined style={{ color: '#94a3b8' }} />
                                }
                                placeholder="Tối thiểu 6 ký tự"
                              />
                            </Form.Item>
                          </Col>
                        )}
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="lastName"
                            label="Họ & Tên đệm"
                            rules={[
                              { required: true, message: 'Vui lòng nhập họ' },
                            ]}
                          >
                            <Input
                              prefix={
                                <UserOutlined style={{ color: '#94a3b8' }} />
                              }
                              placeholder="Nguyễn Đức"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="firstName"
                            label="Tên"
                            rules={[
                              { required: true, message: 'Vui lòng nhập tên' },
                            ]}
                          >
                            <Input
                              prefix={
                                <UserOutlined style={{ color: '#94a3b8' }} />
                              }
                              placeholder="Phong"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="roleCode"
                            label="Chức danh / Vai trò"
                          >
                            <Select
                              options={[
                                {
                                  value: 'admin',
                                  label: 'Quản trị viên hệ thống',
                                },
                                {
                                  value: 'manager',
                                  label: 'Trưởng phòng Khảo thí',
                                },
                                { value: 'user', label: 'Chuyên viên Đào tạo' },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="isActive"
                            label="Trạng thái tài khoản"
                            valuePropName="checked"
                          >
                            <Switch
                              checkedChildren="Hoạt động"
                              unCheckedChildren="Khóa"
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <FormActions
                        loading={submitting}
                        onCancel={() => navigate('/users')}
                        submitText={
                          isNew ? 'Khởi tạo người dùng' : 'Cập nhật thay đổi'
                        }
                      />
                    </Form>
                  </Card>
                </Col>
              </Row>
            ),
          },
          ...(!isNew
            ? [
                {
                  key: 'logs',
                  label: 'Nhật ký hoạt động',
                  children: (
                    <Card
                      style={{
                        borderRadius: 10,
                        border: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <Timeline
                        items={activityLogs}
                        style={{ marginTop: 12 }}
                      />
                    </Card>
                  ),
                },
              ]
            : []),
        ]}
      />
    </PageContainer>
  );
}
