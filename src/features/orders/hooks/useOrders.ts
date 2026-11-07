import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ordersApi } from '../api/ordersApi';
import { CheckoutPayload } from '../types';
import { useAuth } from '@/app/providers/AuthContext';
import { CART_QUERY_KEYS } from '@/features/cart/hooks/useCart';
import { PaymentStatus } from '@/types';

export const ORDERS_QUERY_KEYS = {
  all: ['orders'] as const,
  mine: () => [...ORDERS_QUERY_KEYS.all, 'mine'] as const,
  admin: (params?: { statusId?: number; keyword?: string; page?: number; size?: number }) =>
    [...ORDERS_QUERY_KEYS.all, 'admin', params] as const,
  detail: (id: number) => [...ORDERS_QUERY_KEYS.all, 'detail', id] as const,
  byCode: (code: string) => [...ORDERS_QUERY_KEYS.all, 'byCode', code] as const,
  tracking: (id: number) => [...ORDERS_QUERY_KEYS.all, 'tracking', id] as const,
  statuses: () => [...ORDERS_QUERY_KEYS.all, 'statuses'] as const,
};

export function useMyOrders() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.mine(),
    queryFn: () => ordersApi.getMyOrders(),
    enabled: isAuthenticated,
  });
}

export function useOrderDetail(id: number) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: isAuthenticated && !!id,
  });
}

export function useOrderByCode(code?: string) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.byCode(code || ''),
    queryFn: () => ordersApi.getByCode(code!),
    enabled: isAuthenticated && !!code,
  });
}

export function useOrderTracking(id: number) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.tracking(id),
    queryFn: () => ordersApi.getTracking(id),
    enabled: isAuthenticated && !!id,
  });
}

export function useOrderStatuses() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.statuses(),
    queryFn: () => ordersApi.getOrderStatuses(),
  });
}

export function useAdminOrders(params?: { statusId?: number; keyword?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: ORDERS_QUERY_KEYS.admin(params),
    queryFn: () => ordersApi.searchAdmin(params),
  });
}

export function useCheckoutCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => ordersApi.checkoutCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
      toast.success('Đặt hàng thành công!');
    },
  });
}

export function useCheckoutDirect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => ordersApi.checkoutDirect(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
      toast.success('Đặt hàng thành công!');
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersApi.cancel(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.tracking(id) });
      toast.success('Đã huỷ đơn hàng');
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, statusId }: { id: number; statusId: number }) =>
      ordersApi.updateStatus(id, statusId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.tracking(id) });
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
    },
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paymentStatus }: { id: number; paymentStatus: PaymentStatus }) =>
      ordersApi.updatePaymentStatus(id, paymentStatus),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.detail(id) });
      toast.success('Cập nhật trạng thái thanh toán thành công!');
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEYS.all });
      toast.success('Đã xoá đơn hàng!');
    },
  });
}
