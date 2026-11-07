import apiClient from '@/lib/axios';
import { ApiResponse, User } from '@/types';

export const profileApi = {
  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/api/users/me');
    return res.data;
  },

  updateMe: async (data: Partial<User>) => {
    const res = await apiClient.put<ApiResponse<User>>('/api/users/me', data);
    return res.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<User>>('/api/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

