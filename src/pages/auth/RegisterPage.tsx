import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthContext';
import { Button } from '@/components/ui/Button';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();

  const handleRegister = () => {
    register({ redirectUri: `${window.location.origin}/` });
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Tạo tài khoản mới</h2>
        <p className="text-sm text-gray-500 mt-1">
          Bạn sẽ được chuyển sang trang đăng ký an toàn của IND MART.
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full uppercase font-bold tracking-wider"
          onClick={handleRegister}
        >
          Tiếp tục đăng ký
        </Button>
      </div>

      <div className="pt-4 border-t border-gray-100 text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-primary-700 font-medium hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};
export default RegisterPage;

