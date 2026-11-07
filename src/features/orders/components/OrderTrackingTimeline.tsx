import React from 'react';
import { OrderTracking } from '@/types';
import { formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/common/StatusBadge';

export interface OrderTrackingTimelineProps {
  trackingList?: OrderTracking[];
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ trackingList = [] }) => {
  if (!trackingList || trackingList.length === 0) {
    return <p className="text-sm text-gray-500 italic">Chưa có thông tin theo dõi cho đơn hàng này.</p>;
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
      {trackingList.map((track, idx) => (
        <div key={idx} className="relative">
          {/* Chấm tròn mốc thời gian */}
          <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-primary-600 ring-4 ring-white" />

          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={track.status} type="order" />
              <span className="text-xs text-gray-400">{formatDateTime(track.time)}</span>
            </div>
            {track.note && (
              <p className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                {track.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

