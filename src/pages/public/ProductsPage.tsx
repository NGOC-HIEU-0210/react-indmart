import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchProducts } from '@/features/products/hooks/useProducts';
import { useActiveCategories } from '@/features/categories/hooks/useCategories';
import { useMyFavourites, useToggleFavourite } from '@/features/favourites/hooks/useFavourites';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ProductFilters } from '@/features/products/components/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || undefined;
  const categoryIdParam = searchParams.get('categoryId');
  const categoryId = categoryIdParam ? parseInt(categoryIdParam, 10) : undefined;
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Math.max(0, parseInt(pageParam, 10)) : 0;
  const pageSize = 12;

  // Lấy dữ liệu sản phẩm
  const { data, isLoading, isError, refetch } = useSearchProducts({
    keyword,
    categoryId,
    page: currentPage,
    size: pageSize,
  });

  // Lấy danh mục để hiển thị bộ lọc
  const { data: categoriesData } = useActiveCategories();
  const categories = categoriesData?.data?.content || [];

  // Yêu thích
  const { data: favouritesData } = useMyFavourites();
  const toggleFavMutation = useToggleFavourite();

  const favouritesMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    favouritesData?.data?.forEach((f) => {
      map[f.productId] = true;
    });
    return map;
  }, [favouritesData]);

  const handleToggleFav = (productId: number) => {
    toggleFavMutation.mutate(productId);
  };

  const handleSelectCategory = (newCatId?: number) => {
    const next = new URLSearchParams(searchParams);
    if (newCatId) {
      next.set('categoryId', newCatId.toString());
    } else {
      next.delete('categoryId');
    }
    next.set('page', '0'); // reset về trang đầu
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    const next = new URLSearchParams();
    if (keyword) next.set('keyword', keyword);
    setSearchParams(next);
  };

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
  };

  const pageResult = data?.data;
  const products = pageResult?.content || [];
  const totalElements = pageResult?.totalElements ?? 0;
  const totalPages = pageResult?.totalPages ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tiêu đề & kết quả */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <nav className="text-xs text-gray-400 mb-1">
            <span>Trang chủ</span> / <span className="text-gray-700 font-medium">Sản phẩm</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">
            {keyword ? (
              <>
                Kết quả cho &ldquo;<span className="text-primary-700">{keyword}</span>&rdquo;
              </>
            ) : (
              'Tất cả sản phẩm'
            )}
          </h1>
        </div>
        <p className="text-xs text-gray-500">
          Tìm thấy <span className="font-semibold text-gray-800">{totalElements}</span> sản phẩm
        </p>
      </div>

      {/* Grid bố cục 2 cột: Bộ lọc + Danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Cột trái: Bộ lọc */}
        <div className="md:col-span-1">
          <ProductFilters
            categories={categories}
            selectedCategoryId={categoryId}
            onSelectCategory={handleSelectCategory}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Cột phải: Lưới sản phẩm & Phân trang */}
        <div className="md:col-span-3 space-y-6">
          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <>
              <ProductGrid
                products={products}
                isLoading={isLoading}
                favouritesMap={favouritesMap}
                onToggleFavourite={handleToggleFav}
                emptyTitle="Không tìm thấy sản phẩm phù hợp"
                emptyDescription="Hãy thử tìm kiếm với từ khoá khác hoặc xoá bộ lọc đang áp dụng."
                emptyAction={
                  (categoryId || keyword) ? (
                    <Button variant="outline" size="sm" onClick={handleClearFilters}>
                      Xoá bộ lọc
                    </Button>
                  ) : undefined
                }
              />

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductsPage;
