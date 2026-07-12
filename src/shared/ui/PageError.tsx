import { Button, Result } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  message = 'Đã xảy ra lỗi',
  onRetry,
}: PageErrorProps) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <Result
        status="error"
        title="Lỗi"
        subTitle={message}
        extra={
          onRetry && (
            <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
              Thử lại
            </Button>
          )
        }
      />
    </div>
  );
}
