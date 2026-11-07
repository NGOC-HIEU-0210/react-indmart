import React, { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export interface CartSummaryProps {
  subtotal: number;
  discountAmount?: number;
  appliedCouponCode?: string;
  onApplyCoupon?: (code: string) => Promise<boolean>;
  onRemoveCoupon?: () => void;
  onCheckout: () => void;
  hasUnavailableItems?: boolean;
  isLoadingCheckout?: boolean;
  isApplyingCoupon?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discountAmount = 0,
  appliedCouponCode,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
  hasUnavailableItems = false,
  isLoadingCheckout = false,
  isApplyingCoupon = false,
}) => {
  const [couponInput, setCouponInput] = useState('');

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim() || !onApplyCoupon) return;
    const ok = await onApplyCoupon(couponInput.trim().toUpperCase());
    if (ok) setCouponInput('');
  };

  return (
    <Card className="p-5">
      <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
        Tóm tắt đơn hàng
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
        </div>

        {/* Mã giảm giá input */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Mã giảm giá</label>
          {appliedCouponCode ? (
            <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
              <span className="font-semibold">Mã: {appliedCouponCode}</span>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-red-600 hover:underline font-medium"
              >
                Gỡ bỏ
              </button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã..."
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-xs uppercase focus:outline-none focus:border-primary-600"
              />
              <Button
                type="submit"
                variant="outline"
                size="sm"
                isLoading={isApplyingCoupon}
                disabled={!couponInput.trim()}
              >
                Áp dụng
              </Button>
            </form>
          )}
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Giảm giá</span>
            <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-base font-bold text-gray-900">
          <span>Tổng cộng</span>
          <span className="text-lg text-primary-700">{formatCurrency(finalTotal)}</span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onCheckout}
          isLoading={isLoadingCheckout}
          disabled={subtotal <= 0 || hasUnavailableItems}
          className="w-full uppercase font-bold tracking-wider"
        >
          Tiến hành đặt hàng
        </Button>
        {hasUnavailableItems && (
          <p className="mt-2 text-xs text-red-600 text-center">
            Vui lòng xoá các món hết hàng khỏi giỏ trước khi đặt hàng.
          </p>
        )}
      </div>
    </Card>
  );
};

