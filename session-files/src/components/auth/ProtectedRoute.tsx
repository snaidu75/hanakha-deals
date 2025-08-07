import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'customer' | 'company' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
    );
  }

  if (!user) {
    console.log('🔒 No user found, redirecting to login');
    return <Navigate to={`/${userType}/login`} replace />;
  }

  if (user.userType !== userType) {
    console.log('🔒 User type mismatch, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Check if customer needs to complete verification or payment
  if (userType === 'customer' && user.userType === 'customer') {
    // In demo mode, all users have active plans
    // No verification or payment checks needed
  }

  return <>{children}</>;
};

export default ProtectedRoute;