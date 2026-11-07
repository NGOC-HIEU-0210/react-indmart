import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderByCode } from '@/features/orders/hooks/useOrders';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';

export const CheckoutSuccessPage: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const { data, isLoading } = useOrderByCode(orderCode);

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Đang kiểm tra thông tin đơn hàng..." />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <Card className="p-8">
        {/* Biểu tượng dấu tích xanh tối giản bằng SVG */}
        <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Đặt hàng thành công!</h1>
        <p className="text-sm text-gray-600 mt-2">
          Cảm ơn bạn đã tin tưởng mua sắm tại IND MART. Đơn hàng của bạn đang được tiếp nhận và xử lý.
        </p>

        {/* Thông tin vắn tắt của đơn hàng */}
        <div className="my-6 p-4 bg-gray-50 rounded-lg text-sm text-left space-y-2 border border-gray-100">
          <div className="flex justify-between">
            <span className="text-gray-500">Mã đơn hàng:</span>
            <span className="font-bold text-primary-700">{orderCode}</span>
          </div>

          {order && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-500">Người nhận:</span>
                <span className="font-semibold text-gray-800">{order.customerName} ({order.phone})</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Phương thức thanh toán:</span>
                <span className="font-semibold text-gray-800">
                  {order.paymentMethod === 'COD' ? 'Khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
                <span className="text-gray-700">Tổng thanh toán:</span>
                <span className="text-base text-primary-700">{formatCurrency(order.total)}</span>
              </div>
            </>
          )}
        </div>

        {/* Nút điều hướng */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {order?.id ? (
            <Link to={`/account/orders/${order.id}`}>
              <Button variant="primary" size="md">
                Xem đơn hàng
              </Button>
            </Link>
          ) : (
            <Link to="/account/orders">
              <Button variant="primary" size="md">
                Danh sách đơn hàng
              </Button>
            </Link>
          )}

          <Link to="/products">
            <Button variant="outline" size="md">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
export default CheckoutSuccessPage;
