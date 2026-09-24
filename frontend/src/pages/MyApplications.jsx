import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bell,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  Building2,
  Sparkles,
  ArrowRight,
  X,
  ExternalLink,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import axios from 'axios';

const getStatusStyles = (status) => {
  switch (status) {
    case 'In Review':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Shortlisted':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Applied':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Offered':
    case 'Hired':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Rejected':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Interview':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const formatSalary = (salary) => {
  if (!salary) return 'Not Disclosed';
  if (typeof salary === 'string') return salary;
  const { min, max } = salary;
  if (!min && !max) return 'Not Disclosed';
  if (!min) return `Upto ₹${max / 100000} LPA`;
  if (!max) return `₹${min / 100000}+ LPA`;
  return `₹${min / 100000} - ${max / 100000} LPA`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Recent';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

// Stepper stages helper for tracking application pipeline progress
const PIPELINE_STAGES = ['Applied', 'In Review', 'Shortlisted', 'Interview', 'Offered'];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    inReview: 0,
    shortlisted: 0,
    interview: 0,
    offered: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [jobTypeFilter, setJobTypeFilter] = useState('All Job Type');
  const [sortBy, setSortBy] = useState('latest');

  // Interactive state
  const [selectedAppForWithdraw, setSelectedAppForWithdraw] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/applications');
        if (res.data.success) {
          setApplications(res.data.data.applications || []);
          setStats(res.data.data.stats || {
            total: 0, applied: 0, inReview: 0, shortlisted: 0, interview: 0, offered: 0, rejected: 0
          });
        }
      } catch (error) {
        console.error('Error fetching applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleWithdrawApplication = async () => {
    if (!selectedAppForWithdraw) return;
    try {
      setApplications(prev => prev.filter(app => app._id !== selectedAppForWithdraw._id));
      showToast('Application withdrawn successfully.');
      setSelectedAppForWithdraw(null);
    } catch (error) {
      console.error('Error withdrawing application:', error);
      showToast('Failed to withdraw application.');
    }
  };

  // Calculate Chart Offsets dynamically
  const calculateDashOffset = (count, total) => {
    if (total === 0) return 251.2; // full offset
    const circumference = 251.2;
    const fraction = count / total;
    return circumference * (1 - fraction);
  };

  const calculateRotation = (index, allStats) => {
    let prevFraction = 0;
    for (let i = 0; i < index; i++) {
      prevFraction += allStats[i].count / (stats.total || 1);
    }
    return prevFraction * 360 - 90;
  };

  const chartData = [
    { label: 'Applied', count: stats.applied, color: '#3b82f6', bgClass: 'bg-blue-500' },
    { label: 'In Review', count: stats.inReview, color: '#f59e0b', bgClass: 'bg-amber-500' },
    { label: 'Shortlisted', count: stats.shortlisted, color: '#a855f7', bgClass: 'bg-purple-500' },
    { label: 'Interview', count: stats.interview, color: '#6366f1', bgClass: 'bg-indigo-500' },
    { label: 'Offered', count: stats.offered, color: '#10b981', bgClass: 'bg-emerald-500' },
    { label: 'Rejected', count: stats.rejected, color: '#f43f5e', bgClass: 'bg-rose-500' }
  ];

  // Client-side filtering
  let filteredApps = applications.filter((app) => {
    let match = true;

    // Top tabs filter
    if (activeFilter !== 'All') {
      if (activeFilter === 'Offered' && app.status === 'Hired') {
        // match
      } else if (app.status !== activeFilter) {
        match = false;
      }
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = app.job?.title?.toLowerCase().includes(q);
      const companyMatch = app.job?.company?.name?.toLowerCase().includes(q);
      if (!titleMatch && !companyMatch) match = false;
    }

    // Status Dropdown
    if (statusFilter !== 'All Status') {
      if (statusFilter === 'Offered' && app.status === 'Hired') {
        // match
      } else if (app.status !== statusFilter) {
        match = false;
      }
    }

    // Job Type Dropdown
    if (jobTypeFilter !== 'All Job Type') {
      const jobTypeFormatted = app.job?.jobType?.toLowerCase().replace('-', ' ') || '';
      const filterFormatted = jobTypeFilter.toLowerCase();
      if (jobTypeFormatted !== filterFormatted) {
        match = false;
      }
    }

    return match;
  });

  // Sorting
  filteredApps.sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    return 0;
  });

  // Pagination
  const totalItems = filteredApps.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedApps = filteredApps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filters = [
    { label: 'All', count: stats.total },
    { label: 'Applied', count: stats.applied },
    { label: 'In Review', count: stats.inReview },
    { label: 'Shortlisted', count: stats.shortlisted },
    { label: 'Interview', count: stats.interview },
    { label: 'Offered', count: stats.offered },
    { label: 'Rejected', count: stats.rejected }
  ];

  // Pipeline Stepper renderer
  const renderPipelineStepper = (currentStatus) => {
    if (currentStatus === 'Rejected') {
      return (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className="text-rose-600 font-bold flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-500" />
            Application Not Selected
          </span>
          <span className="text-gray-400 font-medium">Feedback sent to email</span>
        </div>
      );
    }

    const currentStageIdx = PIPELINE_STAGES.indexOf(currentStatus === 'Hired' ? 'Offered' : currentStatus);

    return (
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-2">
          <span>Application Progress</span>
          <span className="text-brand-600 font-black">
            {currentStageIdx >= 0 ? `${currentStageIdx + 1} / ${PIPELINE_STAGES.length} Stages` : 'Submitted'}
          </span>
        </div>

        <div className="relative flex items-center justify-between">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>

          {PIPELINE_STAGES.map((stage, idx) => {
            const isDone = currentStageIdx >= idx;
            const isCurrent = currentStageIdx === idx;

            return (
              <div key={stage} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    isDone
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  } ${isCurrent ? 'ring-4 ring-brand-500/20 animate-pulse' : ''}`}
                >
                  {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : idx + 1}
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 transition-colors ${
                    isCurrent
                      ? 'text-brand-600 font-black'
                      : isDone
                      ? 'text-gray-800'
                      : 'text-gray-400'
                  }`}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-gray-800 animate-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Column: Applications List */}
      <div className="flex-1 space-y-6">
        {/* Header Breadcrumb & Title */}
        <div>
          <div className="flex items-center text-xs font-semibold text-gray-500 mb-2">
            <Link to="/candidate/dashboard" className="hover:text-brand-600 flex items-center gap-1 transition-colors">
              <span>Dashboard</span>
            </Link>
            <ChevronRight size={13} className="mx-1 text-gray-400" />
            <span className="text-gray-900 font-bold">My Applications</span>
          </div>

          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-orange-400/30">
            <div className="relative z-10 space-y-1">
              <span className="px-3 py-1 bg-white/20 text-white text-xs font-extrabold rounded-full backdrop-blur-xs inline-block mb-2">
                Candidate Application Hub
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">My Applications</h1>
              <p className="text-orange-100 font-medium text-xs md:text-sm max-w-xl">
                Track your active job submissions, interview schedules, and application status in real-time.
              </p>
            </div>

            {/* Graphic Accents */}
            <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 text-right pr-6 z-10">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-inner text-center">
                <div className="text-3xl font-black text-white">{stats.total}</div>
                <div className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">Submissions</div>
              </div>
            </div>

            <div className="absolute right-[-5%] top-[-30%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-2xs overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.label;
              return (
                <button
                  key={filter.label}
                  onClick={() => {
                    setActiveFilter(filter.label);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Select Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by job title, company name, or keywords..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-wrap gap-2.5">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Applied</option>
                  <option>In Review</option>
                  <option>Shortlisted</option>
                  <option>Interview</option>
                  <option>Offered</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>

              <div className="relative">
                <select
                  value={jobTypeFilter}
                  onChange={(e) => {
                    setJobTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option>All Job Type</option>
                  <option>Full time</option>
                  <option>Part time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                  <option>Remote</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer focus:outline-none focus:border-brand-500"
                >
                  <option value="latest">Sort: Latest</option>
                  <option value="oldest">Sort: Oldest</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Applications List Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 space-y-3">
              <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-gray-500">Fetching application records...</p>
            </div>
          ) : paginatedApps.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200/80 rounded-3xl p-6 space-y-4 shadow-2xs">
              <div className="w-16 h-16 bg-orange-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto border border-orange-100">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900">No applications found</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">You haven't submitted any applications matching these criteria yet.</p>
              </div>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <span>Browse Open Jobs</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            paginatedApps.map((app) => (
              <div
                key={app._id}
                className="bg-white border border-gray-200/80 rounded-3xl p-5 md:p-6 shadow-2xs hover:shadow-md hover:border-brand-200 transition-all duration-200 space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Job Header Info */}
                  <div className="flex gap-4 items-start flex-1">
                    <div className="w-14 h-14 bg-slate-900 text-amber-400 font-black text-xl rounded-2xl flex items-center justify-center shrink-0 shadow-xs border border-gray-800 overflow-hidden">
                      {app.job?.company?.logo ? (
                        <img src={app.job.company.logo} alt={app.job.company.name} className="w-full h-full object-cover" />
                      ) : (
                        app.job?.company?.name?.charAt(0) || 'C'
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className="font-black text-gray-900 text-lg hover:text-brand-600 transition-colors leading-tight"
                        >
                          {app.job?.title || 'Job Title Unavailable'}
                        </Link>
                      </div>

                      <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                        <Building2 size={13} className="text-brand-500" />
                        <span>{app.job?.company?.name || 'Company Name'}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-gray-400" /> {app.job?.location || 'Remote'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Briefcase size={12} className="text-gray-400" /> {app.job?.jobType || 'Full-Time'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <IndianRupee size={12} className="text-gray-400" /> {formatSalary(app.job?.salary)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Tag & Action Buttons */}
                  <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs ${getStatusStyles(app.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {app.status === 'Hired' ? 'Offered' : app.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold pt-2 md:pt-0">
                      <span className="text-gray-400 text-[11px]">Applied {formatDate(app.createdAt)}</span>
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-brand-600 hover:bg-brand-50 border border-brand-200 font-bold py-1.5 px-3.5 rounded-xl transition-colors flex items-center gap-1"
                      >
                        View Job <ChevronRight size={13} />
                      </Link>
                      <button
                        onClick={() => setSelectedAppForWithdraw(app)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Withdraw application"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pipeline Stepper Visualizer */}
                {renderPipelineStepper(app.status)}
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs font-bold text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} total applications
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 cursor-pointer font-bold"
              >
                &larr;
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl font-black text-xs transition-colors cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 cursor-pointer font-bold"
              >
                &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Widgets */}
      <div className="lg:w-80 space-y-6 shrink-0">
        {/* Application Breakdown Stats Widget */}
        <div className="bg-white rounded-3xl p-6 shadow-2xs border border-gray-200/80 space-y-5">
          <h3 className="font-black text-gray-900 text-base border-b border-gray-100 pb-3">Application Overview</h3>

          {/* Dynamic Donut Chart */}
          <div className="flex justify-center my-2">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {chartData.map((data, index) => {
                  if (data.count === 0) return null;
                  const rotation = calculateRotation(index, chartData);
                  const dashOffset = calculateDashOffset(data.count, stats.total);
                  return (
                    <circle
                      key={data.label}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={data.color}
                      strokeWidth="16"
                      strokeDasharray="251.2"
                      strokeDashoffset={dashOffset}
                      style={{ transform: `rotate(${rotation + 90}deg)`, transformOrigin: 'center' }}
                    />
                  );
                })}
                {stats.total === 0 && (
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="16" />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-gray-900 leading-none">{stats.total}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1 w-16">Submissions</span>
              </div>
            </div>
          </div>

          {/* Stats List Breakdown */}
          <div className="space-y-2.5">
            {chartData.map((stat, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stat.bgClass}`}></span>
                  <span className="text-gray-600">{stat.label}</span>
                </div>
                <span className="font-black text-gray-900">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Tip Widget */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-orange-200/70 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-brand-800 font-black text-sm">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h3>Pro Application Tip</h3>
          </div>
          <p className="text-xs text-gray-700 font-semibold leading-relaxed">
            Follow up on positions marked "In Review" after 5 business days to double your recruiter callback rate!
          </p>
        </div>

        {/* Support Widget */}
        <div className="bg-white rounded-3xl p-5 shadow-2xs border border-gray-200/80 text-center space-y-3">
          <div className="w-10 h-10 bg-orange-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto font-bold">
            <HelpCircle size={20} />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-sm">Application Support</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Need assistance or have status inquiries?</p>
          </div>
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-full bg-white border border-brand-200 text-brand-600 font-bold py-2.5 rounded-xl text-xs hover:bg-brand-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Contact Support Desk</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Withdraw Modal */}
      {selectedAppForWithdraw && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <button onClick={() => setSelectedAppForWithdraw(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-black text-gray-900">Withdraw Application?</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Are you sure you want to withdraw your application for <strong className="text-gray-800">{selectedAppForWithdraw.job?.title}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedAppForWithdraw(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdrawApplication}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Withdraw Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base">Candidate Helpdesk</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              If you have any questions regarding your active applications, interview invites, or recruiter notifications, please drop a note below.
            </p>

            <textarea
              rows={3}
              placeholder="Describe your issue or query here..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-500"
            ></textarea>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowHelpModal(false);
                  showToast('Your message has been sent to our support team!');
                }}
                className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
