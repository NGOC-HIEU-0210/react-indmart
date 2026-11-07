import React from 'react';
import clsx from 'clsx';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            className={clsx(
              'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer',
              props.disabled && 'cursor-not-allowed opacity-60',
              className
            )}
            {...props}
          />
          {label && <span className="text-sm text-gray-700">{label}</span>}
        </label>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

