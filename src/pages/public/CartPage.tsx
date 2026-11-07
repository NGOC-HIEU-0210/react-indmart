import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveCartItem,
  useClearCart,
} from '@/features/cart/hooks/useCart';
import { useApplyCoupon } from '@/features/coupons/hooks/useCoupons';
import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useCart();
  const updateQtyMutation = useUpdateCartQuantity();
  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();
  const applyCouponMutation = useApplyCoupon();

  // State cho Coupon
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | undefined>(undefined);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Dialog xác nhận xoá toàn bộ giỏ
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Dialog xác nhận xoá 1 món
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const cart = data?.data;
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const hasUnavailableItems = items.some((it) => !it.available);

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    updateQtyMutation.mutate({ productId, quantity });
  };

  const handleConfirmRemove = () => {
    if (itemToRemove !== null) {
      removeMutation.mutate(itemToRemove, {
        onSuccess: () => setItemToRemove(null),
      });
    }
  };

  const handleConfirmClear = () => {
    clearMutation.mutate(undefined, {
      onSuccess: () => {
        setIsClearConfirmOpen(false);
        setAppliedCouponCode(undefined);
        setDiscountAmount(0);
      },
    });
  };

  const handleApplyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await applyCouponMutation.mutateAsync({
        code,
        orderTotal: subtotal,
      });
      if (res?.success && typeof res.data === 'number') {
        setAppliedCouponCode(code);
        setDiscountAmount(res.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCouponCode(undefined);
    setDiscountAmount(0);
  };

  const handleProceedCheckout = () => {
    navigate('/checkout', {
      state: {
        appliedCouponCode,
        discountAmount,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Đang tải giỏ hàng..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Giỏ hàng đang trống"
          description="Bạn chưa chọn sản phẩm nào. Hãy khám phá rau củ quả tươi sạch của IND MART nhé!"
          action={
            <Link to="/products">
              <Button variant="primary" size="md">
                Đi mua sắm
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tiêu đề & Xoá tất cả */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Giỏ hàng ({cart?.totalQuantity ?? items.length} sản phẩm)
        </h1>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsClearConfirmOpen(true)}
          disabled={clearMutation.isPending}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Xoá tất cả
        </Button>
      </div>

      {/* Grid: Danh sách sản phẩm + Tóm tắt */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Danh sách món */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 divide-y divide-gray-100">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={(pId) => setItemToRemove(pId)}
              isUpdating={updateQtyMutation.isPending}
            />
          ))}
        </div>

        {/* Tóm tắt đơn hàng bên phải */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            discountAmount={discountAmount}
            appliedCouponCode={appliedCouponCode}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            onCheckout={handleProceedCheckout}
            hasUnavailableItems={hasUnavailableItems}
            isApplyingCoupon={applyCouponMutation.isPending}
          />
        </div>
      </div>

      {/* ConfirmDialog xoá tất cả */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        title="Xoá toàn bộ giỏ hàng?"
        message="Bạn có chắc chắn muốn xoá tất cả các món trong giỏ hàng không? Thao tác này không thể hoàn tác."
        confirmLabel="Xoá hết"
        isLoading={clearMutation.isPending}
      />

      {/* ConfirmDialog xoá 1 món */}
      <ConfirmDialog
        isOpen={itemToRemove !== null}
        onClose={() => setItemToRemove(null)}
        onConfirm={handleConfirmRemove}
        title="Xoá món khỏi giỏ?"
        message="Bạn có chắc chắn muốn bỏ sản phẩm này khỏi giỏ hàng không?"
        confirmLabel="Xoá"
        isLoading={removeMutation.isPending}
      />
    </div>
  );
};
export default CartPage;
