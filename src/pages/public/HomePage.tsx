import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRescueProducts, useLatestProducts } from '@/features/products/hooks/useProducts';
import { CategoryCarousel } from '@/features/categories/components/CategoryCarousel';
import { useMyFavourites, useToggleFavourite } from '@/features/favourites/hooks/useFavourites';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

const PAGE_SIZE = 8;

export const HomePage: React.FC = () => {
  // Phân trang cho mục "Sản phẩm mới" (0-based)
  const [page, setPage] = useState(0);
  const latestSectionRef = useRef<HTMLElement>(null);

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
  } = useLatestProducts(page, PAGE_SIZE);

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
  const totalPages = latestData?.data?.totalPages ?? 0;

  const handlePageChange = (next: number) => {
    setPage(next);
    // Cuộn về đầu mục sản phẩm, không đẩy người dùng lên tận banner
    latestSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Banner */}
      <section className="relative overflow-hidden border-b border-primary-100">
        {/* Nền gradient: hiện khi chưa có ảnh banner */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-600" />

        {/* Ảnh banner: đặt file vào public/banner.jpg. Thiếu file thì tự ẩn, chỉ còn nền gradient */}
        <img
          src="/banner.jpg"
          alt="Rau củ tươi sạch IND MART"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Lớp phủ tối bên trái để chữ luôn dễ đọc */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-900/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 min-h-[320px] flex items-center">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/15 text-white rounded-full text-xs font-semibold uppercase tracking-wider mb-3 backdrop-blur-sm">
              Nông sản sạch từ nông trại
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Rau củ tươi ngon, giao nhanh trong ngày
            </h1>
            <p className="mt-3 text-base sm:text-lg text-primary-50 leading-relaxed">
              Cam kết 100% tự nhiên, đạt tiêu chuẩn VietGAP, bảo vệ sức khoẻ cả gia đình bạn với mức giá bình ổn mỗi ngày.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 rounded-md bg-white text-primary-800 font-semibold text-sm hover:bg-primary-50 transition-colors"
              >
                Mua sắm ngay
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center px-6 py-3 rounded-md border border-white/70 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Xem danh mục
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Mục: Danh mục (băng chuyền) */}
        <CategoryCarousel />

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

        {/* Mục: Sản phẩm mới */}
        <section ref={latestSectionRef} className="scroll-mt-20">
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
              skeletonCount={PAGE_SIZE}
            />
          )}

          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              scrollToTop={false}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
export default HomePage;