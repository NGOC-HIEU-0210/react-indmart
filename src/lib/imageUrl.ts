const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090';

// Ảnh fallback SVG tinh gọn cho rau củ quả
export const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.7 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>';

/**
 * Trả về đường dẫn ảnh đầy đủ kết hợp với backend base URL
 */
export function imageUrl(path?: string | null): string {
  if (!path || path.trim() === '') {
    return FALLBACK_IMAGE;
  }

  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Đảm bảo có dấu gạch chéo
  const cleanBase = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  return `${cleanBase}${cleanPath}`;
}

