import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthContext';
import { Button } from '@/components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const { login } = useAuth();

  const handleGoToLogin = () => {
    login({ redirectUri: `${window.location.origin}/` });
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Quên mật khẩu</h2>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          Chọn &ldquo;Quên mật khẩu&rdquo; ở trang đăng nhập tiếp theo để nhận email đặt lại mật khẩu của bạn.
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleGoToLogin}
        >
          Đến trang đăng nhập
        </Button>
      </div>

      <div className="pt-4 border-t border-gray-100 text-sm text-gray-600">
        <Link to="/login" className="text-primary-700 font-medium hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;

