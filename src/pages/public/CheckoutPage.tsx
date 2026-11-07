import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '@/features/orders/schemas';
import { useCheckoutCart, useCheckoutDirect } from '@/features/orders/hooks/useOrders';
import { useCart } from '@/features/cart/hooks/useCart';
import { useMyProfile } from '@/features/profile/hooks/useProfile';
import { formatCurrency } from '@/lib/format';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Product } from '@/types';

export const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra nếu là mua ngay từ ProductDetailPage
  const buyNowItem = (location.state as { buyNowItem?: { product: Product; quantity: number } })?.buyNowItem;
  const passedCouponCode = (location.state as { appliedCouponCode?: string })?.appliedCouponCode;
  const passedDiscount = (location.state as { discountAmount?: number })?.discountAmount || 0;

  // Lấy dữ liệu giỏ hàng (nếu không phải mua ngay)
  const { data: cartData, isLoading: isCartLoading } = useCart();
  const { data: profileData } = useMyProfile();

  const checkoutCartMutation = useCheckoutCart();
  const checkoutDirectMutation = useCheckoutDirect();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      phone: '',
      email: '',
      address: '',
      note: '',
      paymentMethod: 'COD',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  // Điền sẵn từ profile người dùng
  useEffect(() => {
    if (profileData?.data) {
      const user = profileData.data;
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || '';
      if (fullName) setValue('customerName', fullName);
      if (user.mobile) setValue('phone', user.mobile);
      if (user.email) setValue('email', user.email);
      if (user.address) setValue('address', user.address);
    }
  }, [profileData, setValue]);

  const cart = cartData?.data;
  const isDirect = Boolean(buyNowItem);

  // Tính toán các món và tiền
  const orderItems = isDirect
    ? [
        {
          productId: buyNowItem!.product.id,
          productName: buyNowItem!.product.name,
          quantity: buyNowItem!.quantity,
          price: buyNowItem!.product.currentPrice ?? buyNowItem!.product.price,
          subtotal: (buyNowItem!.product.currentPrice ?? buyNowItem!.product.price) * buyNowItem!.quantity,
        },
      ]
    : cart?.items || [];

  const subtotal = isDirect
    ? orderItems[0]?.subtotal || 0
    : cart?.subtotal || 0;

  const totalAmount = Math.max(0, subtotal - passedDiscount);

  if (!isDirect && isCartLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Đang chuẩn bị trang thanh toán..." />
      </div>
    );
  }

  if (!isDirect && orderItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Bạn chưa có sản phẩm nào trong giỏ để đặt hàng.</p>
        <Link to="/products">
          <Button variant="primary" size="md">Đi mua sắm</Button>
        </Link>
      </div>
    );
  }

  const isSubmitting = checkoutCartMutation.isPending || checkoutDirectMutation.isPending;

  const onSubmit = async (values: CheckoutFormData) => {
    try {
      if (isDirect) {
        // Mua ngay
        const res = await checkoutDirectMutation.mutateAsync({
          customerName: values.customerName,
          phone: values.phone,
          email: values.email,
          address: values.address,
          note: values.note,
          couponCode: passedCouponCode,
          paymentMethod: values.paymentMethod,
          items: [
            {
              productId: buyNowItem!.product.id,
              quantity: buyNowItem!.quantity,
            },
          ],
        });
        if (res?.data?.orderCode) {
          navigate(`/checkout/success/${res.data.orderCode}`);
        }
      } else {
        // Đặt từ giỏ hàng
        const res = await checkoutCartMutation.mutateAsync({
          customerName: values.customerName,
          phone: values.phone,
          email: values.email,
          address: values.address,
          note: values.note,
          couponCode: passedCouponCode,
          paymentMethod: values.paymentMethod,
        });
        if (res?.data?.orderCode) {
          navigate(`/checkout/success/${res.data.orderCode}`);
        }
      }
    } catch {
      // Đã có toast thông báo lỗi trong axios/hook
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Thông tin đặt hàng</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Form thông tin người nhận & thanh toán */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Thông tin người nhận
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Họ và tên"
                    required
                    placeholder="Nguyễn Văn A"
                    error={errors.customerName?.message}
                    {...register('customerName')}
                  />
                </div>

                <div>
                  <Input
                    label="Số điện thoại"
                    required
                    placeholder="0912345678"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Email"
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Địa chỉ giao hàng"
                    required
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    error={errors.address?.message}
                    {...register('address')}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Textarea
                    label="Ghi chú đơn hàng"
                    placeholder="Lưu ý khi giao hàng (tuỳ chọn)..."
                    error={errors.note?.message}
                    {...register('note')}
                  />
                </div>
              </div>
            </Card>

            {/* Phương thức thanh toán */}
            <Card className="p-6">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="COD"
                    checked={selectedPaymentMethod === 'COD'}
                    {...register('paymentMethod')}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận được nông sản.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="BANK_TRANSFER"
                    checked={selectedPaymentMethod === 'BANK_TRANSFER'}
                    {...register('paymentMethod')}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Chuyển khoản ngân hàng
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Chuyển khoản qua mã QR/tài khoản ngân hàng của IND MART sau khi đặt đơn.
                    </p>
                  </div>
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="mt-2 text-xs text-red-600">{errors.paymentMethod.message}</p>
              )}
            </Card>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <Card className="p-5 sticky top-20">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Đơn hàng của bạn ({orderItems.length} sản phẩm)
              </h2>

              {/* Danh sách món rút gọn */}
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto mb-4 pr-1">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                    <div className="flex-1 pr-2">
                      <p className="font-semibold text-gray-800 line-clamp-1">{item.productName}</p>
                      <p className="text-gray-400">Số lượng: x{item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              {/* Chi tiết tiền */}
              <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>

                {passedDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>
                      Giảm giá {passedCouponCode ? `(${passedCouponCode})` : ''}
                    </span>
                    <span className="font-semibold">-{formatCurrency(passedDiscount)}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline font-bold">
                  <span className="text-base text-gray-900">Tổng cộng</span>
                  <span className="text-lg text-primary-700">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full uppercase font-bold tracking-wider"
                >
                  Xác nhận đặt hàng
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
export default CheckoutPage;
