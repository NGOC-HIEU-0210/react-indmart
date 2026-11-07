import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  useOrderDetail,
  useOrderTracking,
  useOrderStatuses,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
  useDeleteOrder,
} from '@/features/orders/hooks/useOrders';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { OrderTrackingTimeline } from '@/features/orders/components/OrderTrackingTimeline';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || '0', 10);
  const navigate = useNavigate();

  const { data: orderData, isLoading: isOrderLoading, isError, refetch } = useOrderDetail(orderId);
  const { data: trackingData, isLoading: isTrackingLoading } = useOrderTracking(orderId);
  const { data: statusesData } = useOrderStatuses();

  const updateStatusMutation = useUpdateOrderStatus();
  const updatePaymentMutation = useUpdatePaymentStatus();
  const deleteOrderMutation = useDeleteOrder();

  const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>(undefined);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const order = orderData?.data;
  const trackingList = trackingData?.data || [];
  const statuses = statusesData?.data || [];

  if (isOrderLoading || isTrackingLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Đang tải chi tiết đơn hàng..." />
      </div>
    );
  }

  if (isError || !order) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const currentStatusId = selectedStatusId ?? order.statusId ?? statuses.find((s) => s.code === order.status || s.name === order.status)?.id;

  const handleUpdateStatus = () => {
    if (!currentStatusId) return;
    updateStatusMutation.mutate({ id: order.id, statusId: currentStatusId });
  };

  const handleTogglePaymentStatus = () => {
    const nextStatus = order.paymentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    updatePaymentMutation.mutate({ id: order.id, paymentStatus: nextStatus });
  };

  const handleConfirmDelete = () => {
    deleteOrderMutation.mutate(order.id, {
      onSuccess: () => navigate('/admin/orders'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <Link to="/admin/orders" className="text-xs text-primary-700 hover:underline mb-1 inline-block">
            &larr; Quay lại danh sách đơn hàng
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              Chi tiết đơn hàng #{order.orderCode}
            </h1>
            <StatusBadge status={order.status} type="order" />
            <StatusBadge status={order.paymentStatus} type="payment" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ngày đặt: {formatDateTime(order.orderDate)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteConfirmOpen(true)}
          >
            Xoá đơn
          </Button>
        </div>
      </div>

      {/* Control panel: Đổi trạng thái & Cập nhật thanh toán */}
      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Đổi trạng thái */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-700 shrink-0">Trạng thái đơn:</span>
            <Select
              className="py-1 text-xs w-44"
              value={currentStatusId || ''}
              onChange={(e) => setSelectedStatusId(parseInt(e.target.value, 10))}
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleUpdateStatus}
              isLoading={updateStatusMutation.isPending}
            >
              Cập nhật
            </Button>
          </div>

          {/* Đổi trạng thái thanh toán */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-gray-700">Thanh toán:</span>
            <Button
              type="button"
              variant={order.paymentStatus === 'PAID' ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleTogglePaymentStatus}
              isLoading={updatePaymentMutation.isPending}
            >
              {order.paymentStatus === 'PAID' ? 'Đánh dấu Chưa thanh toán' : 'Đánh dấu Đã thanh toán'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin khách hàng & Danh sách món */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
              Thông tin khách hàng & Giao hàng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block">Tên người nhận:</span>
                <span className="font-semibold text-gray-800">{order.customerName}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Số điện thoại:</span>
                <span className="font-semibold text-gray-800">{order.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Email:</span>
                <span className="text-gray-800">{order.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Phương thức thanh toán:</span>
                <span className="font-semibold text-gray-800">
                  {order.paymentMethod === 'COD' ? 'Khi nhận hàng (COD)' : 'Chuyển khoản'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-400 block">Địa chỉ giao:</span>
                <span className="text-gray-800">{order.address}</span>
              </div>
              {order.note && (
                <div className="sm:col-span-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                  <span className="text-gray-400 block">Ghi chú của khách:</span>
                  <span className="text-gray-700 italic">{order.note}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Danh sách món */}
          <Card className="p-5">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
              Danh sách sản phẩm trong đơn
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                      <ImageWithFallback
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-bold text-gray-900 shrink-0">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2 text-sm">
              {order.couponCode && (
                <div className="flex justify-between text-xs text-green-700">
                  <span>Mã coupon đã dùng</span>
                  <span className="font-semibold">{order.couponCode}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline font-bold text-base">
                <span className="text-gray-900">Tổng giá trị đơn:</span>
                <span className="text-primary-700 text-lg">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Cột phải: Tracking lịch sử */}
        <div className="lg:col-span-1">
          <Card className="p-5">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              Lịch sử trạng thái (Tracking)
            </h2>
            <OrderTrackingTimeline trackingList={trackingList} />
          </Card>
        </div>
      </div>

      {/* Confirm Delete Order */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xoá đơn hàng này?"
        message={`Cảnh báo: Bạn có chắc chắn muốn xoá đơn hàng #${order.orderCode} không? Thao tác này sẽ xoá vĩnh viễn đơn hàng và lịch sử tracking liên quan.`}
        confirmLabel="Xoá đơn hàng"
        isLoading={deleteOrderMutation.isPending}
      />
    </div>
  );
};
export default AdminOrderDetailPage;
