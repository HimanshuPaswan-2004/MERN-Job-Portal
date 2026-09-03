import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Briefcase, Users } from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/recruiter/companies" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="text-blue-600 w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">My Companies</h2>
          </div>
          <p className="text-gray-600">Manage your company profiles and details.</p>
        </Link>
        
        <Link to="/recruiter/jobs" className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Briefcase className="text-green-600 w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">My Jobs</h2>
          </div>
          <p className="text-gray-600">Post new jobs and manage existing listings.</p>
        </Link>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border opacity-75 cursor-not-allowed">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="text-purple-600 w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">Applicants (Coming Soon)</h2>
          </div>
          <p className="text-gray-600">Review candidates who applied to your jobs.</p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
