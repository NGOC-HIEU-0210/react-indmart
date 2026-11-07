import React, { useState } from 'react';
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useSetProductImage,
  useAddProductImage,
  useDeleteProductImage,
} from '@/features/products/hooks/useProducts';
import { useActiveCategories } from '@/features/categories/hooks/useCategories';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/format';
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
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminProductsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');

  // Lấy dữ liệu sản phẩm và danh mục
  const { data, isLoading, isError, refetch } = useAdminProducts(currentPage, 12);
  const { data: catData } = useActiveCategories();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const setImageMutation = useSetProductImage();
  const addImageMutation = useAddProductImage();
  const deleteImageMutation = useDeleteProductImage();

  // State modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(7);
  const [active, setActive] = useState(true);

  // Confirm delete dialog
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  const categories = catData?.data?.content || [];
  const products = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  // Lọc sản phẩm theo keyword tìm kiếm ở client nếu backend phân trang
  const filteredProducts = keyword.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(keyword.trim().toLowerCase()))
    : products;

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setPrice(0);
    setDescription('');
    setCategoryId(categories[0]?.id);
    setShelfLifeDays(7);
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setDescription(p.description || '');
    setCategoryId(p.categoryId);
    setShelfLifeDays(p.shelfLifeDays || 7);
    setActive(p.active);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price < 0) return;

    if (editingProduct) {
      // Cập nhật
      await updateMutation.mutateAsync({
        id: editingProduct.id,
        data: {
          name: name.trim(),
          price,
          description: description.trim(),
          categoryId,
          shelfLifeDays,
          active,
        },
      });
      setIsModalOpen(false);
    } else {
      // Tạo mới
      const created = await createMutation.mutateAsync({
        name: name.trim(),
        price,
        description: description.trim(),
        categoryId,
        shelfLifeDays,
        active,
      });
      if (created?.data) {
        setEditingProduct(created.data);
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const handleUploadPrimaryImage = (file: File) => {
    if (!editingProduct) return;
    setImageMutation.mutate({ id: editingProduct.id, file });
  };

  const handleUploadGalleryImage = (file: File) => {
    if (!editingProduct) return;
    addImageMutation.mutate({ id: editingProduct.id, file });
  };

  const handleDeleteGalleryImage = (imageId: number) => {
    deleteImageMutation.mutate(imageId);
  };

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      deleteMutation.mutate(deletingProductId, {
        onSuccess: () => setDeletingProductId(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-xs text-gray-500 mt-0.5">Danh sách toàn bộ nông sản, rau củ quả trong kho</p>
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
          placeholder="Tìm theo tên sản phẩm..."
        />
      </div>

      {/* Bảng sản phẩm */}
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="md" label="Đang tải dữ liệu sản phẩm..." />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description={keyword ? 'Không có sản phẩm nào khớp với từ khoá.' : 'Hiện chưa có sản phẩm nào.'}
          action={
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              Thêm sản phẩm đầu tiên
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ảnh</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá bán</TableHead>
                <TableHead>Kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded border border-gray-200 overflow-hidden bg-gray-50">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {product.name}
                  </TableCell>
                  <TableCell>{product.categoryName || '-'}</TableCell>
                  <TableCell className="font-bold text-primary-700">
                    {formatCurrency(product.currentPrice ?? product.price)}
                  </TableCell>
                  <TableCell>
                    <span className={product.stock && product.stock > 0 ? 'font-medium' : 'text-red-600 font-semibold'}>
                      {product.stock ?? 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={product.active} type="product" />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(product)}
                    >
                      Sửa
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeletingProductId(product.id)}
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

      {/* Modal Thêm/Sửa */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Sửa sản phẩm: ${editingProduct.name}` : 'Thêm sản phẩm mới'}
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
              onClick={handleSaveProduct}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              Lưu
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <Input
            label="Tên sản phẩm"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Cà chua Đà Lạt"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Giá bán (₫)"
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            />

            <Select
              label="Danh mục"
              value={categoryId || ''}
              onChange={(e) => setCategoryId(parseInt(e.target.value, 10) || undefined)}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Số ngày hạn dùng (shelfLifeDays)"
              type="number"
              min={1}
              value={shelfLifeDays}
              onChange={(e) => setShelfLifeDays(parseInt(e.target.value, 10) || 1)}
              helper="Mặc định áp dụng cho các lô hàng nhập mới"
            />

            <div className="pt-4">
              <Switch
                label="Đang bán"
                checked={active}
                onChange={setActive}
              />
            </div>
          </div>

          <Textarea
            label="Mô tả sản phẩm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Thông tin nguồn gốc, quy trình trồng..."
          />

          {/* Phần Upload hình ảnh (khi đã có id sản phẩm) */}
          {editingProduct ? (
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Quản lý hình ảnh
              </h4>

              {/* Ảnh đại diện chính */}
              <div>
                <p className="text-xs text-gray-500 mb-1.5 font-medium">Ảnh đại diện chính:</p>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded border overflow-hidden bg-gray-50 shrink-0">
                    <ImageWithFallback
                      src={editingProduct.image}
                      alt={editingProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ImageUploader
                    onFileSelect={handleUploadPrimaryImage}
                    label=""
                    disabled={setImageMutation.isPending}
                  />
                </div>
              </div>

              {/* Ảnh phụ */}
              <div>
                <p className="text-xs text-gray-500 mb-1.5 font-medium">Thêm ảnh phụ:</p>
                <ImageUploader
                  onFileSelect={handleUploadGalleryImage}
                  label=""
                  disabled={addImageMutation.isPending}
                />

                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editingProduct.images.map((img) => (
                      <div key={img.id} className="relative h-16 w-16 rounded border overflow-hidden bg-gray-50">
                        <ImageWithFallback
                          src={img.url}
                          alt="Ảnh phụ"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-0.5 text-[10px]"
                          title="Xoá ảnh này"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded border border-amber-200">
              * Lưu thông tin sản phẩm trước, sau đó bạn có thể tải lên ảnh đại diện và ảnh phụ.
            </p>
          )}
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={deletingProductId !== null}
        onClose={() => setDeletingProductId(null)}
        onConfirm={handleConfirmDelete}
        title="Xoá sản phẩm?"
        message="Bạn có chắc chắn muốn xoá sản phẩm này không? Thao tác này có thể ảnh hưởng đến các đơn hàng đã mua."
        confirmLabel="Xoá sản phẩm"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
export default AdminProductsPage;
