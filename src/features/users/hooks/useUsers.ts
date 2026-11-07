import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { usersApi, CreateUserPayload, UpdateUserPayload } from '../api/usersApi';

export const USERS_QUERY_KEYS = {
  all: ['admin', 'users'] as const,
  paged: (keyword?: string, page = 0, size = 10) =>
    [...USERS_QUERY_KEYS.all, 'paged', keyword, page, size] as const,
  detail: (id: number) => [...USERS_QUERY_KEYS.all, 'detail', id] as const,
};

export function useAdminUsers(keyword?: string, page = 0, size = 10) {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.paged(keyword, page, size),
    queryFn: () => (keyword ? usersApi.search(keyword, page, size) : usersApi.getPaged(page, size)),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPayload) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      toast.success('Tạo người dùng mới thành công!');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserPayload }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      toast.success('Cập nhật người dùng thành công!');
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      usersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      toast.success('Cập nhật trạng thái người dùng thành công!');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      toast.success('Xoá người dùng thành công!');
    },
  });
}

export function useUploadUserAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => usersApi.uploadAvatar(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.all });
      toast.success('Cập nhật ảnh đại diện người dùng thành công!');
    },
  });
}

