import React, { useState } from 'react';
import {
  useAdminCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from '@/features/coupons/hooks/useCoupons';
import { Coupon, DiscountType } from '@/types';
import { formatCurrency, formatDate } from '@/lib/format';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminCouponsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, isError, refetch } = useAdminCoupons(currentPage, 12);
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENT');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(0);
  const [maxDiscount, setMaxDiscount] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [active, setActive] = useState(true);

  // Confirm delete
  const [deletingCouponId, setDeletingCouponId] = useState<number | null>(null);

  const coupons = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setCode('');
    setName('');
    setDescription('');
    setDiscountType('PERCENT');
    setDiscountValue(10);
    setMinOrderValue(0);
    setMaxDiscount(0);
    setStartDate('');
    setEndDate('');
    setUsageLimit(100);
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setName(c.name);
    setDescription(c.description || '');
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinOrderValue(c.minOrderValue || 0);
    setMaxDiscount(c.maxDiscount || 0);
    setStartDate(c.startDate ? c.startDate.substring(0, 10) : '');
    setEndDate(c.endDate ? c.endDate.substring(0, 10) : '');
    setUsageLimit(c.usageLimit || 0);
    setActive(c.active);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || discountValue <= 0) return;

    const payload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      discountType,
      discountValue,
      minOrderValue: minOrderValue > 0 ? minOrderValue : undefined,
      maxDiscount: maxDiscount > 0 ? maxDiscount : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      usageLimit: usageLimit > 0 ? usageLimit : undefined,
      active,
    };

    if (editingCoupon) {
      await updateMutation.mutateAsync({ id: editingCoupon.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingCouponId) {
      deleteMutation.mutate(deletingCouponId, {
        onSuccess: () => setDeletingCouponId(null),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
          <p className="text-xs text-gray-500 mt-0.5">Tạo các chương trình khuyến mãi cho khách hàng</p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreate}>
          + Thêm coupon
        </Button>
      </div>

      {/* Bảng Coupon */}
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="md" label="Đang tải mã giảm giá..." />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : coupons.length === 0 ? (
        <EmptyState
          title="Chưa có mã giảm giá"
          description="Hiện chưa có coupon nào được tạo."
          action={
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              Tạo mã đầu tiên
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã coupon</TableHead>
                <TableHead>Tên chương trình</TableHead>
                <TableHead>Loại & Giá trị</TableHead>
                <TableHead>Thời hạn</TableHead>
                <TableHead>Lượt dùng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-bold text-primary-700">
                    {coupon.code}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {coupon.name}
                  </TableCell>
                  <TableCell>
                    {coupon.discountType === 'PERCENT'
                      ? `Giảm ${coupon.discountValue}%`
                      : `Giảm ${formatCurrency(coupon.discountValue)}`}
                  </TableCell>
                  <TableCell>
                    {coupon.endDate ? formatDate(coupon.endDate) : 'Không giới hạn'}
                  </TableCell>
                  <TableCell>
                    {coupon.usedCount ?? 0} / {coupon.usageLimit ?? '∞'}
                  </TableCell>
                  <TableCell>
                    {coupon.active ? (
                      <Badge variant="success">Hoạt động</Badge>
                    ) : (
                      <Badge variant="neutral">Tắt</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(coupon)}
                    >
                      Sửa
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeletingCouponId(coupon.id)}
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
        title={editingCoupon ? `Sửa mã: ${editingCoupon.code}` : 'Thêm mã giảm giá mới'}
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
              onClick={handleSaveCoupon}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              Lưu
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveCoupon} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mã giảm giá (Code)"
              required
              className="uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VD: FREESHIP10"
            />

            <Input
              label="Tên chương trình"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Khuyến mãi mừng hè"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Loại giảm giá"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountType)}
            >
              <option value="PERCENT">Phần trăm (%)</option>
              <option value="FIXED">Số tiền cố định (₫)</option>
            </Select>

            <Input
              label={discountType === 'PERCENT' ? 'Phần trăm giảm (%)' : 'Số tiền giảm (₫)'}
              type="number"
              required
              min={1}
              value={discountValue}
              onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Đơn hàng tối thiểu (₫)"
              type="number"
              min={0}
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(parseFloat(e.target.value) || 0)}
            />

            {discountType === 'PERCENT' && (
              <Input
                label="Giảm tối đa (₫)"
                type="number"
                min={0}
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(parseFloat(e.target.value) || 0)}
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ngày bắt đầu"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              label="Ngày kết thúc"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <Input
              label="Giới hạn số lượt dùng"
              type="number"
              min={0}
              value={usageLimit}
              onChange={(e) => setUsageLimit(parseInt(e.target.value, 10) || 0)}
              helper="Nhập 0 nếu không giới hạn"
            />

            <div className="pt-4">
              <Switch
                label="Đang hoạt động"
                checked={active}
                onChange={setActive}
              />
            </div>
          </div>

          <Textarea
            label="Mô tả điều kiện áp dụng"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Áp dụng cho mọi đơn hàng..."
          />
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={deletingCouponId !== null}
        onClose={() => setDeletingCouponId(null)}
        onConfirm={handleConfirmDelete}
        title="Xoá mã giảm giá?"
        message="Bạn có chắc chắn muốn xoá mã này không? Khách hàng sẽ không thể nhập mã này được nữa."
        confirmLabel="Xoá mã"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
export default AdminCouponsPage;
