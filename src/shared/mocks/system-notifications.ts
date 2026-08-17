export interface SystemNotification {
  id: string | number;
  title: string;
  time: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface ActivityLogItem {
  id: string;
  title: string;
  action: string;
  time: string;
  type: 'user' | 'system' | 'audit';
}

export interface SystemStatMetric {
  title: string;
  value: number | string;
  trend: string;
  trendType: 'up' | 'down';
  color: string;
  bg: string;
}

export const MOCK_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n-1',
    title: 'Đồng bộ 42 tài khoản từ SSO Đào tạo',
    time: '10 phút trước',
    read: false,
    type: 'success',
  },
  {
    id: 'n-2',
    title: 'Phê duyệt 128 bài thi học kỳ 1',
    time: '1 giờ trước',
    read: false,
    type: 'info',
  },
  {
    id: 'n-3',
    title: 'Tự động sao lưu dữ liệu hệ thống định kỳ',
    time: 'Hôm qua lúc 23:00',
    read: true,
    type: 'warning',
  },
];

export const MOCK_RECENT_ACTIVITIES: ActivityLogItem[] = [
  {
    id: 'act-1',
    title: 'Nguyễn Đức Phong',
    action: 'Cập nhật trạng thái người dùng mai.tran@quantri.gov.vn',
    time: '10 phút trước',
    type: 'user',
  },
  {
    id: 'act-2',
    title: 'Hệ thống',
    action: 'Tự động đồng bộ 42 tài khoản từ SSO Đào tạo',
    time: '45 phút trước',
    type: 'system',
  },
  {
    id: 'act-3',
    title: 'Trần Thị Thanh Mai',
    action: 'Phê duyệt danh sách 128 bài thi học kỳ 1',
    time: '2 giờ trước',
    type: 'audit',
  },
  {
    id: 'act-4',
    title: 'Lê Hoàng Nam',
    action: 'Thêm mới tài khoản chuyên viên giám thị hong.vu@quantri.gov.vn',
    time: '4 giờ trước',
    type: 'user',
  },
];

export const MOCK_DASHBOARD_STATS: SystemStatMetric[] = [
  {
    title: 'Tổng người dùng',
    value: 1248,
    trend: '+12.4%',
    trendType: 'up',
    color: '#2563eb',
    bg: 'rgba(37, 99, 235, 0.1)',
  },
  {
    title: 'Tài khoản hoạt động',
    value: 1180,
    trend: '94.5%',
    trendType: 'up',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  {
    title: 'Túi thi chờ xử lý',
    value: 42,
    trend: '-5.2%',
    trendType: 'down',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
  },
  {
    title: 'Trạng thái kết nối',
    value: 'Sẵn sàng',
    trend: '100% Uptime',
    trendType: 'up',
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.1)',
  },
];
