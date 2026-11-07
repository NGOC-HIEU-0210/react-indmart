import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-extrabold text-gray-300">404</h1>
      <h2 className="text-xl font-bold text-gray-800 mt-4">Không tìm thấy trang</h2>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang đường dẫn khác.
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
export default NotFoundPage;

