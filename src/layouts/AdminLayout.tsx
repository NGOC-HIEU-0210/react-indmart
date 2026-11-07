import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '@/app/providers/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Tổng quan', path: '/admin' },
    { label: 'Sản phẩm', path: '/admin/products' },
    { label: 'Danh mục', path: '/admin/categories' },
    { label: 'Coupon', path: '/admin/coupons' },
    { label: 'Đơn hàng', path: '/admin/orders' },
    { label: 'Kho hàng', path: '/admin/inventory' },
    { label: 'Người dùng', path: '/admin/users' },
  ];

  // Tìm tên trang hiện tại
  const currentNav = navItems.find((item) =>
    item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path)
  );
  const pageTitle = currentNav?.label || 'Quản trị hệ thống';

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden px-2.5 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Menu
            </button>
            <Link to="/admin" className="text-lg font-bold text-primary-700 tracking-tight">
              IND MART Admin
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="hidden sm:inline text-sm font-semibold text-gray-700">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600 hidden sm:inline">
              {user?.username || 'admin'}
            </span>
            <Link
              to="/"
              className="text-xs font-medium text-primary-700 hover:underline px-2 py-1 bg-primary-50 rounded border border-primary-200"
            >
              Về web
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="text-xs font-medium text-red-600 hover:text-red-700"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 top-16 z-30 w-60 bg-white border-r border-gray-200 transform transition-transform md:translate-x-0 md:static md:inset-auto',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'block px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Backdrop cho mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-16 z-20 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Nội dung trang */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

