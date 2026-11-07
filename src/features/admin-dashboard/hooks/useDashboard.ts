import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const DASHBOARD_QUERY_KEYS = {
  stats: ['admin', 'dashboard', 'stats'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.stats,
    queryFn: () => dashboardApi.getStats(),
  });
}

