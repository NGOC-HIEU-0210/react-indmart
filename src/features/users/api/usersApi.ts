import apiClient from '@/lib/axios';
import { ApiResponse, PageResponse, User } from '@/types';

export interface CreateUserPayload {
  username: string;
  password?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  address?: string;
}

export type UpdateUserPayload = Partial<CreateUserPayload>;

export const usersApi = {
  getPaged: async (page = 0, size = 10) => {
    const res = await apiClient.get<ApiResponse<PageResponse<User>>>('/api/users/paged', {
      params: { page, size },
    });
    return res.data;
  },

  search: async (keyword?: string, page = 0, size = 10) => {
    const res = await apiClient.get<ApiResponse<PageResponse<User>>>('/api/users/search', {
      params: { keyword, page, size },
    });
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<User>>(`/api/users/${id}`);
    return res.data;
  },

  create: async (data: CreateUserPayload) => {
    const res = await apiClient.post<ApiResponse<User>>('/api/users', data);
    return res.data;
  },

  update: async (id: number, data: UpdateUserPayload) => {
    const res = await apiClient.put<ApiResponse<User>>(`/api/users/${id}`, data);
    return res.data;
  },

  updateStatus: async (id: number, status: boolean) => {
    const res = await apiClient.patch<ApiResponse<User>>(`/api/users/${id}/status`, null, {
      params: { status },
    });
    return res.data;
  },

  uploadAvatar: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<User>>(`/api/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  delete: async (id: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(`/api/users/${id}`);
    return res.data;
  },
};

