import dayjs from 'dayjs';

/**
 * Định dạng tiền tệ theo chuẩn VND (ví dụ: 35.000 ₫)
 */
export function formatCurrency(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Định dạng ngày theo chuẩn dd/MM/yyyy
 */
export function formatDate(date?: string | Date | null, format = 'DD/MM/YYYY'): string {
  if (!date) return '-';
  const d = dayjs(date);
  if (!d.isValid()) return '-';
  return d.format(format);
}

/**
 * Định dạng ngày giờ theo chuẩn dd/MM/yyyy HH:mm
 */
export function formatDateTime(date?: string | Date | null, format = 'DD/MM/YYYY HH:mm'): string {
  if (!date) return '-';
  const d = dayjs(date);
  if (!d.isValid()) return '-';
  return d.format(format);
}

