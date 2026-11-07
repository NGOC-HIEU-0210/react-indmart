import React from 'react';
import clsx from 'clsx';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className, label }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-7 w-7 border-2',
    lg: 'h-10 w-10 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <div
        className={clsx(
          'animate-spin rounded-full border-primary-600 border-t-transparent',
          sizes[size],
          className
        )}
      />
      {label && <p className="text-xs text-gray-500">{label}</p>}
    </div>
  );
};

