import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#faf6f0] text-gray-600 font-medium">
        <div className="w-10 h-10 border-4 border-[#f9571c] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const targetPath = user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard';
    return <Navigate to={targetPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
