import React, { useState } from 'react';
import clsx from 'clsx';
import { Search } from 'lucide-react';

export interface SearchBoxProps {
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  onSearch?: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  defaultValue = '',
  onChange,
  onSearch,
  placeholder = 'Tìm kiếm sản phẩm...',
  className,
}) => {
  const [internalVal, setInternalVal] = useState(defaultValue);
  const currentVal = value !== undefined ? value : internalVal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (value === undefined) {
      setInternalVal(val);
    }
    onChange?.(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch?.(currentVal.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(currentVal.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={clsx('relative flex items-center w-full', className)}>
      <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={currentVal}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 transition-colors"
      />
    </form>
  );
};

