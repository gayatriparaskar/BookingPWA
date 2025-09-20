import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
  redirectTo?: string;
}

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <motion.div
      className="flex flex-col items-center space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="h-8 w-8 text-white" />
      </motion.div>
      <motion.div
        className="text-gray-600 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Verifying access...
      </motion.div>
    </motion.div>
  </div>
);

const UnauthorizedAccess = ({ requiredRole }: { requiredRole?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-4">
    <motion.div
      className="max-w-md w-full text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Shield className="h-10 w-10 text-white" />
      </motion.div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Access Restricted
      </h1>
      
      <p className="text-gray-600 mb-6">
        {requiredRole === 'admin' 
          ? 'You need administrator privileges to access this page.'
          : 'You need to be logged in to access this page.'
        }
      </p>
      
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => window.history.back()}
          className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Go Back
        </button>
        
        <button
          onClick={() => window.location.href = '/login'}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
        >
          Sign In
        </button>
      </motion.div>
    </motion.div>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user',
  redirectTo = '/login'
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <UnauthorizedAccess requiredRole={requiredRole} />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

// Higher-order component for protecting routes
export const withProtection = (
  Component: React.ComponentType<any>,
  requiredRole?: 'user' | 'admin'
) => {
  return (props: any) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
