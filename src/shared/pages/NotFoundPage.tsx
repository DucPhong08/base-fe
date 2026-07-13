import { Button, Result, theme } from 'antd';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: token.colorBgLayout,
        animation: 'fadeIn 0.4s ease',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Trang bạn tìm kiếm không tồn tại."
        extra={
          <Button type="primary" size="large" onClick={() => navigate('/')}>
            Về trang chủ
          </Button>
        }
      />
    </div>
  );
}
