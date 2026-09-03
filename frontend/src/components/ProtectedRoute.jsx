import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Optionally navigate to a specific unauthorized page or the dashboard
    return <Navigate to={user.role === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
