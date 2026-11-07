import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary-700 hover:text-primary-800">
            IND MART
          </Link>
          <p className="text-xs text-gray-500 mt-1">Cửa hàng rau củ quả tươi</p>
        </div>

        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-gray-200 rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

