import apiClient from '@/lib/axios';
import { ApiResponse, PageResponse, Product, ProductImage } from '@/types';

export interface ProductPayload {
  name: string;
  price: number;
  description?: string;
  categoryId?: number;
  active?: boolean;
  shelfLifeDays?: number;
}

export const productsApi = {
  getLatest: async (page = 0, size = 8) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Product>>>('/api/products/latest', {
      params: { page, size },
    });
    return res.data;
  },

  getRescue: async () => {
    const res = await apiClient.get<ApiResponse<Product[]>>('/api/products/rescue');
    return res.data;
  },

  search: async (params?: { keyword?: string; categoryId?: number; page?: number; size?: number }) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Product>>>('/api/products/search', {
      params: {
        keyword: params?.keyword || undefined,
        categoryId: params?.categoryId || undefined,
        page: params?.page ?? 0,
        size: params?.size ?? 12,
      },
    });
    return res.data;
  },

  getByCategory: async (categoryId: number, page = 0, size = 12) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Product>>>(`/api/products/category/${categoryId}`, {
      params: { page, size },
    });
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<Product>>(`/api/products/${id}`);
    return res.data;
  },

  // Admin APIs
  getAllAdmin: async (page = 0, size = 15) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Product>>>('/api/products', {
      params: { page, size },
    });
    return res.data;
  },

  create: async (data: ProductPayload) => {
    const res = await apiClient.post<ApiResponse<Product>>('/api/products', data);
    return res.data;
  },

  update: async (id: number, data: ProductPayload) => {
    const res = await apiClient.put<ApiResponse<Product>>(`/api/products/${id}`, data);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(`/api/products/${id}`);
    return res.data;
  },

  setImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<Product>>(`/api/products/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  addImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<ProductImage>>(`/api/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deleteImage: async (imageId: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(`/api/products/images/${imageId}`);
    return res.data;
  },
};
