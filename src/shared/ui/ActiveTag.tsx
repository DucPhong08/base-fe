import { Tag } from 'antd';

interface ActiveTagProps {
  isActive: boolean;
  activeText?: string;
  inactiveText?: string;
}

export function ActiveTag({
  isActive,
  activeText = 'Hoạt động',
  inactiveText = 'Đã khóa',
}: ActiveTagProps) {
  return (
    <Tag color={isActive ? 'success' : 'error'}>
      {isActive ? activeText : inactiveText}
    </Tag>
  );
}
