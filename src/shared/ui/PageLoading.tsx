import { Spin } from 'antd';

export function PageLoading() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <Spin size="large" />
    </div>
  );
}
