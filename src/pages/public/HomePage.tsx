import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRescueProducts, useLatestProducts } from '@/features/products/hooks/useProducts';
import { useActiveCategories } from '@/features/categories/hooks/useCategories';
import { useMyFavourites, useToggleFavourite } from '@/features/favourites/hooks/useFavourites';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

export const HomePage: React.FC = () => {
  // Lấy sản phẩm giải cứu
  const {
    data: rescueData,
    isLoading: isRescueLoading,
    isError: isRescueError,
    refetch: refetchRescue,
  } = useRescueProducts();

  // Lấy sản phẩm mới nhất
  const {
    data: latestData,
    isLoading: isLatestLoading,
    isError: isLatestError,
    refetch: refetchLatest,
  } = useLatestProducts(0, 8);

  // Lấy danh mục hoạt động
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
  } = useActiveCategories();

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

  const rescueProducts = rescueData?.data || [];
  const latestProducts = latestData?.data?.content || [];
  const categories = categoriesData?.data?.content || [];

  return (
    <div className="space-y-10 pb-16">
      {/* Banner */}
      <section className="bg-primary-50 border-b border-primary-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              Nông sản sạch từ nông trại
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Rau củ tươi ngon, giao nhanh trong ngày
            </h1>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              Cam kết 100% tự nhiên, đạt tiêu chuẩn VietGAP, bảo vệ sức khoẻ cả gia đình bạn với mức giá bình ổn mỗi ngày.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to="/products">
                <Button variant="primary" size="lg" className="px-6">
                  Mua sắm ngay
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="lg" className="px-6">
                  Xem danh mục
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:block w-72 h-72 rounded-2xl bg-primary-100/70 border border-primary-200 flex items-center justify-center p-6 text-center text-primary-800 font-semibold text-lg">
            IND MART
            <br />
            <span className="text-sm font-normal text-primary-600 mt-1">Tươi sạch mỗi ngày</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Mục: Giải cứu hôm nay */}
        {rescueProducts.length > 0 && (
          <section className="bg-amber-50/60 p-6 rounded-xl border border-amber-200/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Giải cứu hôm nay</span>
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 font-semibold rounded">
                    Hàng giảm giá sốc
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Nông sản chất lượng sắp đến ngày dùng tốt nhất, giá tốt nhất
                </p>
              </div>
              <Link
                to="/products"
                className="text-xs font-semibold text-primary-700 hover:text-primary-800 hover:underline"
              >
                Xem tất cả
              </Link>
            </div>

            {isRescueError ? (
              <ErrorState onRetry={() => refetchRescue()} />
            ) : (
              <ProductGrid
                products={rescueProducts}
                isLoading={isRescueLoading}
                favouritesMap={favouritesMap}
                onToggleFavourite={handleToggleFav}
                skeletonCount={4}
              />
            )}
          </section>
        )}

        {/* Mục: Danh mục sản phẩm */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Danh mục nổi bật</h2>
            <Link
              to="/categories"
              className="text-xs font-semibold text-primary-700 hover:text-primary-800 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          {isCategoriesLoading ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-28 bg-gray-200 animate-pulse rounded-md shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?categoryId=${cat.id}`}
                  className="px-4 py-2 rounded-md bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary-500 hover:text-primary-700 hover:bg-primary-50/30 transition-all shadow-none"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Mục: Sản phẩm mới */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Sản phẩm mới</h2>
              <p className="text-xs text-gray-500">Mới thu hoạch và cập nhật gần đây</p>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-primary-700 hover:text-primary-800 hover:underline"
            >
              Xem thêm
            </Link>
          </div>

          {isLatestError ? (
            <ErrorState onRetry={() => refetchLatest()} />
          ) : (
            <ProductGrid
              products={latestProducts}
              isLoading={isLatestLoading}
              favouritesMap={favouritesMap}
              onToggleFavourite={handleToggleFav}
              skeletonCount={8}
            />
          )}

          <div className="mt-8 flex justify-center">
            <Link to="/products">
              <Button variant="outline" size="md">
                Xem thêm sản phẩm khác
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
export default HomePage;
