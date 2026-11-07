import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { couponsApi, CouponApplyPayload, CouponPayload } from '../api/couponsApi';

export const COUPONS_QUERY_KEYS = {
  all: ['coupons'] as const,
  active: () => [...COUPONS_QUERY_KEYS.all, 'active'] as const,
  paged: (page: number, size: number) => [...COUPONS_QUERY_KEYS.all, 'paged', page, size] as const,
};

export function useActiveCoupons() {
  return useQuery({
    queryKey: COUPONS_QUERY_KEYS.active(),
    queryFn: () => couponsApi.getActive(),
  });
}

export function useApplyCoupon() {
  return useMutation({
    mutationFn: (payload: CouponApplyPayload) => couponsApi.apply(payload),
    onSuccess: (data) => {
      if (data && data.success) {
        toast.success(`Áp dụng mã thành công! Giảm ${(data.data || 0).toLocaleString('vi-VN')} ₫`);
      }
    },
  });
}

export function useAdminCoupons(page = 0, size = 15) {
  return useQuery({
    queryKey: COUPONS_QUERY_KEYS.paged(page, size),
    queryFn: () => couponsApi.getPaged(page, size),
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CouponPayload) => couponsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEYS.all });
      toast.success('Tạo mã giảm giá thành công!');
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CouponPayload }) =>
      couponsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEYS.all });
      toast.success('Cập nhật mã giảm giá thành công!');
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => couponsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEYS.all });
      toast.success('Xoá mã giảm giá thành công!');
    },
  });
}
