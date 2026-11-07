import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { useProductDetail } from '@/features/products/hooks/useProducts';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { useCheckFavourite, useToggleFavourite, useFavouriteCount } from '@/features/favourites/hooks/useFavourites';
import { useAuth } from '@/app/providers/AuthContext';
import { ProductGallery } from '@/features/products/components/ProductGallery';
import { PriceTag } from '@/components/common/PriceTag';
import { QuantityStepper } from '@/components/common/QuantityStepper';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatDate } from '@/lib/format';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const [quantity, setQuantity] = useState(1);

  // Lấy chi tiết sản phẩm
  const { data, isLoading, isError, refetch } = useProductDetail(productId);
  const product = data?.data;

  // Giỏ hàng
  const addToCartMutation = useAddToCart();

  // Yêu thích
  const { data: isFavData } = useCheckFavourite(productId);
  const { data: countFavData } = useFavouriteCount(productId);
  const toggleFavMutation = useToggleFavourite();

  const isFavourite = !!isFavData?.data;
  const favouriteCount = countFavData?.data ?? product?.favouriteCount ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Không tìm thấy sản phẩm"
          message="Sản phẩm này có thể đã bị ngừng bán hoặc không tồn tại."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const currentPrice = product.currentPrice ?? product.price;
  const originalPrice = product.currentPrice !== undefined && product.currentPrice < product.price ? product.price : undefined;
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    addToCartMutation.mutate({ productId: product.id, quantity });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      login();
      return;
    }
    // Chuyển thẳng tới trang checkout với state mua ngay
    navigate('/checkout', {
      state: {
        buyNowItem: {
          product,
          quantity,
        },
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-primary-700">Trang chủ</Link>
        <span>/</span>
        {product.categoryId && (
          <>
            <Link to={`/products?categoryId=${product.categoryId}`} className="hover:text-primary-700">
              {product.categoryName || 'Danh mục'}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main product box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 rounded-xl border border-gray-200">
        {/* Thư viện ảnh */}
        <div>
          <ProductGallery
            primaryImage={product.image}
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex flex-col space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>
            {product.categoryName && (
              <p className="text-xs text-gray-500 mt-1">Danh mục: {product.categoryName}</p>
            )}
          </div>

          {/* Giá */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <PriceTag
              price={currentPrice}
              originalPrice={originalPrice}
              discountPercent={product.discountPercent}
              size="lg"
            />
          </div>

          {/* Hạn sử dụng & tồn kho */}
          <div className="space-y-2 text-sm text-gray-600">
            {product.nearestExpiry && (
              <p>
                <span className="font-medium text-gray-800">Hạn dùng:</span>{' '}
                {product.daysLeft !== undefined && (
                  <span className="text-amber-600 font-semibold mr-1">
                    Còn {product.daysLeft} ngày
                  </span>
                )}
                (đến {formatDate(product.nearestExpiry)})
              </p>
            )}

            <div className="flex items-center gap-4 text-xs">
              <span>
                Tồn kho:{' '}
                <strong className={isOutOfStock ? 'text-red-600' : 'text-gray-800'}>
                  {isOutOfStock ? 'Hết hàng' : `${product.stock ?? 0} sản phẩm`}
                </strong>
              </span>
              <span>•</span>
              <span className="text-gray-500">
                {favouriteCount} lượt yêu thích
              </span>
            </div>
          </div>

          {/* Chọn số lượng */}
          {!isOutOfStock && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Số lượng:</span>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={product.stock || 999}
              />
            </div>
          )}

          {/* Nút hành động */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {isOutOfStock ? (
              <Button variant="secondary" size="lg" disabled className="w-full sm:w-auto">
                Hết hàng
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  isLoading={addToCartMutation.isPending}
                  className="flex-1 min-w-[140px]"
                >
                  Thêm vào giỏ
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[140px]"
                >
                  Mua ngay
                </Button>
              </>
            )}

            {/* Nút tim yêu thích */}
            <button
              type="button"
              onClick={() => toggleFavMutation.mutate(product.id)}
              className={clsx(
                'p-2.5 rounded-md border transition-colors',
                isFavourite
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              )}
              aria-label={isFavourite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              title={isFavourite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            >
              <Heart className={clsx('h-5 w-5', isFavourite && 'fill-current')} />
            </button>
          </div>

          {/* Mô tả sản phẩm */}
          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-2">Mô tả sản phẩm</h2>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;
