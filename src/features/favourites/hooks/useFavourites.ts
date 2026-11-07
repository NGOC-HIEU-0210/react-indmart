import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { favouritesApi } from '../api/favouritesApi';
import { useAuth } from '@/app/providers/AuthContext';

export const FAVOURITES_QUERY_KEYS = {
  all: ['favourites'] as const,
  mine: () => [...FAVOURITES_QUERY_KEYS.all, 'mine'] as const,
  check: (productId: number) => [...FAVOURITES_QUERY_KEYS.all, 'check', productId] as const,
  count: (productId: number) => [...FAVOURITES_QUERY_KEYS.all, 'count', productId] as const,
};

export function useMyFavourites() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: FAVOURITES_QUERY_KEYS.mine(),
    queryFn: () => favouritesApi.getAll(),
    enabled: isAuthenticated,
  });
}

export function useCheckFavourite(productId: number) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: FAVOURITES_QUERY_KEYS.check(productId),
    queryFn: () => favouritesApi.check(productId),
    enabled: isAuthenticated && !!productId,
  });
}

export function useFavouriteCount(productId: number) {
  return useQuery({
    queryKey: FAVOURITES_QUERY_KEYS.count(productId),
    queryFn: () => favouritesApi.count(productId),
    enabled: !!productId,
  });
}

export function useToggleFavourite() {
  const queryClient = useQueryClient();
  const { isAuthenticated, login } = useAuth();

  return useMutation({
    mutationFn: (productId: number) => {
      if (!isAuthenticated) {
        login();
        return Promise.reject(new Error('Chưa đăng nhập'));
      }
      return favouritesApi.toggle(productId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: FAVOURITES_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (data?.data) {
        toast.success('Đã thêm vào danh sách yêu thích');
      } else {
        toast.success('Đã bỏ khỏi danh sách yêu thích');
      }
    },
  });
}
