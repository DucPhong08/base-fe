import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  size?: number;
}

export function UserAvatar({
  firstName,
  lastName,
  isActive = true,
  size = 34,
}: UserAvatarProps) {
  const initials =
    `${lastName?.[0] || ''}${firstName?.[0] || ''}`.toUpperCase() || '';

  return (
    <Avatar
      size={size}
      style={{
        background: isActive ? '#0866ff' : '#9ca3af',
        fontWeight: 600,
        fontSize: Math.max(12, Math.floor(size * 0.4)),
        flexShrink: 0,
      }}
      icon={!initials ? <UserOutlined /> : undefined}
    >
      {initials}
    </Avatar>
  );
}
