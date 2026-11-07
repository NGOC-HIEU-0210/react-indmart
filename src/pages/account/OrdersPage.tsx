import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMyOrders } from '@/features/orders/hooks/useOrders';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs } from '@/components/ui/Tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

export const OrdersPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useMyOrders();
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const orders = data?.data || [];

  const tabs = [
    { id: 'ALL', label: 'Tất cả', count: orders.length },
    { id: 'PENDING', label: 'Chờ xử lý', count: orders.filter((o) => (o.status || '').toUpperCase() === 'PENDING').length },
    { id: 'SHIPPING', label: 'Đang giao', count: orders.filter((o) => ['CONFIRMED', 'SHIPPING'].includes((o.status || '').toUpperCase())).length },
    { id: 'COMPLETED', label: 'Hoàn tất', count: orders.filter((o) => (o.status || '').toUpperCase() === 'COMPLETED').length },
    { id: 'CANCELLED', label: 'Đã huỷ', count: orders.filter((o) => (o.status || '').toUpperCase() === 'CANCELLED').length },
  ];

  const filteredOrders = useMemo(() => {
    if (activeTab === 'ALL') return orders;
    if (activeTab === 'SHIPPING') {
      return orders.filter((o) => ['CONFIRMED', 'SHIPPING'].includes((o.status || '').toUpperCase()));
    }
    return orders.filter((o) => (o.status || '').toUpperCase() === activeTab);
  }, [orders, activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spinner size="md" label="Đang tải danh sách đơn hàng..." />
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Đơn hàng của tôi</h2>

      {/* Tabs lọc theo trạng thái */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="Không có đơn hàng nào"
          description={
            activeTab === 'ALL'
              ? 'Bạn chưa đặt đơn hàng nào tại IND MART.'
              : 'Không có đơn hàng nào ở trạng thái này.'
          }
          action={
            <Link to="/products">
              <Button variant="primary" size="sm">
                Đi mua sắm ngay
              </Button>
            </Link>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Số SP</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-semibold text-primary-700">
                  {order.orderCode}
                </TableCell>
                <TableCell>{formatDateTime(order.orderDate)}</TableCell>
                <TableCell>{order.items?.length || 0} món</TableCell>
                <TableCell className="font-bold">{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} type="order" />
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/account/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Xem
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};
export default OrdersPage;
