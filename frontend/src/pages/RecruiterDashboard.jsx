import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  PlusCircle,
  Users,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  FileText,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Plus,
  Lightbulb,
  ExternalLink,
  Loader2
} from 'lucide-react';

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [timeRange, setTimeRange] = useState('Last 8 Months');
  
  // Dashboard state
  const [dashData, setDashData] = useState({
    stats: {
      activeJobs: 8,
      activeJobsThisMonth: 2,
      totalApplicants: 124,
      applicantsThisMonth: 18,
      inInterviews: 12,
      interviewsThisMonth: 5,
      hiredCandidates: 5,
      hiredThisMonth: 2
    },
    applicationsOverTime: [
      { month: 'Jan', count: 10 },
      { month: 'Feb', count: 15 },
      { month: 'Mar', count: 15 },
      { month: 'Apr', count: 20 },
      { month: 'May', count: 21 },
      { month: 'Jun', count: 26 },
      { month: 'Jul', count: 28 },
      { month: 'Aug', count: 33 }
    ],
    applicationsByStatus: {
      Applied: 45,
      'In Review': 28,
      Shortlisted: 18,
      Interview: 12,
      Offered: 5,
      Rejected: 16
    },
    recentApplicants: [
      { id: '1', name: 'Rahul Sharma', jobTitle: 'Software Engineer', appliedOn: '12 Aug 2025', status: 'In Review', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      { id: '2', name: 'Priya Verma', jobTitle: 'Frontend Developer', appliedOn: '11 Aug 2025', status: 'Shortlisted', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
      { id: '3', name: 'Aman Kumar', jobTitle: 'Backend Developer', appliedOn: '10 Aug 2025', status: 'Applied', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
      { id: '4', name: 'Sneha Gupta', jobTitle: 'Product Designer', appliedOn: '09 Aug 2025', status: 'Interview', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
      { id: '5', name: 'Aditya Singh', jobTitle: 'Data Scientist', appliedOn: '08 Aug 2025', status: 'In Review', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' }
    ],
    recentJobs: [
      { id: '1', title: 'Software Engineer', applicantsCount: 28, status: 'Active' },
      { id: '2', title: 'Frontend Developer', applicantsCount: 18, status: 'Active' },
      { id: '3', title: 'Backend Developer', applicantsCount: 12, status: 'Active' },
      { id: '4', title: 'Product Designer', applicantsCount: 10, status: 'Active' },
      { id: '5', title: 'Data Scientist', applicantsCount: 8, status: 'Active' }
    ],
    company: {
      name: 'TechNova Solutions',
      industry: 'IT Services & Consulting',
      location: 'Bangalore, India',
      jobsCount: 8,
      applicantsCount: 124,
      hiredCount: 5
    }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await axios.get('/api/applications/recruiter-dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success && response.data.data) {
        const fetched = response.data.data;
        setDashData(prev => ({
          stats: {
            activeJobs: fetched.stats.activeJobs || prev.stats.activeJobs,
            activeJobsThisMonth: fetched.stats.activeJobsThisMonth || prev.stats.activeJobsThisMonth,
            totalApplicants: fetched.stats.totalApplicants || prev.stats.totalApplicants,
            applicantsThisMonth: fetched.stats.applicantsThisMonth || prev.stats.applicantsThisMonth,
            inInterviews: fetched.stats.inInterviews || prev.stats.inInterviews,
            interviewsThisMonth: fetched.stats.interviewsThisMonth || prev.stats.interviewsThisMonth,
            hiredCandidates: fetched.stats.hiredCandidates || prev.stats.hiredCandidates,
            hiredThisMonth: fetched.stats.hiredThisMonth || prev.stats.hiredThisMonth,
          },
          applicationsOverTime: (fetched.applicationsOverTime && fetched.applicationsOverTime.length > 0)
            ? fetched.applicationsOverTime
            : prev.applicationsOverTime,
          applicationsByStatus: fetched.applicationsByStatus || prev.applicationsByStatus,
          recentApplicants: (fetched.recentApplicants && fetched.recentApplicants.length > 0)
            ? fetched.recentApplicants.map((item, idx) => ({
                id: item._id || String(idx),
                name: item.candidateName,
                jobTitle: item.jobTitle,
                appliedOn: item.appliedOn ? new Date(item.appliedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '12 Aug 2025',
                status: item.status || 'Applied',
                photo: item.candidatePhoto || prev.recentApplicants[idx % 5]?.photo
              }))
            : prev.recentApplicants,
          recentJobs: (fetched.recentJobs && fetched.recentJobs.length > 0)
            ? fetched.recentJobs.map((item, idx) => ({
                id: item._id || String(idx),
                title: item.title,
                applicantsCount: item.applicantsCount || 0,
                status: item.status === 'active' ? 'Active' : (item.status || 'Active')
              }))
            : prev.recentJobs,
          company: fetched.company ? {
            name: fetched.company.name || prev.company.name,
            industry: fetched.company.industry || prev.company.industry,
            location: fetched.company.location || prev.company.location,
            jobsCount: fetched.company.jobsCount || prev.company.jobsCount,
            applicantsCount: fetched.company.applicantsCount || prev.company.applicantsCount,
            hiredCount: fetched.company.hiredCount || prev.company.hiredCount,
          } : prev.company
        }));
      }
    } catch (err) {
      console.log('Using default recruiter dashboard initial view', err);
    } finally {
      setLoading(false);
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Review':
        return <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md">In Review</span>;
      case 'Shortlisted':
        return <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-md">Shortlisted</span>;
      case 'Applied':
        return <span className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 rounded-md flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Applied</span>;
      case 'Interview':
        return <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">Interview</span>;
      case 'Active':
        return <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">Active</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-md">{status}</span>;
    }
  };

  // Donut chart calculations
  const statusData = [
    { label: 'Applied', value: dashData.applicationsByStatus.Applied || 45, color: '#f97316' },
    { label: 'In Review', value: dashData.applicationsByStatus['In Review'] || 28, color: '#3b82f6' },
    { label: 'Shortlisted', value: dashData.applicationsByStatus.Shortlisted || 18, color: '#a855f7' },
    { label: 'Interview', value: dashData.applicationsByStatus.Interview || 12, color: '#10b981' },
    { label: 'Offered', value: dashData.applicationsByStatus.Offered || 5, color: '#eab308' },
    { label: 'Rejected', value: dashData.applicationsByStatus.Rejected || 16, color: '#ef4444' }
  ];

  const totalStatusCount = statusData.reduce((acc, curr) => acc + curr.value, 0);

  // Calculate SVG donut stroke offsets
  let cumulativePercent = 0;
  const donutArcs = statusData.map(item => {
    const percent = totalStatusCount > 0 ? (item.value / totalStatusCount) : 0;
    const strokeDasharray = `${percent * 283} 283`;
    const strokeDashoffset = -cumulativePercent * 283;
    cumulativePercent += percent;
    return { ...item, strokeDasharray, strokeDashoffset };
  });

  // Calculate line chart points
  const chartPoints = dashData.applicationsOverTime.map((pt, i) => {
    const x = 40 + i * (390 / (dashData.applicationsOverTime.length - 1 || 1));
    const maxVal = Math.max(...dashData.applicationsOverTime.map(d => d.count), 40);
    const y = 140 - (pt.count / maxVal) * 110;
    return { x, y, month: pt.month, count: pt.count };
  });

  const polylineString = chartPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="min-h-screen bg-[#faf6f0] text-gray-800 font-sans flex flex-col">
      {/* Top Header Navbar */}
      <header className="bg-white border-b border-gray-200/70 sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-xs">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-xs">
            <Briefcase className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">JobPortal</span>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidates, jobs, applications..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
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
        <aside className="w-64 bg-white border-r border-gray-200/70 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1.5">
            {[
              { name: 'Dashboard', icon: LayoutDashboard, path: '/recruiter/dashboard' },
              { name: 'My Companies', icon: Building2, path: '/recruiter/companies' },
              { name: 'My Jobs', icon: Briefcase, path: '/recruiter/jobs' },
              { name: 'Post a Job', icon: PlusCircle, path: '/recruiter/jobs/new' },
              { name: 'Applicants', icon: Users, path: '/recruiter/jobs' },
              { name: 'Messages', icon: MessageSquare, path: '#' },
              { name: 'Profile', icon: User, path: '/candidate/profile' },
              { name: 'Settings', icon: Settings, path: '#' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (item.path !== '#') navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-500 rounded-l-none'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}

            {/* Sidebar Talent Promotion Box */}
            <div className="mt-8 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 text-center relative overflow-hidden">
              <div className="w-16 h-12 mx-auto mb-2 relative">
                {/* Visual Illustration element */}
                <div className="w-12 h-10 bg-orange-500 rounded-lg mx-auto flex items-center justify-center text-white shadow-md">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>
              <h4 className="font-bold text-gray-900 text-xs mb-1">Find the best talent for your team</h4>
              <p className="text-[11px] text-gray-500 leading-snug mb-3">Post jobs, review applicants and hire faster.</p>
              <button
                onClick={() => navigate('/recruiter/jobs/new')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Post a Job</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-600 font-medium text-sm hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Welcome Banner Card */}
          <div className="bg-gradient-to-r from-[#ffe8d6] via-[#fff1e6] to-[#fff8f0] rounded-2xl p-6 border border-orange-100 flex items-center justify-between shadow-xs relative overflow-hidden">
            <div className="max-w-xl z-10">
              <span className="text-sm font-semibold text-orange-700 tracking-wide uppercase">Welcome back,</span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1 mb-2 tracking-tight">
                {user?.name || 'TechNova HR'}!
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Find. Evaluate. Hire. Build a Better Tomorrow.
              </p>
            </div>

            {/* Illustration Graphic Badge */}
            <div className="hidden lg:flex items-center gap-4 relative z-10 pr-4">
              <div className="text-right">
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-serif italic text-xs rounded-full shadow-2xs border border-amber-200 transform -rotate-2">
                  Great People Build Great Teams
                </div>
              </div>
              <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center p-3 relative">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg transform rotate-3">
                  <Briefcase className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active Jobs */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-2">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">{dashData.stats.activeJobs}</h3>
                <p className="text-xs font-medium text-gray-500">Active Jobs</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 pt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ {dashData.stats.activeJobsThisMonth} this month</span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Applicants */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">{dashData.stats.totalApplicants}</h3>
                <p className="text-xs font-medium text-gray-500">Total Applicants</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 pt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ {dashData.stats.applicantsThisMonth} this month</span>
                </div>
              </div>
            </div>

            {/* Card 3: In Interviews */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-2">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">{dashData.stats.inInterviews}</h3>
                <p className="text-xs font-medium text-gray-500">In Interviews</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 pt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ {dashData.stats.interviewsThisMonth} this month</span>
                </div>
              </div>
            </div>

            {/* Card 4: Hired Candidates */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900">{dashData.stats.hiredCandidates}</h3>
                <p className="text-xs font-medium text-gray-500">Hired Candidates</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 pt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>↑ {dashData.stats.hiredThisMonth} this month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Applications Over Time */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Applications Over Time</h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-hidden cursor-pointer"
                >
                  <option>Last 8 Months</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>

              {/* Line Chart SVG */}
              <div className="w-full h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 450 160">
                  {/* Grid Lines */}
                  {[30, 65, 100, 135].map((yVal, idx) => (
                    <line key={idx} x1="30" y1={yVal} x2="430" y2={yVal} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  ))}

                  {/* Y Axis Labels */}
                  <text x="15" y="35" fontSize="9" fill="#94a3b8">40</text>
                  <text x="15" y="70" fontSize="9" fill="#94a3b8">30</text>
                  <text x="15" y="105" fontSize="9" fill="#94a3b8">20</text>
                  <text x="15" y="140" fontSize="9" fill="#94a3b8">10</text>
                  <text x="22" y="158" fontSize="9" fill="#94a3b8">0</text>

                  {/* Gradient Area Fill */}
                  <defs>
                    <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {chartPoints.length > 0 && (
                    <polygon
                      points={`40,140 ${polylineString} 430,140`}
                      fill="url(#orangeGradient)"
                    />
                  )}

                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylineString}
                  />

                  {/* Dots & Month Labels */}
                  {chartPoints.map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#f97316" strokeWidth="2.5" />
                      <text x={pt.x} y="158" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="500">
                        {pt.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Chart 2: Applications by Status */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs flex flex-col justify-between">
              <h3 className="font-bold text-gray-900 text-sm mb-4">Applications by Status</h3>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* SVG Donut */}
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f8fafc" strokeWidth="10" />
                    {donutArcs.map((arc, i) => (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={arc.color}
                        strokeWidth="10"
                        strokeDasharray={arc.strokeDasharray}
                        strokeDashoffset={arc.strokeDashoffset}
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold text-gray-900">{totalStatusCount || 124}</span>
                    <span className="text-[10px] font-medium text-gray-500">Applicants</span>
                  </div>
                </div>

                {/* Status Color Legend */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-1 w-full">
                  {statusData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="text-gray-600 font-medium text-[11px] truncate max-w-[70px]">{item.label}</span>
                      </div>
                      <span className="font-bold text-gray-900 text-xs">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Applicants */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold text-gray-900 text-sm">Recent Applicants</h3>
                </div>
                <button
                  onClick={() => navigate('/recruiter/jobs')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-gray-400 uppercase border-b border-gray-100">
                      <th className="pb-3 font-semibold">Candidate</th>
                      <th className="pb-3 font-semibold">Job Title</th>
                      <th className="pb-3 font-semibold">Applied On</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-medium">
                    {dashData.recentApplicants.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 flex items-center gap-2.5">
                          <img
                            src={app.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={app.name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                          <span className="font-bold text-gray-900">{app.name}</span>
                        </td>
                        <td className="py-3 text-gray-600">{app.jobTitle}</td>
                        <td className="py-3 text-gray-500 text-[11px]">{app.appliedOn}</td>
                        <td className="py-3">{getStatusBadge(app.status)}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => navigate('/recruiter/jobs')}
                            className="px-2.5 py-1 text-[11px] font-bold text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold text-gray-900 text-sm">Recent Jobs</h3>
                </div>
                <button
                  onClick={() => navigate('/recruiter/jobs')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-gray-400 uppercase border-b border-gray-100">
                      <th className="pb-3 font-semibold">Job Title</th>
                      <th className="pb-3 text-center font-semibold">Applicants</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-medium">
                    {dashData.recentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 font-bold text-gray-900">{job.title}</td>
                        <td className="py-3.5 text-center font-semibold text-gray-700">{job.applicantsCount}</td>
                        <td className="py-3.5">{getStatusBadge(job.status)}</td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => navigate('/recruiter/jobs')}
                            className="px-2.5 py-1 text-[11px] font-bold text-orange-600 border border-orange-200 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar Panel */}
        <aside className="w-72 bg-white border-l border-gray-200/70 p-5 space-y-6 hidden xl:block shrink-0">
          {/* Quick Actions Card */}
          <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/60 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm">Quick Actions</h3>

            <div className="space-y-2">
              <button
                onClick={() => navigate('/recruiter/jobs/new')}
                className="w-full bg-white hover:bg-orange-50/50 p-2.5 rounded-xl border border-gray-200 text-left flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Post a New Job</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </button>

              <button
                onClick={() => navigate('/recruiter/companies/new')}
                className="w-full bg-white hover:bg-orange-50/50 p-2.5 rounded-xl border border-gray-200 text-left flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">Create Company</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </button>

              <button
                onClick={() => navigate('/recruiter/jobs')}
                className="w-full bg-white hover:bg-orange-50/50 p-2.5 rounded-xl border border-gray-200 text-left flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">View All Jobs</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </button>

              <button
                onClick={() => navigate('/recruiter/jobs')}
                className="w-full bg-white hover:bg-orange-50/50 p-2.5 rounded-xl border border-gray-200 text-left flex items-center justify-between transition-colors shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-orange-500 text-white rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">View Applicants</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </button>
            </div>
          </div>

          {/* My Company Card */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-2xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm">My Company</h3>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-900 text-orange-500 font-extrabold text-xl rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                {dashData.company.name.charAt(0)}
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="font-bold text-gray-900 text-xs truncate">{dashData.company.name}</h4>
                <p className="text-[11px] text-gray-500 truncate">{dashData.company.industry}</p>
                <p className="text-[10px] font-medium text-gray-400">{dashData.company.location}</p>
              </div>
            </div>

            {/* Company Mini Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
              <div className="bg-gray-50 p-2 rounded-xl">
                <div className="font-extrabold text-gray-900 text-sm">{dashData.company.jobsCount}</div>
                <div className="text-[10px] text-gray-500 font-medium">Jobs</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl">
                <div className="font-extrabold text-gray-900 text-sm">{dashData.company.applicantsCount}</div>
                <div className="text-[10px] text-gray-500 font-medium">Applicants</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl">
                <div className="font-extrabold text-gray-900 text-sm">{dashData.company.hiredCount}</div>
                <div className="text-[10px] text-gray-500 font-medium">Hired</div>
              </div>
            </div>

            <button
              onClick={() => navigate('/recruiter/companies')}
              className="w-full py-2 px-3 border border-orange-200 hover:bg-orange-50 text-orange-600 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Manage Company</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Inspirational Tip Banner */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/70 space-y-2 relative overflow-hidden">
            <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 fill-amber-300 stroke-[2]" />
            </div>
            <h4 className="font-serif italic font-bold text-gray-900 text-xs leading-snug">
              Good hires drive great growth!
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Keep posting quality jobs and connect with top talent.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
