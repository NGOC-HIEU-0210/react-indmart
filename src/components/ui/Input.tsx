import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helper?: string;
  label?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helper, label, id, leftAddon, rightAddon, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">{leftAddon}</div>}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'w-full rounded-md border text-sm transition-colors focus:outline-none focus:ring-1',
              leftAddon ? 'pl-9' : 'px-3',
              rightAddon ? 'pr-9' : 'px-3',
              'py-2',
              error
                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
                : 'border-gray-300 text-gray-900 focus:border-primary-600 focus:ring-primary-600 bg-white',
              props.disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200',
              className
            )}
            {...props}
          />
          {rightAddon && <div className="absolute right-3 flex items-center">{rightAddon}</div>}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        ) : helper ? (
          <p className="mt-1 text-xs text-gray-500">{helper}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
