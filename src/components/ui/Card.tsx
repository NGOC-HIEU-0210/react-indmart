import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, header, footer, children, ...props }) => {
  return (
    <div
      className={clsx('bg-white border border-gray-200 rounded-lg overflow-hidden', className)}
      {...props}
    >
      {header && <div className="border-b border-gray-100 px-5 py-3.5 bg-gray-50/50">{header}</div>}
      <div className="p-5">{children}</div>
      {footer && <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/50">{footer}</div>}
    </div>
  );
};

