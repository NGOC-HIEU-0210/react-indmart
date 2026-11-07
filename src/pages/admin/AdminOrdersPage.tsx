import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminOrders, useOrderStatuses } from '@/features/orders/hooks/useOrders';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SearchBox } from '@/components/common/SearchBox';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminOrdersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>(undefined);

  // Lấy danh sách trạng thái
  const { data: statusesData } = useOrderStatuses();
  const statuses = statusesData?.data || [];

  // Lấy danh sách đơn hàng
  const { data, isLoading, isError, refetch } = useAdminOrders({
    keyword: keyword.trim() || undefined,
    statusId: selectedStatusId,
    page: currentPage,
    size: 15,
  });

  const orders = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-xs text-gray-500 mt-0.5">Theo dõi, duyệt đơn và cập nhật tiến trình giao nhận</p>
      </div>

      {/* Bộ lọc: Tìm kiếm + Chọn trạng thái */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <SearchBox
            value={keyword}
            onChange={(val) => {
              setKeyword(val);
              setCurrentPage(0);
            }}
            placeholder="Tìm theo mã đơn, tên khách, SĐT..."
          />
        </div>

        <div className="w-full sm:w-56 shrink-0">
          <Select
            value={selectedStatusId || ''}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setSelectedStatusId(isNaN(val) ? undefined : val);
              setCurrentPage(0);
            }}
          >
            <option value="">Trạng thái: Tất cả</option>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Spinner size="md" label="Đang tải danh sách đơn hàng..." />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Không tìm thấy đơn hàng"
          description={
            keyword || selectedStatusId
              ? 'Không có đơn hàng nào khớp với điều kiện lọc.'
              : 'Hiện chưa có đơn hàng nào trong hệ thống.'
          }
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thanh toán</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-bold text-primary-700">
                    {order.orderCode}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.phone}</p>
                  </TableCell>
                  <TableCell>{formatDateTime(order.orderDate)}</TableCell>
                  <TableCell className="font-bold text-gray-900">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} type="order" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Xem
                      </Button>
                    </Link>
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
    </div>
  );
};
export default AdminOrdersPage;
