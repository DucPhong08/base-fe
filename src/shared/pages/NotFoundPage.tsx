import { Button, Result, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

export function NotFoundPage() {
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
        status="404"
        title="404 — Trang không tồn tại"
        subTitle="Đường dẫn truy cập không chính xác hoặc đã bị di chuyển khỏi hệ thống quản trị."
        extra={
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            style={{ borderRadius: 8, height: 42 }}
          >
            Về Trung tâm điều hành
          </Button>
        }
      />
    </div>
  );
}
