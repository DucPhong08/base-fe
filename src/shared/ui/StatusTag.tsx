import { Tag } from 'antd';

interface StatusConfig {
  label: string;
  color: string;
}

interface StatusTagProps {
  status: string;
  statusMap: Record<string, StatusConfig>;
}

export function StatusTag({ status, statusMap }: StatusTagProps) {
  const config = statusMap[status];
  if (!config) {
    return <Tag>{status}</Tag>;
  }
  return <Tag color={config.color}>{config.label}</Tag>;
}
