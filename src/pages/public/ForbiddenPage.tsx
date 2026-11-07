import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-extrabold text-red-300">403</h1>
      <h2 className="text-xl font-bold text-gray-800 mt-4">Không có quyền truy cập</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        Bạn không có quyền truy cập vào khu vực này. Trang chỉ dành cho quản trị viên hệ thống.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="primary" size="md">
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};
export default ForbiddenPage;

