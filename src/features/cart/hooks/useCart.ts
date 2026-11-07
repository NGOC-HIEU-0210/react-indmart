import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cartApi } from '../api/cartApi';
import { useAuth } from '@/app/providers/AuthContext';

export const CART_QUERY_KEYS = {
  cart: ['cart'] as const,
};

export function useCart() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: CART_QUERY_KEYS.cart,
    queryFn: () => cartApi.get(),
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated, login } = useAuth();

  return useMutation({
    mutationFn: ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      if (!isAuthenticated) {
        login();
        return Promise.reject(new Error('Chưa đăng nhập'));
      }
      return cartApi.addItem(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartApi.setQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => cartApi.removeItem(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      toast.success('Đã xoá món khỏi giỏ');
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      toast.success('Đã làm trống giỏ hàng');
    },
  });
}

