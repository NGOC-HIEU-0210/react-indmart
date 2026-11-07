import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full text-center bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi không mong muốn</h2>
            <p className="text-sm text-gray-600 mb-6">
              Ứng dụng gặp sự cố trong quá trình kết xuất dữ liệu. Vui lòng tải lại trang.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => window.location.reload()}
              >
                Tải lại trang
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => (window.location.href = '/')}
              >
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

