import apiClient from '@/lib/axios';
import { ApiResponse } from '@/types';

export interface FavouriteItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  productImage?: string;
  productPrice: number;
  createdDate?: string;
}

export const favouritesApi = {
  getAll: async () => {
    const res = await apiClient.get<ApiResponse<FavouriteItem[]>>('/api/favourites');
    return res.data;
  },

  toggle: async (productId: number) => {
    const res = await apiClient.post<ApiResponse<boolean>>('/api/favourites/toggle', null, {
      params: { productId },
    });
    return res.data;
  },

  check: async (productId: number) => {
    const res = await apiClient.get<ApiResponse<boolean>>('/api/favourites/check', {
      params: { productId },
    });
    return res.data;
  },

  count: async (productId: number) => {
    const res = await apiClient.get<ApiResponse<number>>(`/api/favourites/count/${productId}`);
    return res.data;
  },

  remove: async (productId: number) => {
    const res = await apiClient.delete<ApiResponse<void>>('/api/favourites', {
      params: { productId },
    });
    return res.data;
  },
};

