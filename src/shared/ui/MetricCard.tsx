import { Card, Flex, Tag, Typography, theme } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendType?: 'up' | 'down';
  icon: ReactNode;
}

export function MetricCard({
  title,
  value,
  trend,
  trendType = 'up',
  icon,
}: MetricCardProps) {
  const { token } = theme.useToken();

  return (
    <Card styles={{ body: { padding: 18 } }}>
      <Flex justify="space-between" align="flex-start">
        <div>
          <Typography.Text
            type="secondary"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            {title}
          </Typography.Text>
          <div style={{ marginTop: 4, marginBottom: 6 }}>
            <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography.Title>
          </div>
          <Tag
            color={trendType === 'up' ? 'success' : 'warning'}
            style={{ fontSize: 12, padding: '0 6px', border: 0 }}
          >
            <ArrowUpOutlined style={{ fontSize: 10, marginRight: 2 }} />
            {trend}
          </Tag>
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 6,
            background: token.colorBgLayout,
            color: token.colorPrimary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          {icon}
        </div>
      </Flex>
    </Card>
  );
}
