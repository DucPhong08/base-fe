import { useCallback, useState } from 'react';
import { Form, Input, Button, App } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
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
          err instanceof ApiError ? err.message : 'Đăng nhập thất bại';
        message.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [login, navigate, from, message],
  );

  return (
    <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không hợp lệ' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mật khẩu"
          size="large"
        />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          style={{ height: 44, fontWeight: 500 }}
        >
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
}
