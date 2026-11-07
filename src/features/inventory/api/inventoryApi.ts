import apiClient from '@/lib/axios';
import { ApiResponse, PageResponse, Batch, WasteReport } from '@/types';

export interface CreateBatchPayload {
  productId: number;
  quantity: number;
  costPrice: number;
  expiryDate?: string;
}

export const inventoryApi = {
  createBatch: async (payload: CreateBatchPayload) => {
    const res = await apiClient.post<ApiResponse<Batch>>('/api/admin/batches', payload);
    return res.data;
  },

  getByProduct: async (productId: number, page = 0, size = 20) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Batch>>>(
      `/api/admin/batches/product/${productId}`,
      { params: { page, size } }
    );
    return res.data;
  },

  getExpiring: async (days = 2, page = 0, size = 20) => {
    const res = await apiClient.get<ApiResponse<PageResponse<Batch>>>(
      '/api/admin/batches/expiring',
      { params: { days, page, size } }
    );
    return res.data;
  },

  getWasteReport: async (from?: string, to?: string) => {
    const res = await apiClient.get<ApiResponse<WasteReport>>(
      '/api/admin/batches/waste-report',
      { params: { from, to } }
    );
    return res.data;
  },

  writeOffExpired: async () => {
    const res = await apiClient.post<ApiResponse<number>>('/api/admin/batches/write-off-expired');
    return res.data;
  },
};

