import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { PaymentStatus } from '@/types';

export interface StatusBadgeProps {
  status?: string | number | boolean;
  type?: 'order' | 'payment' | 'batch' | 'product';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'order' }) => {
  if (status === undefined || status === null) {
    return <Badge variant="neutral">-</Badge>;
  }

  // Trạng thái thanh toán
  if (type === 'payment') {
    const s = String(status).toUpperCase() as PaymentStatus;
    if (s === 'PAID') {
      return <Badge variant="success">Đã thanh toán</Badge>;
    }
    return <Badge variant="warning">Chưa thanh toán</Badge>;
  }

  // Trạng thái lô hàng
  if (type === 'batch') {
    const s = String(status).toUpperCase();
    if (s === 'ACTIVE') return <Badge variant="success">Đang hoạt động</Badge>;
    if (s === 'SOLD_OUT') return <Badge variant="neutral">Đã bán hết</Badge>;
    if (s === 'EXPIRED') return <Badge variant="danger">Đã hết hạn</Badge>;
    return <Badge variant="neutral">{s}</Badge>;
  }

  // Trạng thái sản phẩm
  if (type === 'product') {
    const active = Boolean(status);
    return active ? (
      <Badge variant="success">Đang bán</Badge>
    ) : (
      <Badge variant="neutral">Ngừng bán</Badge>
    );
  }

  // Trạng thái đơn hàng (chuỗi hoặc mã code)
  const orderStatus = String(status).toUpperCase();
  switch (orderStatus) {
    case 'PENDING':
    case '1':
      return <Badge variant="warning">Chờ xử lý</Badge>;
    case 'CONFIRMED':
    case '2':
      return <Badge variant="info">Đã xác nhận</Badge>;
    case 'SHIPPING':
    case '3':
      return <Badge variant="info">Đang giao hàng</Badge>;
    case 'COMPLETED':
    case '4':
      return <Badge variant="success">Hoàn tất</Badge>;
    case 'CANCELLED':
    case '5':
      return <Badge variant="danger">Đã huỷ</Badge>;
    default:
      return <Badge variant="neutral">{String(status)}</Badge>;
  }
};

