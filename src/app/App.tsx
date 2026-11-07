import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from './providers/QueryClientProvider';
import { AuthProvider } from './providers/AuthContext';
import { ToastProvider } from './providers/ToastProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { router } from './router';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider>
        <AuthProvider>
          <ToastProvider />
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
export default App;

