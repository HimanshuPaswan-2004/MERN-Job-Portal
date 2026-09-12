import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Search,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Building2,
  FileText,
  PlusCircle,
  Users,
  MessageSquare,
  User,
  Settings,
  LogOut,
  ArrowRight,
  Building
} from 'lucide-react';

const RecruiterLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'My Companies', path: '/recruiter/companies', icon: Building2 },
    { name: 'My Jobs', path: '/recruiter/jobs', icon: FileText },
    { name: 'Post a Job', path: '/recruiter/jobs/new', icon: PlusCircle },
    { name: 'Applicants', path: '/recruiter/jobs', icon: Users },
    { name: 'Messages', path: '#', icon: MessageSquare },
    { name: 'Profile', path: '/candidate/profile', icon: User },
    { name: 'Settings', path: '#', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#faf6f0] text-gray-800 font-sans flex flex-col">
      {/* Top Header Navbar */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-xs">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#f9571c] rounded-xl flex items-center justify-center text-white shadow-xs">
            <Briefcase className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">JobPortal</span>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-10 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidates, jobs, companies..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#f9571c] rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200 cursor-pointer">
            <div className="w-10 h-10 bg-gray-900 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
            <div className="hidden sm:block text-left">
              <h4 className="text-xs font-bold text-gray-900 leading-snug">{user?.name || 'TechNova HR'}</h4>
              <p className="text-[11px] font-medium text-gray-500">Recruiter</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200/80 p-4 flex flex-col justify-between shrink-0 sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-orange-50 text-[#f9571c] font-bold border-l-4 border-[#f9571c] rounded-l-none'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f9571c]' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Sidebar Employer Brand Promotion Card */}
            <div className="mt-8 p-4 bg-gradient-to-br from-orange-50/80 to-amber-50/80 rounded-2xl border border-orange-100 text-center relative overflow-hidden">
              <div className="w-16 h-12 mx-auto mb-2 flex items-center justify-center">
                <div className="w-12 h-10 bg-[#f9571c] rounded-xl flex items-center justify-center text-white shadow-sm relative">
                  <Building className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white">+</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 text-xs mb-1">Build your employer brand</h4>
              <p className="text-[11px] text-gray-500 leading-snug mb-3">Attract top talent with a strong company profile.</p>
              <button
                onClick={() => navigate('/recruiter/companies/new')}
                className="w-full bg-[#f9571c] hover:bg-[#e04810] text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Create Company</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Container */}
        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
