import apiClient from '@/lib/axios';
import { ApiResponse, PageResponse, Category } from '@/types';

export interface CategoryPayload {
  name: string;
  active?: boolean;
  parentCategoryId?: number | null;
}

export const categoriesApi = {
  getActive: async (params?: { keyword?: string; page?: number; size?: number }) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Category>>>('/api/categories/active', {
      params: {
        keyword: params?.keyword,
        page: params?.page ?? 0,
        size: params?.size ?? 50,
      },
    });
    return res.data;
  },

  getAllAdmin: async (params?: { keyword?: string; page?: number; size?: number }) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Category>>>('/api/categories', {
      params: {
        keyword: params?.keyword,
        page: params?.page ?? 0,
        size: params?.size ?? 20,
      },
    });
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<Category>>(`/api/categories/${id}`);
    return res.data;
  },

  create: async (data: CategoryPayload) => {
    const res = await apiClient.post<ApiResponse<Category>>('/api/categories', data);
    return res.data;
  },

  update: async (id: number, data: CategoryPayload) => {
    const res = await apiClient.put<ApiResponse<Category>>(`/api/categories/${id}`, data);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(`/api/categories/${id}`);
    return res.data;
  },

  uploadImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<Category>>(`/api/categories/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
