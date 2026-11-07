import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { SearchBox } from '@/components/common/SearchBox';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { ApiResponse, Cart } from '@/types';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Lấy dữ liệu giỏ hàng để hiện số lượng khi đã đăng nhập
  const { data: cartData } = useQuery<ApiResponse<Cart>>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Cart>>('/api/cart');
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });

  const cartCount = cartData?.data?.totalQuantity || cartData?.data?.items?.length || 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setUserMenuOpen(false);
    setMobileNavOpen(false);
  }, [location.pathname]);

  const handleSearch = (keyword: string) => {
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-bold tracking-tight text-primary-700 hover:text-primary-800">
                IND MART
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link
                  to="/"
                  className={location.pathname === '/' ? 'text-primary-700 font-semibold' : 'text-gray-600 hover:text-gray-900'}
                >
                  Trang chủ
                </Link>
                <Link
                  to="/categories"
                  className={location.pathname.startsWith('/categories') ? 'text-primary-700 font-semibold' : 'text-gray-600 hover:text-gray-900'}
                >
                  Danh mục
                </Link>
                <Link
                  to="/products"
                  className={location.pathname === '/products' ? 'text-primary-700 font-semibold' : 'text-gray-600 hover:text-gray-900'}
                >
                  Sản phẩm
                </Link>
              </nav>
            </div>

            {/* Search Box */}
            <div className="flex-1 max-w-md hidden sm:block">
              <SearchBox onSearch={handleSearch} placeholder="Tìm kiếm rau củ quả..." />
            </div>

            {/* Right actions: Cart & User */}
            <div className="flex items-center gap-4">
              {/* Cart button */}
              <Link
                to="/cart"
                className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                <span className="hidden sm:inline">Giỏ</span>
                {isAuthenticated && cartCount > 0 && (
                  <span className="inline-flex items-center justify-center bg-primary-600 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown / Auth Buttons */}
              {isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 py-1.5 px-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    <span className="hidden sm:inline max-w-[120px] truncate">
                      Xin chào, {user?.name || user?.username || 'Khách'}
                    </span>
                    <span className="text-xs text-gray-400">▼</span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-gray-200 py-1 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-800 truncate">{user?.name || user?.username}</p>
                        {user?.email && <p className="text-xs text-gray-400 truncate">{user.email}</p>}
                      </div>
                      <Link
                        to="/account/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Hồ sơ
                      </Link>
                      <Link
                        to="/account/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Đơn hàng
                      </Link>
                      <Link
                        to="/account/favourites"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Yêu thích
                      </Link>
                      <Link
                        to="/account/coupons"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Mã giảm giá
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-primary-700 font-medium hover:bg-primary-50 transition-colors border-t border-gray-100"
                        >
                          Quản trị
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => logout()}
                        className="w-full text-left block px-4 py-2 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-md font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 rounded-md font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                aria-label="Mở menu"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Search box on mobile */}
          <div className="sm:hidden pb-3">
            <SearchBox onSearch={handleSearch} placeholder="Tìm kiếm rau củ quả..." />
          </div>

          {/* Mobile nav links */}
          {mobileNavOpen && (
            <div className="md:hidden py-2 border-t border-gray-100 space-y-1">
              <Link to="/" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">
                Trang chủ
              </Link>
              <Link to="/categories" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">
                Danh mục
              </Link>
              <Link to="/products" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">
                Sản phẩm
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium text-gray-700">IND MART - Rau củ tươi mỗi ngày</p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span className="hover:text-gray-700 cursor-pointer">Liên hệ: contact@indmart.vn</span>
            <span>•</span>
            <span className="hover:text-gray-700 cursor-pointer">Chính sách bảo mật</span>
            <span>•</span>
            <span className="hover:text-gray-700 cursor-pointer">Điều khoản sử dụng</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

