import React, { useState } from 'react';
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUser,
  useUpdateUserStatus,
  useDeleteUser,
  useUploadUserAvatar,
} from '@/features/users/hooks/useUsers';

import { useAuth } from '@/app/providers/AuthContext';
import { User } from '@/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ImageUploader } from '@/components/common/ImageUploader';
import { SearchBox } from '@/components/common/SearchBox';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';


export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');

  const { data, isLoading, isError, refetch } = useAdminUsers(keyword.trim() || undefined, currentPage, 10);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const updateStatusMutation = useUpdateUserStatus();
  const deleteMutation = useDeleteUser();
  const uploadAvatarMutation = useUploadUserAvatar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  // Confirm delete
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  const users = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  const handleOpenCreate = () => {
    setEditingUser(null);
    setUsername('');
    setPassword('');
    setEmail('');
    setFirstName('');
    setLastName('');
    setMobile('');
    setAddress('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setUsername(u.username);
    setPassword('');
    setEmail(u.email);
    setFirstName(u.firstName || '');
    setLastName(u.lastName || '');
    setMobile(u.mobile || '');
    setAddress(u.address || '');
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      await updateMutation.mutateAsync({
        id: editingUser.id,
        data: {
          email,
          firstName,
          lastName,
          mobile,
          address,
        },
      });
      setIsModalOpen(false);
    } else {
      if (!username.trim() || password.length < 6 || !email.trim()) return;
      const created = await createMutation.mutateAsync({
        username: username.trim(),
        password,
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
      });
      if (created?.data) {
        setEditingUser(created.data);
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const handleUploadAvatar = (file: File) => {
    if (!editingUser) return;
    uploadAvatarMutation.mutate({ id: editingUser.id, file });
  };

  const handleConfirmDelete = () => {
    if (deletingUserId) {
      deleteMutation.mutate(deletingUserId, {
        onSuccess: () => setDeletingUserId(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-xs text-gray-500 mt-0.5">Danh sách tài khoản khách hàng và quản trị viên</p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreate}>
          + Tạo người dùng
        </Button>
      </div>

      {/* Tìm kiếm */}
      <div className="max-w-md">
        <SearchBox
          value={keyword}
          onChange={(val) => {
            setKeyword(val);
            setCurrentPage(0);
          }}
          placeholder="Tìm theo username, email, tên..."
        />
      </div>

      {/* Bảng người dùng */}
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="md" label="Đang tải danh sách người dùng..." />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : users.length === 0 ? (
        <EmptyState
          title="Không tìm thấy người dùng"
          description={keyword ? 'Không có người dùng nào khớp với từ khoá.' : 'Hiện chưa có người dùng nào.'}
          action={
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              Tạo người dùng đầu tiên
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email & SĐT</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Hoạt động</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const isSelf = currentUser?.username === u.username;
                const isActive = u.status === 'ACTIVE' || u.status === 'true' || u.status === undefined;

                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="h-10 w-10 rounded-full border border-gray-200 overflow-hidden bg-gray-50">
                        <ImageWithFallback
                          src={u.avatar}
                          alt={u.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      {u.username}
                      {isSelf && (
                        <span className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-normal">
                          Bạn
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {[u.firstName, u.lastName].filter(Boolean).join(' ') || '-'}
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{u.email}</p>
                      {u.mobile && <p className="text-xs text-gray-400">{u.mobile}</p>}
                    </TableCell>
                    <TableCell>
                      {u.roles && u.roles.includes('ADMIN') ? (
                        <Badge variant="info">ADMIN</Badge>
                      ) : (
                        <Badge variant="neutral">USER</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {isSelf ? (
                        <Badge variant="success">Đang dùng</Badge>
                      ) : (
                        <Switch
                          checked={isActive}
                          onChange={(checked) => updateStatusMutation.mutate({ id: u.id, status: checked })}
                          disabled={updateStatusMutation.isPending}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(u)}
                      >
                        Sửa
                      </Button>
                      {!isSelf && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeletingUserId(u.id)}
                        >
                          Xoá
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {/* Modal Thêm / Sửa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Sửa người dùng: ${editingUser.username}` : 'Tạo người dùng mới'}
        maxWidth="lg"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Huỷ
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveUser}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              Lưu
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tên đăng nhập (Username)"
              required
              disabled={!!editingUser}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="VD: user123"
            />

            {!editingUser && (
              <Input
                label="Mật khẩu"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                helper="Mật khẩu tạm thời cho tài khoản mới"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Họ đệm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nguyễn"
            />

            <Input
              label="Tên"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Văn B"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />

            <Input
              label="Số điện thoại"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="0912345678"
            />
          </div>

          <Input
            label="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường, khu vực..."
          />

          {editingUser && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">Ảnh đại diện:</p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full border overflow-hidden bg-gray-50 shrink-0">
                  <ImageWithFallback
                    src={editingUser.avatar}
                    alt={editingUser.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ImageUploader
                  onFileSelect={handleUploadAvatar}
                  label=""
                  disabled={uploadAvatarMutation.isPending}
                />
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={deletingUserId !== null}
        onClose={() => setDeletingUserId(null)}
        onConfirm={handleConfirmDelete}
        title="Xoá người dùng?"
        message="Bạn có chắc chắn muốn xoá người dùng này không? Thao tác này không thể hoàn tác."
        confirmLabel="Xoá tài khoản"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
export default AdminUsersPage;
