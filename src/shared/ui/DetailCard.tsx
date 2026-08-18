import { type ReactNode } from 'react';
import { Card, Descriptions, Typography, Flex } from 'antd';

export interface DetailCardItem {
  key: string;
  label: string;
  value: ReactNode;
  span?: number;
}

export interface DetailCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  extra?: ReactNode;
  items: DetailCardItem[];
  column?: number | { [key: string]: number };
}

export function DetailCard({
  title,
  subtitle,
  icon,
  extra,
  items,
  column = { xs: 1, sm: 2, md: 3 },
}: DetailCardProps) {
  return (
    <Card
      style={{ borderRadius: 10, marginBottom: 20 }}
      title={
        <Flex align="center" gap={10}>
          {icon && (
            <span style={{ fontSize: 20, color: '#0866ff' }}>{icon}</span>
          )}
          <div>
            <Typography.Text strong style={{ fontSize: 17, display: 'block' }}>
              {title}
            </Typography.Text>
            {subtitle && (
              <Typography.Text
                type="secondary"
                style={{ fontSize: 13, fontWeight: 400 }}
              >
                {subtitle}
              </Typography.Text>
            )}
          </div>
        </Flex>
      }
      extra={extra}
    >
      <Descriptions bordered column={column} size="middle">
        {items.map((item) => (
          <Descriptions.Item key={item.key} label={item.label} span={item.span}>
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
}
