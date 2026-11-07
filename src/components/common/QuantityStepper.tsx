import React from 'react';
import clsx from 'clsx';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  size = 'md',
  className,
}) => {
  const handleDecrement = () => {
    if (disabled || value <= min) return;
    onChange(value - 1);
  };

  const handleIncrement = () => {
    if (disabled || value >= max) return;
    onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    if (rawVal === '') {
      onChange(min);
      return;
    }
    const parsed = parseInt(rawVal, 10);
    if (isNaN(parsed)) return;
    if (parsed < min) onChange(min);
    else if (parsed > max) onChange(max);
    else onChange(parsed);
  };

  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-8 w-8 text-sm',
  };

  const inputSizes = {
    sm: 'h-7 w-10 text-xs',
    md: 'h-8 w-12 text-sm',
  };

  return (
    <div className={clsx('inline-flex items-center rounded border border-gray-300 bg-white', className)}>
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={handleDecrement}
        className={clsx(
          'flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors select-none',
          sizes[size]
        )}
        aria-label="Giảm số lượng"
      >
        -
      </button>

      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        value={value}
        onChange={handleInputChange}
        className={clsx(
          'border-x border-gray-300 text-center font-medium text-gray-800 focus:outline-none focus:ring-0',
          inputSizes[size]
        )}
        aria-label="Số lượng"
      />

      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={handleIncrement}
        className={clsx(
          'flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors select-none',
          sizes[size]
        )}
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  );
};

