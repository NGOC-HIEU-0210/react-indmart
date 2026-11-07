import React from 'react';
import clsx from 'clsx';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có thông tin nào để hiển thị.',
  action,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center p-8 text-center border border-dashed border-gray-200 rounded-lg bg-gray-50/50',
        className
      )}
    >
      <div className="max-w-md">
        <h4 className="text-base font-semibold text-gray-800">{title}</h4>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        {action && <div className="mt-4 flex justify-center">{action}</div>}
      </div>
    </div>
  );
};

