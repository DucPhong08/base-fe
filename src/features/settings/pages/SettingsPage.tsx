import { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  App,
  Row,
  Col,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  SettingOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { PageContainer } from '../../../shared/ui';
import { settingApi } from '../api/setting-api';

export function SettingsPage() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await settingApi.updateValueByKey('SYSTEM_CONFIG', values);
      message.success('Đã lưu cấu hình hệ thống thành công');
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'message' in err &&
        (err as { message: string }).message
      ) {
        message.error(String((err as { message: string }).message));
      } else {
        message.error('Không thể kết nối đến máy chủ để lưu cấu hình');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleMatrixColumns = [
    {
      title: 'Nhóm quyền / Thao tác',
      dataIndex: 'permission',
      key: 'permission',
      render: (p: string) => (
        <Typography.Text strong style={{ fontSize: 15 }}>
          {p}
        </Typography.Text>
      ),
    },
    {
      title: 'Quản trị viên (Admin)',
      dataIndex: 'admin',
      key: 'admin',
      align: 'center' as const,
      render: () => <Tag color="blue">Toàn quyền (Full)</Tag>,
    },
    {
      title: 'Trưởng phòng (Manager)',
      dataIndex: 'manager',
      key: 'manager',
      align: 'center' as const,
      render: (val: boolean) => <Switch defaultChecked={val} size="small" />,
    },
    {
      title: 'Chuyên viên (User)',
      dataIndex: 'user',
      key: 'user',
      align: 'center' as const,
      render: (val: boolean) => <Switch defaultChecked={val} size="small" />,
    },
  ];

  const roleMatrixData = [
    {
      key: '1',
      permission: 'Xem danh sách & Hồ sơ người dùng',
      admin: true,
      manager: true,
      user: true,
    },
    {
      key: '2',
      permission: 'Thêm mới & Chỉnh sửa người dùng',
      admin: true,
      manager: true,
      user: false,
    },
    {
      key: '3',
      permission: 'Xóa tài khoản người dùng',
      admin: true,
      manager: false,
      user: false,
    },
    {
      key: '4',
      permission: 'Xem Nhật ký truy vết (Audit Log)',
      admin: true,
      manager: true,
      user: false,
    },
    {
      key: '5',
      permission: 'Thay đổi cấu hình hệ thống',
      admin: true,
      manager: false,
      user: false,
    },
  ];

  return (
    <PageContainer
      title="Cấu hình hệ thống"
      subtitle="Thiết lập các tham số vận hành chung, chính sách bảo mật và phân quyền hệ thống."
      extra={
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={handleSave}
        >
          Lưu thay đổi
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          appName: 'Quản trị hệ thống Enterprise',
          maintenance: false,
          ssoSync: true,
          timeout: 30,
          minLen: 8,
          enforce2fa: false,
          maxFailed: 5,
          host: 'smtp.quantri.gov.vn',
          port: 587,
          sender: 'no-reply@quantri.gov.vn',
        }}
      >
        <Tabs
          defaultActiveKey="general"
          type="card"
          items={[
            {
              key: 'general',
              label: (
                <span>
                  <SettingOutlined /> Cấu hình chung
                </span>
              ),
              children: (
                <Card>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Tên hệ thống hiển thị" name="appName">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Mã phiên bản (UI Version)">
                        <Input defaultValue="v2.4.0-prod" disabled />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Chế độ bảo trì hệ thống"
                        name="maintenance"
                        valuePropName="checked"
                      >
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Tự động đồng bộ SSO Đào tạo"
                        name="ssoSync"
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="Cho phép"
                          unCheckedChildren="Tắt"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ),
            },
            {
              key: 'security',
              label: (
                <span>
                  <LockOutlined /> Bảo mật & Session
                </span>
              ),
              children: (
                <Card>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Thời gian tự động hết hạn phiên (Phút)"
                        name="timeout"
                      >
                        <InputNumber
                          min={5}
                          max={480}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Độ dài mật khẩu tối thiểu (Ký tự)"
                        name="minLen"
                      >
                        <InputNumber
                          min={6}
                          max={32}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Số lần đăng nhập sai tối đa trước khi khóa IP"
                        name="maxFailed"
                      >
                        <InputNumber
                          min={3}
                          max={10}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Bắt buộc xác thực 2 lớp (2FA)"
                        name="enforce2fa"
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="Bắt buộc"
                          unCheckedChildren="Không"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ),
            },
            {
              key: 'email',
              label: (
                <span>
                  <MailOutlined /> Cổng Email SMTP
                </span>
              ),
              children: (
                <Card>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Máy chủ SMTP Host" name="host">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Cổng SMTP Port" name="port">
                        <InputNumber style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Email người gửi mặc định" name="sender">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={12}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        marginBottom: 24,
                      }}
                    >
                      <Button
                        onClick={() =>
                          message.info(
                            'Đang gửi mail thử nghiệm tới địa chỉ người dùng...',
                          )
                        }
                      >
                        Gửi Email thử nghiệm
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ),
            },
            {
              key: 'matrix',
              label: (
                <span>
                  <SafetyCertificateOutlined /> Ma trận phân quyền
                </span>
              ),
              children: (
                <Card styles={{ body: { padding: 0 } }}>
                  <Table
                    rowKey="key"
                    columns={roleMatrixColumns}
                    dataSource={roleMatrixData}
                    pagination={false}
                  />
                </Card>
              ),
            },
          ]}
        />
      </Form>
    </PageContainer>
  );
}
