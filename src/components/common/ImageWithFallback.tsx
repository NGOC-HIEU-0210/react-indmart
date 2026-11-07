import React, { useState } from 'react';
import clsx from 'clsx';
import { imageUrl, FALLBACK_IMAGE } from '@/lib/imageUrl';

export interface ImageWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  alt = 'Hình ảnh sản phẩm',
  className,
  ...props
}) => {
  const [error, setError] = useState(false);

  const finalSrc = error || !src ? fallbackSrc : imageUrl(src);

  return (
    <img
      src={finalSrc}
      alt={alt}
      onError={() => setError(true)}
      className={clsx('object-cover', className)}
      loading="lazy"
      {...props}
    />
  );
};
