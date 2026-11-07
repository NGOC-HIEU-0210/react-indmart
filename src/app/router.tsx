import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout, AccountLayout, AdminLayout, AuthLayout } from '@/layouts';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { AdminRoute } from '@/routes/AdminRoute';
import { Spinner } from '@/components/ui/Spinner';

// Loading fallback cho lazy routes
const PageLoading: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Spinner size="md" />
  </div>
);

// Lazy imports để tách bundle
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const CategoriesPage = lazy(() => import('@/pages/public/CategoriesPage'));
const ProductsPage = lazy(() => import('@/pages/public/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/public/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/public/CheckoutPage'));
const CheckoutSuccessPage = lazy(() => import('@/pages/public/CheckoutSuccessPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/public/ForbiddenPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

// Account pages
const ProfilePage = lazy(() => import('@/pages/account/ProfilePage'));
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/account/OrderDetailPage'));
const FavouritesPage = lazy(() => import('@/pages/account/FavouritesPage'));
const CouponsPage = lazy(() => import('@/pages/account/CouponsPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminCouponsPage = lazy(() => import('@/pages/admin/AdminCouponsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/AdminOrdersPage'));
const AdminOrderDetailPage = lazy(() => import('@/pages/admin/AdminOrderDetailPage'));
const AdminInventoryPage = lazy(() => import('@/pages/admin/AdminInventoryPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));

export const router = createBrowserRouter([
  // Public layout routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<PageLoading />}>
            <CategoriesPage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'products/:id',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoading />}>
              <CartPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoading />}>
              <CheckoutPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout/success/:orderCode',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoading />}>
              <CheckoutSuccessPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      // Account routes
      {
        path: 'account',
        element: (
          <ProtectedRoute>
            <AccountLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/account/profile" replace />,
          },
          {
            path: 'profile',
            element: (
              <Suspense fallback={<PageLoading />}>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: 'orders',
            element: (
              <Suspense fallback={<PageLoading />}>
                <OrdersPage />
              </Suspense>
            ),
          },
          {
            path: 'orders/:id',
            element: (
              <Suspense fallback={<PageLoading />}>
                <OrderDetailPage />
              </Suspense>
            ),
          },
          {
            path: 'favourites',
            element: (
              <Suspense fallback={<PageLoading />}>
                <FavouritesPage />
              </Suspense>
            ),
          },
          {
            path: 'coupons',
            element: (
              <Suspense fallback={<PageLoading />}>
                <CouponsPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '403',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ForbiddenPage />
          </Suspense>
        ),
      },
      {
        path: '404',
        element: (
          <Suspense fallback={<PageLoading />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
  // Auth routes (AuthLayout)
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoading />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoading />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
    ],
  },
  // Admin routes (AdminRoute + AdminLayout)
  {
    path: 'admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminProductsPage />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminCategoriesPage />
          </Suspense>
        ),
      },
      {
        path: 'coupons',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminCouponsPage />
          </Suspense>
        ),
      },
      {
        path: 'orders',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminOrdersPage />
          </Suspense>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminOrderDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'inventory',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminInventoryPage />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminUsersPage />
          </Suspense>
        ),
      },
    ],
  },
  // Wildcard 404
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoading />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

