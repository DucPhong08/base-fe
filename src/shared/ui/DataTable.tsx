import { useState, useEffect, type ReactNode } from 'react';
import { Card, Table, Input, Flex, Typography, Empty } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useDebounce } from '../hooks/useDebounce';

export interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  columns: TableProps<T>['columns'];
  dataSource: T[];
  loading?: boolean;
  rowKey: TableProps<T>['rowKey'];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  debounceSearchMs?: number;
  filterControls?: ReactNode;
  extraActions?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  pagination?: TableProps<T>['pagination'];
  onChange?: TableProps<T>['onChange'];
}

export function DataTable<T extends object>({
  title,
  subtitle,
  columns,
  dataSource,
  loading = false,
  rowKey,
  searchPlaceholder = 'Tìm kiếm dữ liệu...',
  searchValue = '',
  onSearchChange,
  debounceSearchMs = 300,
  filterControls,
  extraActions,
  emptyTitle = 'Không tìm thấy dữ liệu phù hợp',
  emptyDescription = 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.',
  pagination = {
    pageSize: 10,
    showTotal: (total) => `Tổng số ${total} bản ghi`,
  },
  onChange,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState(searchValue);
  const debouncedSearch = useDebounce(internalSearch, debounceSearchMs);

  useEffect(() => {
    setInternalSearch(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (onSearchChange && debouncedSearch !== searchValue) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange, searchValue]);

  return (
    <Card
      style={{ borderRadius: 10 }}
      title={
        title ? (
          <div>
            <Typography.Title
              level={4}
              style={{ margin: 0, fontWeight: 700, fontSize: 18 }}
            >
              {title}
            </Typography.Title>
            {subtitle && (
              <Typography.Text
                type="secondary"
                style={{ fontSize: 13, fontWeight: 400 }}
              >
                {subtitle}
              </Typography.Text>
            )}
          </div>
        ) : undefined
      }
      extra={extraActions}
    >
      {(onSearchChange || filterControls) && (
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={12}
          style={{ marginBottom: 16 }}
        >
          <Flex align="center" gap={12} style={{ flex: 1, minWidth: 260 }}>
            {onSearchChange && (
              <Input
                placeholder={searchPlaceholder}
                prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                allowClear
                style={{ maxWidth: 360, height: 42 }}
              />
            )}
            {filterControls}
          </Flex>
        </Flex>
      )}

      <Table<T>
        rowKey={rowKey}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Typography.Text
                    strong
                    style={{ display: 'block', fontSize: 15 }}
                  >
                    {emptyTitle}
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {emptyDescription}
                  </Typography.Text>
                </div>
              }
            />
          ),
        }}
        scroll={{ x: 720 }}
      />
    </Card>
  );
}
