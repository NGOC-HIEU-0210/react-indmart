import React from 'react';
import clsx from 'clsx';
import { Category } from '@/types';
import { Button } from '@/components/ui/Button';

export interface ProductFiltersProps {
  categories: Category[];
  selectedCategoryId?: number;
  onSelectCategory: (categoryId?: number) => void;
  onClearFilters: () => void;
  className?: string;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onClearFilters,
  className,
}) => {
  return (
    <div className={clsx('bg-white p-4 rounded-lg border border-gray-200', className)}>
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Bộ lọc</h3>
        {selectedCategoryId && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-primary-700 hover:text-primary-800 p-0 h-auto"
          >
            Xoá bộ lọc
          </Button>
        )}
      </div>

      {/* Danh mục */}
      <div className="mt-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Danh mục</h4>
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none py-1 px-1.5 rounded hover:bg-gray-50">
            <input
              type="radio"
              name="category"
              checked={!selectedCategoryId}
              onChange={() => onSelectCategory(undefined)}
              className="text-primary-600 focus:ring-primary-500 h-4 w-4"
            />
            <span className={!selectedCategoryId ? 'font-semibold text-primary-700' : 'text-gray-700'}>
              Tất cả sản phẩm
            </span>
          </label>

          {categories.map((cat) => {
            const isChecked = selectedCategoryId === cat.id;
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2 text-sm cursor-pointer select-none py-1 px-1.5 rounded hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="category"
                  checked={isChecked}
                  onChange={() => onSelectCategory(cat.id)}
                  className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <span className={isChecked ? 'font-semibold text-primary-700' : 'text-gray-700'}>
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

