import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormData } from '@/features/profile/schemas';
import { useMyProfile, useUpdateProfile, useUploadAvatar } from '@/features/profile/hooks/useProfile';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';

export const ProfilePage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = data?.data;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobile: '',
      address: '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('mobile', user.mobile || '');
      setValue('address', user.address || '');
    }
  }, [user, setValue]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAvatarMutation.mutate(file);
  };

  const onSubmit = (values: ProfileFormData) => {
    updateProfileMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      mobile: values.mobile,
      address: values.address,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spinner size="md" label="Đang tải thông tin hồ sơ..." />
      </div>
    );
  }

  if (isError || !user) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6">
        Hồ sơ cá nhân
      </h2>

      {/* Đổi ảnh đại diện */}
      <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
        <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-primary-200 bg-gray-100 shrink-0">
          <ImageWithFallback
            src={user.avatar}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarFile}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploadAvatarMutation.isPending}
          >
            Đổi ảnh đại diện
          </Button>
          <p className="text-xs text-gray-400 mt-1">Định dạng JPG, PNG hoặc WEBP, tối đa 5MB</p>
        </div>
      </div>

      {/* Form thông tin cá nhân */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              label="Họ đệm"
              placeholder="Nguyễn"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
          </div>

          <div>
            <Input
              label="Tên"
              required
              placeholder="Văn A"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </div>

        <div>
          <Input
            label="Email"
            disabled
            value={user.email || ''}
            helper="Email được quản lý bởi tài khoản Keycloak"
          />
        </div>

        <div>
          <Input
            label="Số điện thoại"
            placeholder="0912345678"
            error={errors.mobile?.message}
            {...register('mobile')}
          />
        </div>

        <div>
          <Input
            label="Địa chỉ giao hàng mặc định"
            placeholder="Số nhà, tên đường, phường/xã..."
            error={errors.address?.message}
            {...register('address')}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={updateProfileMutation.isPending}
          >
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Card>
  );
};
export default ProfilePage;
