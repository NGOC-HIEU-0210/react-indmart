import React from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export interface ProductGridProps {
  products?: Product[];
  isLoading?: boolean;
  isError?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  favouritesMap?: Record<number, boolean>;
  onToggleFavourite?: (productId: number) => void;
  skeletonCount?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  emptyTitle = 'Không tìm thấy sản phẩm',
  emptyDescription = 'Hiện tại chưa có sản phẩm nào trong danh mục này.',
  emptyAction,
  favouritesMap = {},
  onToggleFavourite,
  skeletonCount = 8,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div key={idx} className="flex flex-col rounded-lg border border-gray-200 bg-white p-3 space-y-2">
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavourite={!!favouritesMap[product.id]}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
};

