import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStats } from '@/features/admin-dashboard/hooks/useDashboard';
import { useExpiringBatches } from '@/features/inventory/hooks/useInventory';
import { OrderStatusChart } from '@/features/admin-dashboard/components/OrderStatusChart';
import { formatCurrency } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';

export const AdminDashboardPage: React.FC = () => {
  const { data: statsData, isLoading: isStatsLoading, isError, refetch } = useDashboardStats();
  const { data: expiringData } = useExpiringBatches(2, 0);

  const stats = statsData?.data;
  const expiringBatches = expiringData?.data?.content || [];
  const expiringCount = expiringData?.data?.totalElements ?? expiringBatches.length;

  if (isStatsLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" label="Đang tải dữ liệu tổng quan..." />
      </div>
    );
  }

  if (isError || !stats) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const statCards = [
    { label: 'Tổng đơn hàng', value: stats.totalOrders, color: 'text-gray-900', bg: 'bg-white' },
    { label: 'Đơn chờ xử lý', value: stats.pendingOrders, color: 'text-amber-600', bg: 'bg-amber-50/50' },
    { label: 'Đơn hoàn tất', value: stats.completedOrders, color: 'text-green-700', bg: 'bg-green-50/50' },
    { label: 'Đơn đã huỷ', value: stats.cancelledOrders, color: 'text-red-600', bg: 'bg-red-50/50' },
    { label: 'Sản phẩm', value: stats.totalProducts, color: 'text-blue-700', bg: 'bg-blue-50/50' },
    { label: 'Người dùng', value: stats.totalUsers, color: 'text-purple-700', bg: 'bg-purple-50/50' },
  ];

  return (
    <div className="space-y-6">
      {/* Thẻ Doanh thu tổng */}
      <Card className="p-6 bg-primary-700 text-white border-primary-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-200 font-semibold">
              Tổng doanh thu hoàn tất
            </p>
            <h2 className="text-3xl font-extrabold mt-1 text-white">
              {formatCurrency(stats.totalRevenue)}
            </h2>
          </div>
          <div className="text-xs text-primary-200">
            Từ {stats.completedOrders} đơn hàng đã giao thành công
          </div>
        </div>
      </Card>

      {/* 6 Thẻ số liệu */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <Card key={idx} className={`p-4 border border-gray-200 ${card.bg}`}>
            <p className="text-xs text-gray-500 font-medium truncate">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </Card>
        ))}
      </div>

      {/* Cảnh báo lô sắp hết hạn */}
      {expiringCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-50 border border-amber-300 rounded-lg">
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Cảnh báo lô hàng sắp hết hạn
            </h3>
            <p className="text-xs text-amber-700 mt-0.5">
              Có <span className="font-bold">{expiringCount}</span> lô hàng sắp hết hạn trong 2 ngày tới. Cần kiểm tra để giảm giá giải cứu hoặc xuất huỷ.
            </p>
          </div>
          <Link to="/admin/inventory">
            <Button variant="outline" size="sm" className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 shrink-0">
              Xem kho hàng
            </Button>
          </Link>
        </div>
      )}

      {/* Biểu đồ số đơn theo trạng thái */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Số lượng đơn hàng theo trạng thái
        </h3>
        <p className="text-xs text-gray-500 mb-4">Biểu đồ phân bố các đơn hàng trong hệ thống</p>
        <OrderStatusChart
          pendingCount={stats.pendingOrders}
          completedCount={stats.completedOrders}
          cancelledCount={stats.cancelledOrders}
          totalCount={stats.totalOrders}
        />
      </Card>
    </div>
  );
};
export default AdminDashboardPage;
