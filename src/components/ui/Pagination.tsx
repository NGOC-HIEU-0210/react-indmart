import React from 'react';
import clsx from 'clsx';

export interface PaginationProps {
  currentPage: number; // 0-based
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  scrollToTop?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  scrollToTop = true,
}) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page < 0 || page >= totalPages || page === currentPage) return;
    onPageChange(page);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Tạo mảng số trang với ellipsis
  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 ||
        i === totalPages - 1 ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className={clsx('flex items-center justify-center gap-1.5 py-4 select-none', className)}>
      <button
        type="button"
        disabled={currentPage === 0}
        onClick={() => handlePageClick(currentPage - 1)}
        className="px-3 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Trước
      </button>

      {getPages().map((p, idx) => {
        if (typeof p === 'string') {
          return (
            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-gray-400">
              ...
            </span>
          );
        }

        const isActive = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => handlePageClick(p)}
            className={clsx(
              'min-w-[32px] h-8 px-2 rounded text-xs font-medium border transition-colors',
              isActive
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            )}
          >
            {p + 1}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages - 1}
        onClick={() => handlePageClick(currentPage + 1)}
        className="px-3 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Sau
      </button>
    </div>
  );
};

