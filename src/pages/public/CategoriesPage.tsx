import React from 'react';
import { Link } from 'react-router-dom';
import { useActiveCategories } from '@/features/categories/hooks/useCategories';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';

export const CategoriesPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useActiveCategories();

  const categories = data?.data?.content || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Danh mục sản phẩm"
        description="Khám phá các loại rau, củ, quả và nông sản tươi sạch theo từng danh mục."
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Danh mục' },
        ]}
      />

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg bg-white space-y-3">
              <Skeleton className="aspect-square w-full rounded" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : categories.length === 0 ? (
        <EmptyState title="Không có danh mục nào" description="Hiện tại chưa có danh mục sản phẩm nào." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 bg-white hover:border-primary-500 hover:shadow-sm transition-all text-center"
            >
              <div className="aspect-square w-24 h-24 rounded-full overflow-hidden bg-gray-50 mb-3 group-hover:scale-105 transition-transform">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 line-clamp-1">
                {cat.name}
              </h3>
              {cat.parentCategoryName && (
                <span className="text-[11px] text-gray-400 mt-0.5">{cat.parentCategoryName}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default CategoriesPage;
