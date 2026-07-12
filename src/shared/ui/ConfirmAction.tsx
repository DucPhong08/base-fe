import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

interface ConfirmActionProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  loading?: boolean;
  danger?: boolean;
  children: ReactNode;
}

export function ConfirmAction({
  title,
  description,
  onConfirm,
  loading = false,
  danger = true, // default to true since it's mostly used for destructive actions like delete
  children,
}: ConfirmActionProps) {
  return (
    <Popconfirm
      title={title}
      description={description}
      onConfirm={onConfirm}
      okButtonProps={{ loading, danger }}
      okText="Xác nhận"
      cancelText="Quay lại"
      icon={
        <QuestionCircleOutlined
          style={{ color: danger ? '#ff4d4f' : '#1890ff' }}
        />
      }
      placement="topRight"
    >
      {children}
    </Popconfirm>
  );
}
