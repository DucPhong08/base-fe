import { Flex, Typography } from 'antd';
import type { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  children: ReactNode;
}

export function PageContainer({
  title,
  subtitle,
  extra,
  children,
}: PageContainerProps) {
  return (
    <div className="page-fade-in">
      <Flex
        justify="space-between"
        align="flex-start"
        wrap="wrap"
        gap={16}
        style={{ marginBottom: 20 }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0, fontWeight: 700 }}>
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Text
              type="secondary"
              style={{ fontSize: 14, marginTop: 4, display: 'block' }}
            >
              {subtitle}
            </Typography.Text>
          )}
        </div>
        {extra && (
          <Flex gap={10} align="center">
            {extra}
          </Flex>
        )}
      </Flex>
      {children}
    </div>
  );
}
