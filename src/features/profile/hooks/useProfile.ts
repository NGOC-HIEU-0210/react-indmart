import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { profileApi } from '../api/profileApi';
import { useAuth } from '@/app/providers/AuthContext';
import { User } from '@/types';

export const PROFILE_QUERY_KEYS = {
  me: ['users', 'me'] as const,
};

export function useMyProfile() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.me,
    queryFn: () => profileApi.getMe(),
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => profileApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.me });
      toast.success('Cập nhật thông tin thành công!');
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.me });
      toast.success('Cập nhật ảnh đại diện thành công!');
    },
  });
}

