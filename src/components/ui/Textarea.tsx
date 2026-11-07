import React from 'react';
import clsx from 'clsx';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, id, rows = 3, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={clsx(
            'w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1',
            error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 bg-red-50/20'
              : 'border-gray-300 text-gray-900 focus:border-primary-600 focus:ring-primary-600 bg-white',
            props.disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

