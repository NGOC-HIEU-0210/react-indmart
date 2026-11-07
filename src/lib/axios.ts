import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import keycloak from './keycloak';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: gắn Bearer token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (keycloak.authenticated) {
      try {
        // Cập nhật token nếu còn dưới 30 giây hiệu lực
        await keycloak.updateToken(30);
      } catch (err) {
        // Refresh token thất bại -> yêu cầu đăng nhập lại
        keycloak.login();
        return Promise.reject(err);
      }

      if (keycloak.token) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: xử lý mã lỗi và thông báo
apiClient.interceptors.response.use(
  (response) => {
    // Nếu backend trả về ApiResponse { success: false, message: '...' } với mã 200
    const data = response.data;
    if (data && typeof data === 'object' && 'success' in data && data.success === false) {
      if (data.message) {
        toast.error(data.message);
      }
    }
    return response;
  },
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    if (!navigator.onLine) {
      toast.error('Không có kết nối mạng');
      return Promise.reject(error);
    }

    if (error.response) {
      const status = error.response.status;

      // 429: Quá nhiều yêu cầu
      if (status === 429) {
        const retryAfter = error.response.headers['retry-after'] || '5';
        toast.error(`Thao tác quá nhanh, thử lại sau ${retryAfter} giây`);
        return Promise.reject(error);
      }

      // Thông báo lỗi từ backend nếu có
      const resData = error.response.data;
      if (resData && typeof resData === 'object' && resData.message) {
        toast.error(resData.message);
      } else if (status === 401) {
        // Token hết hạn hoặc không hợp lệ
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      } else if (status === 403) {
        toast.error('Bạn không có quyền thực hiện thao tác này');
      } else if (status >= 500) {
        toast.error('Đã xảy ra lỗi máy chủ, vui lòng thử lại sau');
      }
    } else if (error.request) {
      toast.error('Không thể kết nối đến máy chủ backend');
    }

    return Promise.reject(error);
  }
);

export default apiClient;

