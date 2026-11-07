import React from 'react';
import clsx from 'clsx';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Đã có lỗi xảy ra',
  message,
  onRetry,
  className,
}) => {
  const displayMessage = !navigator.onLine
    ? 'Không có kết nối mạng. Vui lòng kiểm tra lại đường truyền của bạn.'
    : message || 'Không thể tải được dữ liệu. Vui lòng thử lại sau.';

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-8 text-center border border-red-200 bg-red-50/30 rounded-lg',
        className
      )}
    >
      <div className="max-w-md">
        <h4 className="text-base font-semibold text-red-800">{title}</h4>
        <p className="mt-1 text-sm text-red-600">{displayMessage}</p>
        {onRetry && (
          <div className="mt-4 flex justify-center">
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Thử lại
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

