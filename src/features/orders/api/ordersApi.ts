import apiClient from '@/lib/axios';
import { ApiResponse, PageResponse, Order, OrderTracking, OrderStatus, PaymentStatus } from '@/types';
import { CheckoutPayload } from '../types';

export const ordersApi = {
  checkoutCart: async (payload: CheckoutPayload) => {
    const res = await apiClient.post<ApiResponse<Order>>('/api/orders/checkout-cart', payload);
    return res.data;
  },

  checkoutDirect: async (payload: CheckoutPayload) => {
    const res = await apiClient.post<ApiResponse<Order>>('/api/orders/checkout', payload);
    return res.data;
  },

  getMyOrders: async () => {
    const res = await apiClient.get<ApiResponse<Order[]>>('/api/orders/me');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<Order>>(`/api/orders/${id}`);
    return res.data;
  },

  getByCode: async (orderCode: string) => {
    const res = await apiClient.get<ApiResponse<Order>>(`/api/orders/code/${orderCode}`);
    return res.data;
  },

  getTracking: async (id: number) => {
    const res = await apiClient.get<ApiResponse<OrderTracking[]>>(`/api/orders/${id}/tracking`);
    return res.data;
  },

  cancel: async (id: number) => {
    const res = await apiClient.patch<ApiResponse<Order>>(`/api/orders/${id}/cancel`);
    return res.data;
  },

  // Admin APIs
  getPaged: async (page = 0, size = 15) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Order>>>('/api/orders/paged', {
      params: { page, size },
    });
    return res.data;
  },

  searchAdmin: async (params?: { statusId?: number; keyword?: string; page?: number; size?: number }) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Order>>>('/api/orders/search', {
      params: {
        statusId: params?.statusId || undefined,
        keyword: params?.keyword || undefined,
        page: params?.page ?? 0,
        size: params?.size ?? 15,
      },
    });
    return res.data;
  },

  updateStatus: async (id: number, statusId: number) => {
    const res = await apiClient.patch<ApiResponse<Order>>(`/api/orders/${id}/status`, null, {
      params: { statusId },
    });
    return res.data;
  },

  updatePaymentStatus: async (id: number, paymentStatus: PaymentStatus) => {
    const res = await apiClient.patch<ApiResponse<Order>>(`/api/orders/${id}/payment-status`, null, {
      params: { paymentStatus },
    });
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(`/api/orders/${id}`);
    return res.data;
  },

  getOrderStatuses: async () => {
    const res = await apiClient.get<ApiResponse<OrderStatus[]>>('/api/order-statuses');
    return res.data;
  },
};
