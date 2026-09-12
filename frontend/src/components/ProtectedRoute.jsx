import React from 'react';
import { Outlet } from 'react-router-dom';
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

  // Allow seamless browsing across recruiter and candidate pages
  return <Outlet />;
};

export default ProtectedRoute;
