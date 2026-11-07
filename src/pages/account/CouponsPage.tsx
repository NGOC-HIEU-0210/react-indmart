import React from 'react';
import toast from 'react-hot-toast';
import { useActiveCoupons } from '@/features/coupons/hooks/useCoupons';
import { formatCurrency, formatDate } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const CouponsPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useActiveCoupons();

  const coupons = data?.data || [];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã ${code}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spinner size="md" label="Đang tải danh sách mã giảm giá..." />
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Mã giảm giá đang hoạt động ({coupons.length})
        </h2>
      </div>

      {coupons.length === 0 ? (
        <EmptyState
          title="Chưa có mã giảm giá"
          description="Hiện tại không có mã giảm giá nào đang áp dụng. Hãy quay lại sau bạn nhé!"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((coupon) => {
            const isPercent = coupon.discountType === 'PERCENT';
            const discountLabel = isPercent
              ? `Giảm ${coupon.discountValue}%`
              : `Giảm ${formatCurrency(coupon.discountValue)}`;

            return (
              <div
                key={coupon.id}
                className="flex flex-col justify-between p-4 rounded-lg border-2 border-dashed border-primary-200 bg-primary-50/20 hover:border-primary-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-base font-bold text-primary-800 bg-white px-2 py-0.5 rounded border border-primary-200">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-800">
                      {discountLabel}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-800">{coupon.name}</h3>
                  {coupon.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{coupon.description}</p>
                  )}

                  <div className="mt-3 space-y-1 text-xs text-gray-500 border-t border-gray-100 pt-2">
                    {coupon.minOrderValue !== undefined && coupon.minOrderValue > 0 && (
                      <p>Đơn tối thiểu: <strong>{formatCurrency(coupon.minOrderValue)}</strong></p>
                    )}
                    {coupon.maxDiscount !== undefined && coupon.maxDiscount > 0 && isPercent && (
                      <p>Giảm tối đa: <strong>{formatCurrency(coupon.maxDiscount)}</strong></p>
                    )}
                    {coupon.endDate && (
                      <p>Hạn sử dụng: <strong>{formatDate(coupon.endDate)}</strong></p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold"
                    onClick={() => handleCopyCode(coupon.code)}
                  >
                    Sao chép mã
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
export default CouponsPage;
