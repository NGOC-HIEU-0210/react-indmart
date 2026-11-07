import React, { useState } from 'react';
import clsx from 'clsx';
import { ProductImage } from '@/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export interface ProductGalleryProps {
  primaryImage?: string;
  images?: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  primaryImage,
  images = [],
  productName,
}) => {
  // Gom ảnh chính và danh sách ảnh phụ
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (primaryImage) list.push(primaryImage);
    images.forEach((img) => {
      if (img.url && !list.includes(img.url)) {
        list.push(img.url);
      }
    });
    return list;
  }, [primaryImage, images]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentSrc = allImages[selectedIndex] || primaryImage;

  return (
    <div className="flex flex-col gap-3">
      {/* Ảnh lớn */}
      <div className="relative aspect-square w-full rounded-lg border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
        <ImageWithFallback
          src={currentSrc}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Danh sách ảnh nhỏ thumbnail */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((imgUrl, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={clsx(
                  'relative h-16 w-16 shrink-0 rounded-md border-2 overflow-hidden bg-white transition-all',
                  isSelected ? 'border-primary-600 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                )}
                aria-label={`Xem ảnh ${idx + 1}`}
              >
                <ImageWithFallback
                  src={imgUrl}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

