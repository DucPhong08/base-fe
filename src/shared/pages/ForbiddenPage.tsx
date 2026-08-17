import { Button, Result, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

export function ForbiddenPage() {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        background: token.colorBgLayout,
        animation: 'fadeIn 0.4s ease',
      }}
    >
      <Result
        status="403"
        title="403 — Từ chối truy cập"
        subTitle="Tài khoản của bạn chưa được cấp quyền hạn truy cập module nghiệp vụ này. Vui lòng liên hệ Quản trị viên hệ thống."
        extra={
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            style={{ borderRadius: 8, height: 42 }}
          >
            Quay lại Trung tâm điều hành
          </Button>
        }
      />
    </div>
  );
}
