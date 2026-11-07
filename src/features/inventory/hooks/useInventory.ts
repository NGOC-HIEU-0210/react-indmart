import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { inventoryApi, CreateBatchPayload } from '../api/inventoryApi';

export const INVENTORY_QUERY_KEYS = {
  all: ['admin', 'inventory'] as const,
  byProduct: (productId: number, page: number) =>
    [...INVENTORY_QUERY_KEYS.all, 'product', productId, page] as const,
  expiring: (days: number, page: number) =>
    [...INVENTORY_QUERY_KEYS.all, 'expiring', days, page] as const,
  wasteReport: (from?: string, to?: string) =>
    [...INVENTORY_QUERY_KEYS.all, 'waste-report', from, to] as const,
};

export function useBatchesByProduct(productId: number, page = 0) {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.byProduct(productId, page),
    queryFn: () => inventoryApi.getByProduct(productId, page),
    enabled: !!productId,
  });
}

export function useExpiringBatches(days = 2, page = 0) {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.expiring(days, page),
    queryFn: () => inventoryApi.getExpiring(days, page),
  });
}

export function useWasteReport(from?: string, to?: string) {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.wasteReport(from, to),
    queryFn: () => inventoryApi.getWasteReport(from, to),
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBatchPayload) => inventoryApi.createBatch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Nhập lô hàng mới thành công!');
    },
  });
}

export function useWriteOffExpired() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryApi.writeOffExpired(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Đã xuất huỷ ${data?.data ?? 0} lô hàng hết hạn`);
    },
  });
}

