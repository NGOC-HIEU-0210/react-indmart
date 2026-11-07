import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoriesApi, CategoryPayload } from '../api/categoriesApi';

export const CATEGORIES_QUERY_KEYS = {
  all: ['categories'] as const,
  active: (params?: { keyword?: string; page?: number; size?: number }) =>
    [...CATEGORIES_QUERY_KEYS.all, 'active', params] as const,
  admin: (params?: { keyword?: string; page?: number; size?: number }) =>
    [...CATEGORIES_QUERY_KEYS.all, 'admin', params] as const,
  detail: (id: number) => [...CATEGORIES_QUERY_KEYS.all, 'detail', id] as const,
};

export function useActiveCategories(params?: { keyword?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEYS.active(params),
    queryFn: () => categoriesApi.getActive(params),
  });
}

export function useAdminCategories(params?: { keyword?: string; page?: number; size?: number }) {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEYS.admin(params),
    queryFn: () => categoriesApi.getAllAdmin(params),
  });
}

export function useCategoryDetail(id: number) {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEYS.detail(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryPayload) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
      toast.success('Tạo danh mục mới thành công!');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryPayload }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
      toast.success('Cập nhật danh mục thành công!');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
      toast.success('Xoá danh mục thành công!');
    },
  });
}

export function useUploadCategoryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => categoriesApi.uploadImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEYS.all });
      toast.success('Tải ảnh danh mục thành công!');
    },
  });
}
