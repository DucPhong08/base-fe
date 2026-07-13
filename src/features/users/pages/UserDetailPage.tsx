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
  theme,
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
  const { token } = theme.useToken();
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
      });
    }
  }, [user, form, isNew]);

  const handleSubmit = useCallback(
    async (values: CreateUserPayload & UpdateUserPayload) => {
      setSubmitting(true);
      try {
        if (isNew) {
          await createMutation.mutateAsync(values as CreateUserPayload);
          message.success('Tạo người dùng thành công');
        } else {
          await updateMutation.mutateAsync({
            id: id!,
            data: {
              firstName: values.firstName,
              lastName: values.lastName,
              isActive: values.isActive,
            },
          });
          message.success('Cập nhật người dùng thành công');
        }
        navigate('/users');
      } catch {
        message.error(
          isNew ? 'Không thể tạo người dùng' : 'Không thể cập nhật người dùng',
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

  return (
    <PageContainer
      title={isNew ? 'Thêm người dùng mới' : 'Chi tiết thông tin'}
      subtitle={
        isNew
          ? 'Tạo mới một tài khoản người dùng và thiết lập phân quyền ban đầu.'
          : 'Xem chi tiết thông tin hồ sơ và thực hiện chỉnh sửa cấu hình tài khoản.'
      }
    >
      {!isNew && user && (
        <Card
          style={{ marginBottom: 20, borderRadius: 12 }}
          bodyStyle={{ padding: 24 }}
        >
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} sm={16}>
              <Flex gap={16} align="center" wrap="wrap">
                <Avatar
                  size={64}
                  style={{
                    background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                    fontSize: 24,
                    fontWeight: 600,
                    boxShadow: token.boxShadow,
                  }}
                >
                  {initials || <UserOutlined />}
                </Avatar>
                <div>
                  <Space align="center" wrap style={{ marginBottom: 4 }}>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {user.lastName} {user.firstName}
                    </Typography.Title>
                    <Tag
                      color={user.isActive ? 'success' : 'error'}
                      style={{ borderRadius: 4, marginLeft: 8 }}
                    >
                      {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                    </Tag>
                  </Space>
                  <Typography.Text
                    type="secondary"
                    style={{ display: 'block', fontSize: 14 }}
                  >
                    <MailOutlined style={{ marginRight: 6 }} /> {user.email}
                  </Typography.Text>
                </div>
              </Flex>
            </Col>
            <Col
              xs={24}
              sm={8}
              className="user-joined-date"
              style={{ textAlign: 'right' }}
            >
              <Typography.Text type="secondary">
                <CalendarOutlined style={{ marginRight: 6 }} /> Ngày gia nhập:{' '}
                {user.createdAt
                  ? dayjs(user.createdAt).format('DD/MM/YYYY')
                  : '—'}
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
            label: 'Thông tin cá nhân',
            children: (
              <Row gutter={[16, 16]}>
                {!isNew && user && (
                  <Col xs={24} lg={10}>
                    <Card
                      title="Hồ sơ hệ thống"
                      style={{ height: '100%', borderRadius: 10 }}
                    >
                      <Descriptions bordered column={1} size="small">
                        <Descriptions.Item
                          label={
                            <span>
                              <MailOutlined style={{ marginRight: 8 }} /> Email
                            </span>
                          }
                        >
                          {user.email}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span>
                              <GlobalOutlined style={{ marginRight: 8 }} />{' '}
                              Nguồn xác thực
                            </span>
                          }
                        >
                          <Tag color="blue">
                            {user.provider?.toUpperCase() || 'SYSTEM'}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span>
                              <KeyOutlined style={{ marginRight: 8 }} /> Vai trò
                            </span>
                          }
                        >
                          <Tag color="purple">
                            {(
                              user.role?.code ||
                              user.roles?.[0] ||
                              'user'
                            ).toUpperCase()}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span>
                              <CalendarOutlined style={{ marginRight: 8 }} />{' '}
                              Tạo ngày
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

                <Col xs={24} lg={!isNew ? 14 : 24}>
                  <Card
                    title={isNew ? 'Thông tin đăng ký' : 'Cấu hình & Chỉnh sửa'}
                    style={{ borderRadius: 10 }}
                  >
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      initialValues={{ isActive: true }}
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
                                  message: 'Email không đúng định dạng',
                                },
                              ]}
                            >
                              <Input
                                prefix={<MailOutlined />}
                                placeholder="example@domain.com"
                              />
                            </Form.Item>
                          </Col>
                        )}
                        {isNew && (
                          <Col xs={24} sm={12}>
                            <Form.Item
                              name="password"
                              label="Mật khẩu khởi tạo"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng đặt mật khẩu',
                                },
                                {
                                  min: 6,
                                  message: 'Mật khẩu phải từ 6 ký tự trở lên',
                                },
                              ]}
                            >
                              <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Tối thiểu 6 ký tự"
                              />
                            </Form.Item>
                          </Col>
                        )}
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="lastName"
                            label="Họ"
                            rules={[
                              { required: true, message: 'Vui lòng nhập họ' },
                            ]}
                          >
                            <Input
                              prefix={<UserOutlined />}
                              placeholder="Nhập họ (ví dụ: Nguyễn)"
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
                              prefix={<UserOutlined />}
                              placeholder="Nhập tên (ví dụ: An)"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24}>
                          <Form.Item
                            name="isActive"
                            label="Trạng thái kích hoạt"
                            valuePropName="checked"
                          >
                            <Switch
                              checkedChildren="Đang hoạt động"
                              unCheckedChildren="Tài khoản khóa"
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <FormActions
                        loading={submitting}
                        onCancel={() => navigate('/users')}
                        submitText={
                          isNew ? 'Thành lập tài khoản' : 'Lưu thay đổi'
                        }
                      />
                    </Form>
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </PageContainer>
  );
}
