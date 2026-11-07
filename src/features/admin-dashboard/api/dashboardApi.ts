import apiClient from '@/lib/axios';
import { ApiResponse, Dashboard } from '@/types';

export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get<ApiResponse<Dashboard>>('/api/admin/dashboard');
    return res.data;
  },
};

