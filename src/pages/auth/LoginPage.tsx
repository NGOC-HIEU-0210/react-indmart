import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthContext';
import { Button } from '@/components/ui/Button';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isAdmin, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Vị trí trang trước đó
  const from = (location.state as { from?: { pathname: string; search?: string } })?.from;
  const redirectTarget = from ? `${from.pathname}${from.search || ''}` : '/';

  // Nếu người dùng đã đăng nhập từ trước, tự động chuyển hướng
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectTarget, { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, redirectTarget]);

  const handleLogin = () => {
    const redirectUri = `${window.location.origin}${isAdmin ? '/admin' : redirectTarget}`;
    login({ redirectUri });
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Đăng nhập tài khoản</h2>
        <p className="text-sm text-gray-500 mt-1">
          Bạn sẽ được chuyển sang trang đăng nhập an toàn của IND MART.
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          variant="primary"
          size="lg"
          className="w-full uppercase font-bold tracking-wider"
          onClick={handleLogin}
        >
          Đăng nhập
        </Button>
      </div>

      <div className="pt-4 border-t border-gray-100 flex flex-col gap-2 text-sm text-gray-600">
        <div>
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary-700 font-medium hover:underline">
            Đăng ký
          </Link>
        </div>
        <div>
          <Link to="/forgot-password" className="text-gray-500 hover:text-gray-700 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
