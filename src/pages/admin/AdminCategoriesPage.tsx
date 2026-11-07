import React, { useState } from 'react';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useUploadCategoryImage,
} from '@/features/categories/hooks/useCategories';
import { Category } from '@/types';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';
import { ImageUploader } from '@/components/common/ImageUploader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SearchBox } from '@/components/common/SearchBox';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminCategoriesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');

  const { data, isLoading, isError, refetch } = useAdminCategories({
    keyword: keyword.trim() || undefined,
    page: currentPage,
    size: 15,
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const uploadImageMutation = useUploadCategoryImage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  const [active, setActive] = useState(true);

  // Confirm delete dialog
  const [deletingCatId, setDeletingCatId] = useState<number | null>(null);

  const categories = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setParentCategoryId(null);
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setParentCategoryId(cat.parentCategoryId || null);
    setActive(cat.active);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      await updateMutation.mutateAsync({
        id: editingCategory.id,
        data: {
          name: name.trim(),
          parentCategoryId,
          active,
        },
      });
      setIsModalOpen(false);
    } else {
      const created = await createMutation.mutateAsync({
        name: name.trim(),
        parentCategoryId,
        active,
      });
      if (created?.data) {
        setEditingCategory(created.data);
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const handleUploadImage = (file: File) => {
    if (!editingCategory) return;
    uploadImageMutation.mutate({ id: editingCategory.id, file });
  };

  const handleConfirmDelete = () => {
    if (deletingCatId) {
      deleteMutation.mutate(deletingCatId, {
        onSuccess: () => setDeletingCatId(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-xs text-gray-500 mt-0.5">Phân loại sản phẩm (rau xanh, củ quả, trái cây...)</p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreate}>
          + Thêm mới
        </Button>
      </div>

      {/* Tìm kiếm */}
      <div className="max-w-md">
        <SearchBox
          value={keyword}
          onChange={setKeyword}
          placeholder="Tìm theo tên danh mục..."
        />
      </div>

      {/* Bảng danh mục */}
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="md" label="Đang tải danh mục..." />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : categories.length === 0 ? (
        <EmptyState
          title="Không tìm thấy danh mục"
          description={keyword ? 'Không có danh mục nào khớp với từ khoá.' : 'Hiện chưa có danh mục nào.'}
          action={
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              Thêm danh mục đầu tiên
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ảnh</TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Danh mục cha</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <div className="h-10 w-10 rounded border border-gray-200 overflow-hidden bg-gray-50">
                      <ImageWithFallback
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {cat.name}
                  </TableCell>
                  <TableCell>{cat.parentCategoryName || '-'}</TableCell>
                  <TableCell>
                    <StatusBadge status={cat.active} type="product" />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(cat)}
                    >
                      Sửa
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeletingCatId(cat.id)}
                    >
                      Xoá
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
        title={editingCategory ? `Sửa danh mục: ${editingCategory.name}` : 'Thêm danh mục mới'}
        maxWidth="md"
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
              onClick={handleSaveCategory}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              Lưu
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <Input
            label="Tên danh mục"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Rau ăn lá"
          />

          <Select
            label="Danh mục cha (tuỳ chọn)"
            value={parentCategoryId ?? ''}
            onChange={(e) => setParentCategoryId(parseInt(e.target.value, 10) || null)}
          >
            <option value="">-- Không có (Danh mục gốc) --</option>
            {categories
              .filter((c) => !editingCategory || c.id !== editingCategory.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </Select>

          <div className="pt-2">
            <Switch
              label="Hoạt động"
              checked={active}
              onChange={setActive}
            />
          </div>

          {editingCategory && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">Hình ảnh đại diện:</p>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded border overflow-hidden bg-gray-50 shrink-0">
                  <ImageWithFallback
                    src={editingCategory.image}
                    alt={editingCategory.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <ImageUploader
                  onFileSelect={handleUploadImage}
                  label=""
                  disabled={uploadImageMutation.isPending}
                />
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={deletingCatId !== null}
        onClose={() => setDeletingCatId(null)}
        onConfirm={handleConfirmDelete}
        title="Xoá danh mục?"
        message="Bạn có chắc chắn muốn xoá danh mục này không? Các sản phẩm thuộc danh mục sẽ không bị xoá nhưng sẽ mất liên kết danh mục."
        confirmLabel="Xoá danh mục"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
export default AdminCategoriesPage;
