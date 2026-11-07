import React from 'react';
import { Link } from 'react-router-dom';
import { useMyFavourites, useToggleFavourite } from '@/features/favourites/hooks/useFavourites';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { formatCurrency } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const FavouritesPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useMyFavourites();
  const toggleFavMutation = useToggleFavourite();

  const favourites = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spinner size="md" label="Đang tải danh sách yêu thích..." />
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
          Sản phẩm yêu thích ({favourites.length})
        </h2>
      </div>

      {favourites.length === 0 ? (
        <EmptyState
          title="Chưa có sản phẩm yêu thích"
          description="Bạn chưa lưu sản phẩm nào vào danh sách yêu thích. Hãy khám phá rau củ tươi của IND MART nhé!"
          action={
            <Link to="/products">
              <Button variant="primary" size="sm">
                Khám phá sản phẩm
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favourites.map((fav) => (
            <div
              key={fav.id}
              className="group flex flex-col rounded-lg border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors"
            >
              <Link
                to={`/products/${fav.productId}`}
                className="relative block aspect-square w-full overflow-hidden bg-gray-50"
              >
                <ImageWithFallback
                  src={fav.productImage}
                  alt={fav.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </Link>

              <div className="p-3 flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    to={`/products/${fav.productId}`}
                    className="text-sm font-semibold text-gray-800 hover:text-primary-700 line-clamp-2"
                  >
                    {fav.productName}
                  </Link>
                  <p className="text-sm font-bold text-primary-700 mt-1">
                    {formatCurrency(fav.productPrice)}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200"
                    onClick={() => toggleFavMutation.mutate(fav.productId)}
                    isLoading={toggleFavMutation.isPending}
                  >
                    Bỏ yêu thích
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
export default FavouritesPage;
