import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productsApi, ProductPayload } from '../api/productsApi';

export const PRODUCTS_QUERY_KEYS = {
  all: ['products'] as const,
  admin: (page: number, size: number) => [...PRODUCTS_QUERY_KEYS.all, 'admin', page, size] as const,
  latest: (page: number, size: number) => [...PRODUCTS_QUERY_KEYS.all, 'latest', page, size] as const,
  rescue: () => [...PRODUCTS_QUERY_KEYS.all, 'rescue'] as const,
  search: (params?: { keyword?: string; categoryId?: number; page?: number; size?: number }) =>
    [...PRODUCTS_QUERY_KEYS.all, 'search', params] as const,
  byCategory: (categoryId: number, page: number, size: number) =>
    [...PRODUCTS_QUERY_KEYS.all, 'byCategory', categoryId, page, size] as const,
  detail: (id: number) => [...PRODUCTS_QUERY_KEYS.all, 'detail', id] as const,
};

export function useLatestProducts(page = 0, size = 8) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.latest(page, size),
    queryFn: () => productsApi.getLatest(page, size),
    placeholderData: keepPreviousData, // giữ lưới cũ khi đang tải trang mới, tránh nháy skeleton
  });
}

export function useRescueProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.rescue(),
    queryFn: () => productsApi.getRescue(),
  });
}

export function useSearchProducts(params?: { keyword?: string; categoryId?: number; page?: number; size?: number }) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.search(params),
    queryFn: () => productsApi.search(params),
  });
}

export function useProductDetail(id: number) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useAdminProducts(page = 0, size = 15) {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.admin(page, size),
    queryFn: () => productsApi.getAllAdmin(page, size),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductPayload) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      toast.success('Tạo sản phẩm mới thành công!');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductPayload }) =>
      productsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.detail(id) });
      toast.success('Cập nhật sản phẩm thành công!');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      toast.success('Xoá sản phẩm thành công!');
    },
  });
}

export function useSetProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => productsApi.setImage(id, file),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.detail(id) });
      toast.success('Cập nhật ảnh chính thành công!');
    },
  });
}

export function useAddProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => productsApi.addImage(id, file),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.detail(id) });
      toast.success('Thêm ảnh phụ thành công!');
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: number) => productsApi.deleteImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      toast.success('Xoá ảnh thành công!');
    },
  });
}