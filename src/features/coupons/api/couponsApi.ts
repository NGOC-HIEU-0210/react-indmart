import apiClient from '@/lib/axios';
import { ApiResponse, PageResponse, Coupon, DiscountType } from '@/types';

export interface CouponApplyPayload {
  code: string;
  orderTotal: number;
}

export interface CouponPayload {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  active?: boolean;
}

export const couponsApi = {
  getActive: async () => {
    const res = await apiClient.get<ApiResponse<Coupon[]>>('/api/coupons/active');
    return res.data;
  },

  apply: async (payload: CouponApplyPayload) => {
    const res = await apiClient.post<ApiResponse<number>>('/api/coupons/apply', payload);
    return res.data;
  },

  // Admin APIs
  getPaged: async (page = 0, size = 15) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Coupon>>>('/api/coupons/paged', {
      params: { page, size },
    });
    return res.data;
  },

  create: async (data: CouponPayload) => {
    const res = await apiClient.post<ApiResponse<Coupon>>('/api/coupons', data);
    return res.data;
  },

  update: async (id: number, data: CouponPayload) => {
    const res = await apiClient.put<ApiResponse<Coupon>>(`/api/coupons/${id}`, data);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(`/api/coupons/${id}`);
    return res.data;
  },
};
