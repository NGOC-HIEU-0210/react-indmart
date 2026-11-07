import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';

export const AccountLayout: React.FC = () => {
  const navItems = [
    { label: 'Hồ sơ', path: '/account/profile' },
    { label: 'Đơn hàng của tôi', path: '/account/orders' },
    { label: 'Sản phẩm yêu thích', path: '/account/favourites' },
    { label: 'Mã giảm giá', path: '/account/coupons' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Menu bên trái */}
        <div className="md:col-span-1">
          <Card className="p-2">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/account/orders'}
                  className={({ isActive }) =>
                    clsx(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </Card>
        </div>

        {/* Nội dung bên phải */}
        <div className="md:col-span-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

