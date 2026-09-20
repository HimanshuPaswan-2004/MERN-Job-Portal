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
    { name: 'Applicants', path: '/recruiter/applicants', icon: Users },
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
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            Job<span className="text-[#f9571c]">Portal</span>
          </span>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-10 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidates, jobs, companies..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-700 font-medium"
            />
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#f9571c] rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200 cursor-pointer">
            <div className="w-9 h-9 bg-[#23272e] text-white font-black rounded-full flex items-center justify-center text-sm shadow-xs">
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
              const isActive = item.path !== '#' && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-[#fff5ee] text-[#f9571c] font-bold shadow-2xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#f9571c]' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Sidebar Employer Promotion Card */}
            <div className="mt-8 p-4 bg-[#fff5ee] rounded-2xl border border-orange-100 text-left relative overflow-hidden space-y-2">
              <div className="flex items-center justify-center py-2 relative">
                <svg className="w-28 h-24" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background burst rays */}
                  <path d="M20 20 L25 15 M95 20 L90 15 M15 50 L10 50 M105 50 L110 50" stroke="#f9571c" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                  {/* Person head */}
                  <circle cx="60" cy="30" r="10" fill="#2d3748" />
                  <path d="M54 26 C54 22 66 22 66 26 C66 28 64 30 60 30 C56 30 54 28 54 26 Z" fill="#1a202c" />
                  {/* Body / Shirt */}
                  <path d="M42 58 C42 44 78 44 78 58 L78 68 L42 68 Z" fill="#f9571c" />
                  {/* Arms & Laptop */}
                  <path d="M45 52 L35 62 L55 62" stroke="#f9571c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M75 52 L85 62 L65 62" stroke="#f9571c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Laptop Base & Screen */}
                  <rect x="48" y="52" width="24" height="15" rx="2" fill="#334155" />
                  <polygon points="44,67 76,67 74,70 46,70" fill="#64748b" />
                </svg>
              </div>
              <h4 className="font-extrabold text-gray-900 text-sm leading-snug">
                Find the right <br /> talent faster.
              </h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Post jobs, review applicants and build amazing teams.
              </p>
              {/* Curved orange brush accent */}
              <div className="pt-1">
                <svg className="w-20 h-3 text-[#f9571c]" viewBox="0 0 80 12" fill="none">
                  <path d="M2 8 Q 40 1 78 7" stroke="#f9571c" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
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
