import apiClient from '@/lib/axios';
import { ApiResponse, Cart } from '@/types';

export const cartApi = {
  get: async () => {
    const res = await apiClient.get<ApiResponse<Cart>>('/api/cart');
    return res.data;
  },

  addItem: async (productId: number, quantity = 1) => {
    const res = await apiClient.post<ApiResponse<Cart>>('/api/cart/items', {
      productId,
      quantity,
    });
    return res.data;
  },

  setQuantity: async (productId: number, quantity: number) => {
    const res = await apiClient.patch<ApiResponse<Cart>>(
      `/api/cart/items/${productId}`,
      null,
      { params: { quantity } }
    );
    return res.data;
  },

  removeItem: async (productId: number) => {
    const res = await apiClient.delete<ApiResponse<Cart>>(`/api/cart/items/${productId}`);
    return res.data;
  },

  clear: async () => {
    const res = await apiClient.delete<ApiResponse<void>>('/api/cart');
    return res.data;
  },
};

