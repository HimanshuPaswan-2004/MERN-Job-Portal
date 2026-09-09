import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, SlidersHorizontal, MapPin, Briefcase, IndianRupee, Clock, Bell, Info } from 'lucide-react';
import axios from 'axios';

const getStatusStyles = (status) => {
  switch (status) {
    case 'In Review': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'Shortlisted': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Applied': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Offered': 
    case 'Hired': return 'bg-green-50 text-green-600 border-green-100';
    case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
    case 'Interview': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

const formatSalary = (salary) => {
  if (!salary) return 'Not Disclosed';
  if (typeof salary === 'string') return salary;
  const { min, max } = salary;
  if (!min && !max) return 'Not Disclosed';
  if (!min) return `Upto ₹${max/100000} LPA`;
  if (!max) return `₹${min/100000}+ LPA`;
  return `₹${min/100000} - ${max/100000} LPA`;
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, applied: 0, inReview: 0, shortlisted: 0, interview: 0, offered: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [jobTypeFilter, setJobTypeFilter] = useState('All Job Type');
  const [sortBy, setSortBy] = useState('latest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/applications');
        if (res.data.success) {
          setApplications(res.data.data.applications);
          setStats(res.data.data.stats);
        }
      } catch (error) {
        console.error("Error fetching applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Calculate Chart Offsets dynamically
  const calculateDashOffset = (count, total) => {
    if (total === 0) return 251.2; // full offset (empty circle)
    const circumference = 251.2; // 2 * pi * r (r=40)
    const fraction = count / total;
    return circumference * (1 - fraction);
  };

  const calculateRotation = (index, allStats) => {
     let prevFraction = 0;
     for(let i=0; i<index; i++) {
        prevFraction += allStats[i].count / (stats.total || 1);
     }
     return (prevFraction * 360) - 90; // -90 to start from top
  };

  const chartData = [
    { label: 'Applied', count: stats.applied, color: '#3b82f6', bgClass: 'bg-blue-500' },
    { label: 'In Review', count: stats.inReview, color: '#c2410c', bgClass: 'bg-orange-700' },
    { label: 'Shortlisted', count: stats.shortlisted, color: '#8b5cf6', bgClass: 'bg-purple-500' },
    { label: 'Interview', count: stats.interview, color: '#fb923c', bgClass: 'bg-orange-400' },
    { label: 'Offered', count: stats.offered, color: '#22c55e', bgClass: 'bg-green-500' },
    { label: 'Rejected', count: stats.rejected, color: '#ef4444', bgClass: 'bg-red-500' }
  ];

  // Client-side filtering
  let filteredApps = applications.filter(app => {
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

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Left Column: Applications List */}
      <div className="flex-1 space-y-6">
        
        {/* Header Breadcrumb & Title */}
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2 font-medium">
            <Link to="/candidate/dashboard" className="hover:text-brand-600 flex items-center gap-1">
              <span className="w-4 h-4 inline-block"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span>
              Dashboard
            </Link>
            <ChevronRight size={14} className="mx-1" />
            <span className="text-gray-900">My Applications</span>
          </div>
          
          <div className="bg-[#FFF4E8] rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
            <div className="relative z-10">
              <h1 className="text-3xl font-black text-gray-900 mb-1">My Applications</h1>
              <p className="text-gray-600 font-medium">Track and manage all your job applications in one place.</p>
            </div>
            
            {/* Banner Text Decoration */}
            <div className="hidden md:block relative z-10 text-right pr-10">
               <div className="transform rotate-[-10deg]">
                 <p className="font-caveat text-2xl text-gray-800 font-bold leading-tight">Keep<br/><span className="text-brand-600 text-3xl">Applying</span><br/>Keep<br/><span className="text-brand-600 text-3xl">Growing</span></p>
                 <div className="w-12 h-1 bg-brand-500 rounded-full mt-1 ml-auto"></div>
               </div>
            </div>
            {/* Background Blob */}
            <div className="absolute right-[10%] top-[-50%] w-64 h-64 bg-orange-200/40 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => { setActiveFilter(filter.label); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                activeFilter === filter.label 
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm' 
                : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-orange-50'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Search and Sort Toolbar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by job title, company..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-gray-900"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
              >
                <option>All Status</option>
                <option>Applied</option>
                <option>In Review</option>
                <option>Shortlisted</option>
                <option>Interview</option>
                <option>Offered</option>
                <option>Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <div className="relative">
              <select 
                value={jobTypeFilter}
                onChange={(e) => { setJobTypeFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
              >
                <option>All Job Type</option>
                <option>Full time</option>
                <option>Part time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="latest">Sort by: Latest</option>
                <option value="oldest">Sort by: Oldest</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
             <div className="text-center py-10 text-gray-500 font-medium animate-pulse">Loading applications...</div>
          ) : paginatedApps.length === 0 ? (
             <div className="text-center py-10 bg-white border border-gray-100 rounded-2xl">
                <p className="text-gray-500 font-medium">No applications found matching your criteria.</p>
             </div>
          ) : (
            paginatedApps.map((app) => (
              <div key={app._id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-brand-200 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Job Info */}
                  <div className="flex gap-4 items-center flex-1">
                    <div className="w-14 h-14 bg-white border border-gray-100 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                      {app.job?.company?.logo ? (
                        <img src={app.job.company.logo} alt={app.job.company.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-xl font-bold text-gray-400">{app.job?.company?.name?.charAt(0) || 'C'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg mb-0.5">{app.job?.title || 'Unknown Job'}</h3>
                      <p className="text-sm text-gray-500 font-medium">{app.job?.company?.name || 'Unknown Company'}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-gray-500">
                        <span className="flex items-center gap-1"><MapPin size={12}/> {app.job?.location || 'N/A'}</span>
                        <span className="flex items-center gap-1"><Briefcase size={12}/> {app.job?.jobType || 'N/A'}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {app.job?.experienceLevel || app.job?.experience || 'N/A'}</span>
                        <span className="flex items-center gap-1"><IndianRupee size={12}/> {formatSalary(app.job?.salary)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Action */}
                  <div className="flex flex-col md:items-end justify-between self-stretch shrink-0">
                    <div className="flex justify-between items-center w-full md:w-auto md:justify-end gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${getStatusStyles(app.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {app.status === 'Hired' ? 'Offered' : app.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600"><span className="text-xl rotate-90 inline-block font-bold">...</span></button>
                    </div>
                    
                    <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 mt-4 md:mt-0">
                      <div className="text-xs text-gray-400 font-medium text-right">
                        Applied on<br/><span className="text-gray-600">{formatDate(app.createdAt)}</span>
                      </div>
                      <Link to={`/jobs/${app.job?._id}`} className="text-brand-600 border border-brand-200 hover:bg-brand-50 font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-1">
                        View Details <ChevronRight size={14} className="stroke-[3]" />
                      </Link>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination/Showing Entries */}
        {!loading && totalItems > 0 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} applications
            </span>
            <div className="flex gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50"
              >&larr;</button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors ${
                    currentPage === i + 1 
                    ? 'bg-brand-500 text-white shadow-sm' 
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >&rarr;</button>
            </div>
          </div>
        )}

      </div>

      {/* Right Column: Widgets */}
      <div className="lg:w-80 space-y-6">
        
        {/* Application Stats Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Application Stats</h3>
          
          {/* Dynamic Doughnut Chart */}
          <div className="flex justify-center mb-6">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                 {chartData.map((data, index) => {
                    if(data.count === 0) return null;
                    const rotation = calculateRotation(index, chartData);
                    const dashOffset = calculateDashOffset(data.count, stats.total);
                    return (
                      <circle 
                        key={data.label}
                        cx="50" cy="50" r="40" 
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
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1 w-16">Total Applications</span>
              </div>
            </div>
          </div>
          
          {/* Stats List */}
          <div className="space-y-3">
            {chartData.map((stat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stat.bgClass}`}></span>
                  <span className="text-gray-600 font-medium">{stat.label}</span>
                </div>
                <span className="font-bold text-gray-900">{stat.count}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-400 font-medium">Total Applications</span>
            <span className="font-bold text-gray-900">{stats.total}</span>
          </div>
        </div>

        {/* Tip Widget */}
        <div className="bg-[#FFF8F1] rounded-2xl p-6 shadow-sm border border-orange-100">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-xl">💡</span>
             <h3 className="font-bold text-gray-900">Tip</h3>
          </div>
          <p className="text-sm text-gray-700 font-medium leading-relaxed">
            Keep applying to relevant jobs and update your profile to increase your chances.
          </p>
        </div>

        {/* Need Help Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-600">
            <Bell size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-500 font-medium mb-5 px-4">
            Facing any issue with your applications?
          </p>
          <button className="w-full bg-white border border-brand-200 text-brand-600 font-bold py-2.5 rounded-xl text-sm hover:bg-brand-50 transition-colors flex items-center justify-center gap-2">
            Contact Support <ChevronRight size={16} className="stroke-[3]" />
          </button>
        </div>

        {/* Illustration Widget */}
        <div className="bg-[#FFF4E8] rounded-2xl p-6 relative overflow-hidden h-40 border border-orange-100">
          <div className="relative z-10 w-2/3">
             <p className="font-caveat text-2xl text-gray-800 font-bold leading-tight transform -rotate-12 mt-4">Consistency<br/>today, success<br/>tomorrow.</p>
          </div>
          
          {/* Mountains Vector Art mock */}
          <div className="absolute right-[-10px] bottom-[-10px] w-32 h-32 opacity-80 flex items-end justify-end">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,100 80,40 110,100" fill="#64748b" />
              <polygon points="50,100 80,40 65,40" fill="#cbd5e1" opacity="0.3" />
              
              <polygon points="10,100 50,20 90,100" fill="#475569" />
              <polygon points="10,100 50,20 30,20" fill="#94a3b8" opacity="0.3" />
              
              <polygon points="40,35 50,20 60,35 50,45" fill="#f8fafc" />
              <polygon points="70,55 80,40 90,55 80,65" fill="#f8fafc" />
              
              {/* Flag */}
              <line x1="50" y1="20" x2="50" y2="5" stroke="#f97316" strokeWidth="2" />
              <polygon points="50,5 70,10 50,15" fill="#f97316" />
            </svg>
          </div>
          {/* Abstract squiggles */}
          <svg className="absolute bottom-4 left-2 w-12 h-4 text-brand-500" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M5 15 Q 15 5, 25 10 T 45 15" />
          </svg>
        </div>

      </div>

    </div>
  );
};

export default MyApplications;
