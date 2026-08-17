import { useCallback, useState } from 'react';
import { Form, Input, Button, App, Typography, Divider } from 'antd';
import {
  LockOutlined,
  MailOutlined,
  ArrowRightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth-provider';
import type { LoginCredentials } from '../types';
import { ApiError } from '../../../shared/api/api-error';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = useCallback(
    async (values: LoginCredentials) => {
      setLoading(true);
      try {
        await login(values);
        navigate(from, { replace: true });
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.message
            : 'Đăng nhập thất bại. Vui lòng kiểm tra lại email & mật khẩu';
        message.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [login, navigate, from, message],
  );

  const fillQuickAdmin = () => {
    form.setFieldsValue({
      email: 'admin.phong@quantri.gov.vn',
      password: 'AdminPassword123!',
    });
  };

  return (
    <div>
      <Typography.Title
        level={4}
        style={{ marginTop: 0, marginBottom: 4, fontWeight: 600 }}
      >
        Đăng nhập hệ thống
      </Typography.Title>
      <Typography.Paragraph
        type="secondary"
        style={{ fontSize: 13, marginBottom: 20 }}
      >
        Nhập thông tin tài khoản được cấp bởi đơn vị quản trị.
      </Typography.Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          label="Địa chỉ Email"
          rules={[
            { required: true, message: 'Vui lòng nhập địa chỉ email' },
            { type: 'email', message: 'Email không đúng định dạng' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
            placeholder="admin.phong@quantri.gov.vn"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu truy cập"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
            placeholder="••••••••"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16, marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            icon={<ArrowRightOutlined />}
          >
            Đăng nhập ngay
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '16px 0', fontSize: 12 }}>
        Chế độ thử nghiệm phát triển
      </Divider>

      <div style={{ textAlign: 'center' }}>
        <Button
          type="dashed"
          size="small"
          icon={<UserOutlined />}
          onClick={fillQuickAdmin}
        >
          Điền nhanh tài khoản Admin
        </Button>
      </div>
    </div>
  );
}
