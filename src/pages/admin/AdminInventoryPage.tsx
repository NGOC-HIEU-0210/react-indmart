import React, { useState } from 'react';
import {
  useBatchesByProduct,
  useExpiringBatches,
  useWasteReport,
  useCreateBatch,
  useWriteOffExpired,
} from '@/features/inventory/hooks/useInventory';
import { useAdminProducts } from '@/features/products/hooks/useProducts';
import { formatCurrency, formatDate } from '@/lib/format';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminInventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('BY_PRODUCT');

  // Lấy danh sách sản phẩm để chọn
  const { data: prodData } = useAdminProducts(0, 100);
  const products = prodData?.data?.content || [];

  // Tab 1: Theo sản phẩm
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const effectiveProdId = selectedProductId || products[0]?.id || 0;
  const {
    data: batchesData,
    isLoading: isBatchesLoading,
    isError: isBatchesError,
    refetch: refetchBatches,
  } = useBatchesByProduct(effectiveProdId, 0);

  // Tab 2: Sắp hết hạn
  const [expiringDays, setExpiringDays] = useState<number>(2);
  const {
    data: expiringData,
    isLoading: isExpiringLoading,
    isError: isExpiringError,
    refetch: refetchExpiring,
  } = useExpiringBatches(expiringDays, 0);

  // Tab 3: Báo cáo hao hụt
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const {
    data: wasteData,
    isLoading: isWasteLoading,
    isError: isWasteError,
    refetch: refetchWaste,
  } = useWasteReport(fromDate || undefined, toDate || undefined);

  // Mutations
  const createBatchMutation = useCreateBatch();
  const writeOffMutation = useWriteOffExpired();

  // Modal nhập lô mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProductId, setModalProductId] = useState<number>(0);
  const [modalQuantity, setModalQuantity] = useState<number>(100);
  const [modalCostPrice, setModalCostPrice] = useState<number>(10000);
  const [modalExpiryDate, setModalExpiryDate] = useState<string>('');

  // Dialog xuất huỷ
  const [isWriteOffConfirmOpen, setIsWriteOffConfirmOpen] = useState(false);

  const tabs = [
    { id: 'BY_PRODUCT', label: 'Theo sản phẩm' },
    { id: 'EXPIRING', label: 'Sắp hết hạn' },
    { id: 'WASTE', label: 'Hao hụt & Hàng huỷ' },
  ];

  const handleOpenCreateModal = () => {
    setModalProductId(effectiveProdId || products[0]?.id || 0);
    setModalQuantity(100);
    setModalCostPrice(10000);
    setModalExpiryDate('');
    setIsModalOpen(true);
  };

  const handleSaveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalProductId || modalQuantity <= 0 || modalCostPrice < 0) return;

    await createBatchMutation.mutateAsync({
      productId: modalProductId,
      quantity: modalQuantity,
      costPrice: modalCostPrice,
      expiryDate: modalExpiryDate || undefined,
    });
    setIsModalOpen(false);
  };

  const handleConfirmWriteOff = () => {
    writeOffMutation.mutate(undefined, {
      onSuccess: () => setIsWriteOffConfirmOpen(false),
    });
  };

  const productBatches = batchesData?.data?.content || [];
  const expiringBatches = expiringData?.data?.content || [];
  const wasteReport = wasteData?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý kho hàng & Lô hàng</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Theo dõi từng lô hàng, ngày hết hạn và báo cáo thất thoát hao hụt
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleOpenCreateModal}>
          + Nhập lô mới
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: Theo sản phẩm */}
      {activeTab === 'BY_PRODUCT' && (
        <div className="space-y-4">
          <div className="max-w-md">
            <Select
              label="Chọn sản phẩm xem lô:"
              value={effectiveProdId}
              onChange={(e) => setSelectedProductId(parseInt(e.target.value, 10))}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Tồn kho: {p.stock ?? 0})
                </option>
              ))}
            </Select>
          </div>

          {isBatchesLoading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <Spinner size="md" label="Đang tải lô hàng..." />
            </div>
          ) : isBatchesError ? (
            <ErrorState onRetry={() => refetchBatches()} />
          ) : productBatches.length === 0 ? (
            <EmptyState
              title="Chưa có lô hàng nào"
              description="Sản phẩm này chưa được nhập lô nào trong kho."
              action={
                <Button variant="primary" size="sm" onClick={handleOpenCreateModal}>
                  Nhập lô đầu tiên
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lô</TableHead>
                  <TableHead>Ngày nhập</TableHead>
                  <TableHead>Hạn sử dụng</TableHead>
                  <TableHead>Còn / Ban đầu</TableHead>
                  <TableHead>Giá nhập</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono font-semibold text-gray-800">
                      #{batch.id}
                    </TableCell>
                    <TableCell>{formatDate(batch.receivedDate)}</TableCell>
                    <TableCell>
                      {batch.expiryDate ? (
                        <div>
                          <span>{formatDate(batch.expiryDate)}</span>
                          {batch.daysLeft !== undefined && (
                            <span className="block text-xs text-amber-600 font-medium">
                              (Còn {batch.daysLeft} ngày)
                            </span>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <strong>{batch.remainingQuantity}</strong> / {batch.initialQuantity}
                    </TableCell>
                    <TableCell>{formatCurrency(batch.costPrice)}</TableCell>
                    <TableCell>
                      <StatusBadge status={batch.status} type="batch" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* TAB 2: Sắp hết hạn */}
      {activeTab === 'EXPIRING' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-700">Lô sắp hết hạn trong:</span>
              <Select
                className="py-1 text-xs w-32"
                value={expiringDays}
                onChange={(e) => setExpiringDays(parseInt(e.target.value, 10))}
              >
                <option value={1}>1 ngày</option>
                <option value={2}>2 ngày</option>
                <option value={3}>3 ngày</option>
                <option value={5}>5 ngày</option>
                <option value={7}>7 ngày</option>
              </Select>
            </div>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setIsWriteOffConfirmOpen(true)}
              isLoading={writeOffMutation.isPending}
            >
              Xuất huỷ hàng hết hạn
            </Button>
          </div>

          {isExpiringLoading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <Spinner size="md" label="Đang kiểm tra các lô sắp hết hạn..." />
            </div>
          ) : isExpiringError ? (
            <ErrorState onRetry={() => refetchExpiring()} />
          ) : expiringBatches.length === 0 ? (
            <EmptyState
              title="Không có lô nào sắp hết hạn"
              description={`Tuyệt vời! Không có lô hàng nào sắp quá hạn trong ${expiringDays} ngày tới.`}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lô</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Hạn sử dụng</TableHead>
                  <TableHead>Tồn hiện tại</TableHead>
                  <TableHead>Giá nhập</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono font-semibold">#{batch.id}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {batch.productName || `SP #${batch.productId}`}
                    </TableCell>
                    <TableCell>
                      <span className="text-red-600 font-semibold">{formatDate(batch.expiryDate)}</span>
                      {batch.daysLeft !== undefined && (
                        <span className="block text-xs text-amber-600">
                          (Còn {batch.daysLeft} ngày)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-bold">{batch.remainingQuantity}</TableCell>
                    <TableCell>{formatCurrency(batch.costPrice)}</TableCell>
                    <TableCell>
                      <StatusBadge status={batch.status} type="batch" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* TAB 3: Báo cáo hao hụt */}
      {activeTab === 'WASTE' && (
        <div className="space-y-6">
          {/* Bộ lọc ngày */}
          <div className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-lg border border-gray-200">
            <div className="w-full sm:w-44">
              <Input
                label="Từ ngày"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-44">
              <Input
                label="Đến ngày"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => refetchWaste()}
            >
              Xem báo cáo
            </Button>
          </div>

          {isWasteLoading ? (
            <div className="min-h-[30vh] flex items-center justify-center">
              <Spinner size="md" label="Đang tổng hợp báo cáo hao hụt..." />
            </div>
          ) : isWasteError ? (
            <ErrorState onRetry={() => refetchWaste()} />
          ) : !wasteReport ? (
            <EmptyState title="Không có dữ liệu báo cáo" />
          ) : (
            <div className="space-y-6">
              {/* Thẻ tóm tắt hao hụt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-4 bg-red-50/50 border-red-200">
                  <p className="text-xs font-semibold text-red-600 uppercase">
                    Tổng số lượng hao hụt
                  </p>
                  <p className="text-2xl font-bold text-red-700 mt-1">
                    {wasteReport.totalWastedQuantity} món
                  </p>
                </Card>

                <Card className="p-4 bg-red-50/50 border-red-200">
                  <p className="text-xs font-semibold text-red-600 uppercase">
                    Tổng giá trị thiệt hại
                  </p>
                  <p className="text-2xl font-bold text-red-700 mt-1">
                    {formatCurrency(wasteReport.totalLoss)}
                  </p>
                </Card>
              </div>

              {/* Bảng hao hụt theo sản phẩm */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Chi tiết theo từng sản phẩm:</h3>
                {wasteReport.items?.length === 0 ? (
                  <EmptyState title="Không có sản phẩm nào bị hao hụt trong giai đoạn này" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Số lượng huỷ</TableHead>
                        <TableHead className="text-right">Tổng thiệt hại</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wasteReport.items?.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell className="font-semibold text-gray-900">
                            {item.productName}
                          </TableCell>
                          <TableCell>{item.wastedQuantity}</TableCell>
                          <TableCell className="text-right font-bold text-red-600">
                            {formatCurrency(item.totalLoss)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Nhập lô mới */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nhập lô hàng mới"
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
              onClick={handleSaveBatch}
              isLoading={createBatchMutation.isPending}
            >
              Nhập kho
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveBatch} className="space-y-4">
          <Select
            label="Sản phẩm nhập kho"
            required
            value={modalProductId}
            onChange={(e) => setModalProductId(parseInt(e.target.value, 10))}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Số lượng nhập"
              type="number"
              required
              min={1}
              value={modalQuantity}
              onChange={(e) => setModalQuantity(parseInt(e.target.value, 10) || 1)}
            />

            <Input
              label="Giá vốn nhập kho (₫)"
              type="number"
              required
              min={0}
              value={modalCostPrice}
              onChange={(e) => setModalCostPrice(parseFloat(e.target.value) || 0)}
            />
          </div>

          <Input
            label="Hạn sử dụng (tuỳ chọn)"
            type="date"
            value={modalExpiryDate}
            onChange={(e) => setModalExpiryDate(e.target.value)}
            helper="Nếu bỏ trống, hệ thống sẽ tự tính theo số ngày shelfLifeDays của sản phẩm"
          />
        </form>
      </Modal>

      {/* Confirm Xuất huỷ */}
      <ConfirmDialog
        isOpen={isWriteOffConfirmOpen}
        onClose={() => setIsWriteOffConfirmOpen(false)}
        onConfirm={handleConfirmWriteOff}
        title="Xuất huỷ hàng hết hạn?"
        message="Hệ thống sẽ quét và xuất huỷ toàn bộ các lô hàng đã quá hạn sử dụng khỏi tồn kho. Thao tác này sẽ ghi nhận vào báo cáo hao hụt."
        confirmLabel="Xuất huỷ ngay"
        isLoading={writeOffMutation.isPending}
      />
    </div>
  );
};
export default AdminInventoryPage;
