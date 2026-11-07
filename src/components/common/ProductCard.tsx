import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { ImageWithFallback } from './ImageWithFallback';
import { PriceTag } from './PriceTag';

export interface ProductCardProps {
  product: Product;
  isFavourite?: boolean;
  onToggleFavourite?: (productId: number) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavourite = false,
  onToggleFavourite,
  className,
}) => {
  const currentPrice = product.currentPrice ?? product.price;
  const originalPrice = product.currentPrice !== undefined && product.currentPrice < product.price ? product.price : undefined;
  const discountPercent = product.discountPercent ?? (originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavourite?.(product.id);
  };

  return (
    <div
      className={clsx(
        'group relative flex flex-col rounded-lg border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors',
        className
      )}
    >
      {/* Khung ảnh vuông */}
      <Link to={`/products/${product.id}`} className="relative block aspect-square w-full overflow-hidden bg-gray-50">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />

        {/* Nhãn phần trăm giảm giá */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white">
            -{discountPercent}%
          </span>
        )}

        {/* Nút yêu thích */}
        <button
          type="button"
          onClick={handleHeartClick}
          aria-label={isFavourite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          className={clsx(
            'absolute top-2 right-2 rounded-full p-1.5 transition-colors bg-white/90 hover:bg-white shadow-sm',
            isFavourite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
          )}
        >
          <Heart className={clsx('h-4 w-4', isFavourite && 'fill-current')} />
        </button>

        {/* Hết hàng badge */}
        {product.stock !== undefined && product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded">
              Hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Thông tin sản phẩm */}
      <div className="flex flex-1 flex-col p-3">
        {/* Hạn dùng (cho mục giải cứu hoặc thông tin lô) */}
        {product.daysLeft !== undefined && product.daysLeft >= 0 && (
          <span className="text-[11px] font-medium text-amber-600 mb-1">
            Còn {product.daysLeft} ngày
          </span>
        )}

        <Link
          to={`/products/${product.id}`}
          className="text-sm font-medium text-gray-800 hover:text-primary-600 line-clamp-2 leading-snug mb-2"
          title={product.name}
        >
          {product.name}
        </Link>

        <div className="mt-auto">
          <PriceTag
            price={currentPrice}
            originalPrice={originalPrice}
            discountPercent={discountPercent}
            showBadge={false}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

