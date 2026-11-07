import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '@/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { PriceTag } from '@/components/common/PriceTag';
import { QuantityStepper } from '@/components/common/QuantityStepper';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/Button';

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  isUpdating?: boolean;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}) => {
  const [localQty, setLocalQty] = useState(item.quantity);

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  // Debounce gửi mutation khi thay đổi số lượng
  useEffect(() => {
    if (localQty === item.quantity) return;

    const timer = setTimeout(() => {
      onUpdateQuantity(item.productId, localQty);
    }, 400);

    return () => clearTimeout(timer);
  }, [localQty, item.productId, item.quantity, onUpdateQuantity]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-100 gap-4">
      {/* Cột thông tin sản phẩm */}
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="h-20 w-20 shrink-0 rounded-md border border-gray-200 overflow-hidden bg-gray-50 block"
        >
          <ImageWithFallback
            src={item.productImage}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${item.productId}`}
            className="text-sm font-semibold text-gray-800 hover:text-primary-700 line-clamp-2"
          >
            {item.productName}
          </Link>

          <div className="mt-1">
            <PriceTag
              price={item.price}
              originalPrice={item.originalPrice}
              discountPercent={item.discountPercent}
              size="sm"
            />
          </div>

          {!item.available && (
            <p className="mt-1 text-xs font-semibold text-red-600">
              Sản phẩm tạm thời không khả dụng hoặc đã hết hàng
            </p>
          )}
        </div>
      </div>

      {/* Cột số lượng + thành tiền + xoá */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        <QuantityStepper
          value={localQty}
          onChange={setLocalQty}
          disabled={isUpdating || !item.available}
          size="sm"
        />

        <div className="text-right min-w-[90px]">
          <p className="text-sm font-bold text-gray-900">{formatCurrency(item.subtotal)}</p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.productId)}
          className="text-gray-400 hover:text-red-600 p-1"
          aria-label="Xoá món"
        >
          Xoá
        </Button>
      </div>
    </div>
  );
};

