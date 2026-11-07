import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderDetail, useOrderTracking, useCancelOrder } from '@/features/orders/hooks/useOrders';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { OrderTrackingTimeline } from '@/features/orders/components/OrderTrackingTimeline';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || '0', 10);

  const { data: orderData, isLoading: isOrderLoading, isError, refetch } = useOrderDetail(orderId);
  const { data: trackingData, isLoading: isTrackingLoading } = useOrderTracking(orderId);
  const cancelOrderMutation = useCancelOrder();

  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const order = orderData?.data;
  const trackingList = trackingData?.data || [];

  if (isOrderLoading || isTrackingLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Đang tải thông tin chi tiết đơn hàng..." />
      </div>
    );
  }

  if (isError || !order) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  // Khách chỉ được huỷ đơn khi PENDING và UNPAID
  const canCancel =
    (order.status || '').toUpperCase() === 'PENDING' &&
    (order.paymentStatus || '').toUpperCase() === 'UNPAID';

  const handleConfirmCancel = () => {
    cancelOrderMutation.mutate(order.id, {
      onSuccess: () => setIsCancelConfirmOpen(false),
    });
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & nút huỷ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <Link to="/account/orders" className="text-xs text-primary-700 hover:underline mb-1 inline-block">
            &larr; Quay lại danh sách đơn hàng
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              Đơn hàng #{order.orderCode}
            </h1>
            <StatusBadge status={order.status} type="order" />
            <StatusBadge status={order.paymentStatus} type="payment" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Đặt ngày {formatDateTime(order.orderDate)}
          </p>
        </div>

        {canCancel && (
          <div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setIsCancelConfirmOpen(true)}
            >
              Huỷ đơn hàng
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin nhận hàng & Danh sách món */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thông tin nhận hàng */}
          <Card className="p-5">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
              Thông tin nhận hàng
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block">Người nhận:</span>
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
                <span className="text-gray-400 block">Địa chỉ giao hàng:</span>
                <span className="text-gray-800">{order.address}</span>
              </div>
              {order.note && (
                <div className="sm:col-span-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                  <span className="text-gray-400 block">Ghi chú:</span>
                  <span className="text-gray-700 italic">{order.note}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Danh sách món */}
          <Card className="p-5">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
              Chi tiết sản phẩm ({order.items?.length || 0} món)
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                      <ImageWithFallback
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="text-sm font-semibold text-gray-800 hover:text-primary-700 line-clamp-1"
                      >
                        {item.productName}
                      </Link>
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

            {/* Tổng tiền */}
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2 text-sm">
              {order.couponCode && (
                <div className="flex justify-between text-xs text-green-700">
                  <span>Mã coupon áp dụng</span>
                  <span className="font-semibold">{order.couponCode}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline font-bold text-base">
                <span className="text-gray-900">Tổng thanh toán:</span>
                <span className="text-primary-700 text-lg">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Cột phải: Dòng thời gian lịch sử trạng thái (OrderTracking) */}
        <div className="lg:col-span-1">
          <Card className="p-5">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
              Lịch sử trạng thái
            </h2>
            <OrderTrackingTimeline trackingList={trackingList} />
          </Card>
        </div>
      </div>

      {/* ConfirmDialog huỷ đơn */}
      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Huỷ đơn hàng này?"
        message={`Bạn có chắc chắn muốn huỷ đơn hàng #${order.orderCode} không? Thao tác này không thể hoàn tác.`}
        confirmLabel="Huỷ đơn hàng"
        isLoading={cancelOrderMutation.isPending}
      />
    </div>
  );
};
export default OrderDetailPage;
