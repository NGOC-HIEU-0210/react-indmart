import React from 'react';
import clsx from 'clsx';
import { formatCurrency } from '@/lib/format';

export interface PriceTagProps {
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  discountPercent,
  showBadge = true,
  size = 'md',
  className,
}) => {
  const hasDiscount = (discountPercent && discountPercent > 0) || (originalPrice && originalPrice > price);
  const percent = discountPercent || (originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  const priceSizes = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-bold',
  };

  const origSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={clsx('flex flex-wrap items-baseline gap-2', className)}>
      <span className={clsx('text-primary-700', priceSizes[size])}>
        {formatCurrency(price)}
      </span>

      {hasDiscount && (
        <>
          {originalPrice && originalPrice > price && (
            <span className={clsx('line-through text-gray-400 font-normal', origSizes[size])}>
              {formatCurrency(originalPrice)}
            </span>
          )}

          {showBadge && percent > 0 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-700">
              -{percent}%
            </span>
          )}
        </>
      )}
    </div>
  );
};

