import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export interface OrderStatusChartProps {
  pendingCount: number;
  completedCount: number;
  cancelledCount: number;
  totalCount: number;
}

export const OrderStatusChart: React.FC<OrderStatusChartProps> = ({
  pendingCount,
  completedCount,
  cancelledCount,
  totalCount,
}) => {
  const data = [
    { name: 'Chờ xử lý', count: pendingCount, color: '#f59e0b' },
    { name: 'Hoàn tất', count: completedCount, color: '#16a34a' },
    { name: 'Đã huỷ', count: cancelledCount, color: '#dc2626' },
    { name: 'Tổng đơn', count: totalCount, color: '#2563eb' },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4b5563' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#4b5563' }} />
          <Tooltip
            formatter={(val: number) => [`${val} đơn`, 'Số lượng']}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

