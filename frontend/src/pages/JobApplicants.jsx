import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  FileText,
  Calendar,
  UserCheck,
  Search,
  Download,
  Eye,
  MessageSquare,
  MoreVertical,
  ChevronRight,
  MapPin,
  Briefcase,
  Edit3,
  ChevronLeft,
  Filter,
  Send,
  X,
  CheckCircle,
  FileCode,
  Sparkles,
  UserX,
  Clock,
  Building,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
  Mail,
  Trash2,
  ExternalLink,
  Award,
  Check,
  RefreshCw,
  Share2
} from 'lucide-react';
import RecruiterLayout from '../components/RecruiterLayout';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryJobId = jobId || searchParams.get('jobId') || 'all';

  // State definitions
  const [applicants, setApplicants] = useState([]);
  const [jobDetails, setJobDetails] = useState({
    title: 'Software Engineer',
    companyName: 'TechNova Solutions',
    location: 'Bangalore, India',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    postedDate: '2025-08-12',
    vacancies: 3,
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS']
  });

  const [stats, setStats] = useState({
    total: 48,
    applied: 14,
    inReview: 12,
    shortlisted: 8,
    interview: 6,
    offered: 4,
    hired: 2,
    rejected: 2
  });

  const [pagination, setPagination] = useState({
    totalCount: 48,
    currentPage: 1,
    totalPages: 8,
    limit: 6
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter Sidebar State
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterExperience, setFilterExperience] = useState('All Levels');
  const [filterLocation, setFilterLocation] = useState('All Locations');
  const [filterSkill, setFilterSkill] = useState('All Skills');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Interactive selection state
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [statusDropdownId, setStatusDropdownId] = useState(null);

  // Resume Modal state
  const [viewCandidate, setViewCandidate] = useState(null);
  const [modalTab, setModalTab] = useState('overview');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchApplicants = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        jobId: queryJobId,
        page,
        limit: pagination.limit,
        status: activeTab !== 'All' ? activeTab : filterStatus !== 'All Status' ? filterStatus : undefined,
        search: searchTerm || undefined,
        experienceLevel: filterExperience !== 'All Levels' ? filterExperience : undefined,
        location: filterLocation !== 'All Locations' ? filterLocation : undefined,
        skill: filterSkill !== 'All Skills' ? filterSkill : undefined,
        sortBy
      };

      const { data } = await axios.get('/api/applications/job-applicants', { params });
      if (data.success) {
        setApplicants(data.data.applicants || []);
        if (data.data.jobDetails) setJobDetails(data.data.jobDetails);
        if (data.data.stats) setStats(data.data.stats);
        if (data.data.pagination) setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching job applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants(1);
  }, [queryJobId, activeTab, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplicants(1);
  };

  const handleApplyFilters = () => {
    fetchApplicants(1);
    setShowFiltersMobile(false);
  };

  const resetFilters = () => {
    setFilterStatus('All Status');
    setFilterExperience('All Levels');
    setFilterLocation('All Locations');
    setFilterSkill('All Skills');
    setSearchTerm('');
    setActiveTab('All');
    fetchApplicants(1);
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      // Optimistic UI update
      setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      setStatusDropdownId(null);
      setActiveMenuId(null);

      await axios.put(`/api/applications/${appId}/status`, { status: newStatus });
      showToast(`✨ Application status updated to "${newStatus}"`);
      fetchApplicants(pagination.currentPage);
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('⚠️ Failed to update status. Please try again.');
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedApplicants.length === 0) return;
    try {
      setApplicants(prev => prev.map(a => selectedApplicants.includes(a._id) ? { ...a, status: newStatus } : a));
      
      // Update each selected applicant
      await Promise.all(
        selectedApplicants.map(id => axios.put(`/api/applications/${id}/status`, { status: newStatus }))
      );

      showToast(`🎉 ${selectedApplicants.length} applicant(s) updated to "${newStatus}"`);
      setSelectedApplicants([]);
      fetchApplicants(pagination.currentPage);
    } catch (error) {
      console.error('Error bulk updating status:', error);
      showToast('⚠️ Failed to bulk update applicants.');
    }
  };

  // Checkbox Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApplicants(applicants.map(a => a._id));
    } else {
      setSelectedApplicants([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedApplicants.includes(id)) {
      setSelectedApplicants(selectedApplicants.filter(item => item !== id));
    } else {
      setSelectedApplicants([...selectedApplicants, id]);
    }
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Shortlisted
          </span>
        );
      case 'In Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            In Review
          </span>
        );
      case 'Interview':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
            Interview
          </span>
        );
      case 'Applied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Applied
          </span>
        );
      case 'Offered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            Offered
          </span>
        );
      case 'Hired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Hired
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  // Progress Bar Helper for Match Percentage
  const getMatchProgressBar = (percent) => {
    let barColor = 'bg-emerald-500';
    let badgeText = 'High Match';
    let badgeBg = 'text-emerald-700 bg-emerald-50 border-emerald-100';

    if (percent < 70) {
      barColor = 'bg-rose-500';
      badgeText = 'Low Match';
      badgeBg = 'text-rose-700 bg-rose-50 border-rose-100';
    } else if (percent < 82) {
      barColor = 'bg-amber-500';
      badgeText = 'Good Match';
      badgeBg = 'text-amber-700 bg-amber-50 border-amber-100';
    }

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span className="text-gray-800">{percent}%</span>
          <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${badgeBg}`}>
            {badgeText}
          </span>
        </div>
        <div className="w-28 bg-gray-100 rounded-full h-1.5 overflow-hidden border border-gray-200/50">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Helper for Date display
  const formatDate = (dateString) => {
    if (!dateString) return '12 Aug 2025';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '12 Aug 2025';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statusTabs = [
    { label: 'All', count: stats.total },
    { label: 'Applied', count: stats.applied },
    { label: 'In Review', count: stats.inReview },
    { label: 'Shortlisted', count: stats.shortlisted },
    { label: 'Interview', count: stats.interview },
    { label: 'Offered', count: stats.offered },
    { label: 'Hired', count: stats.hired },
    { label: 'Rejected', count: stats.rejected }
  ];

  return (
    <RecruiterLayout>
      <div className="space-y-6 pb-20 max-w-[1400px] mx-auto">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200 border border-gray-800">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Top Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1.5">
              <Link to="/recruiter/jobs" className="hover:text-brand-600 transition-colors flex items-center gap-1">
                <Briefcase size={13} />
                <span>My Jobs</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-700 font-bold max-w-[200px] truncate">{jobDetails.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-brand-600 font-bold">Applicants</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              Job Applicants
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-200">
                {stats.total} Total
              </span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Review candidates, shortlist profiles, and track hiring progress for <strong className="text-gray-800 font-bold">{jobDetails.title}</strong>
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => fetchApplicants(pagination.currentPage)}
              className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Refresh applicants"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('Exporting applicant data to CSV...')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs border border-gray-200 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Export CSV</span>
            </button>
            <Link
              to={`/recruiter/jobs/${jobDetails._id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Job</span>
            </Link>
          </div>
        </div>

        {/* Hero Card for Selected Job Context */}
        <div className="bg-gradient-to-r from-slate-900 via-stone-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-amber-400 font-black text-2xl border border-white/15 shrink-0 shadow-inner">
                {jobDetails.companyLogo ? (
                  <img src={jobDetails.companyLogo} alt={jobDetails.companyName} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  jobDetails.companyName?.charAt(0) || 'C'
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-white tracking-tight">{jobDetails.title}</h2>
                  <span className="px-2.5 py-0.5 bg-white/10 text-white/90 text-[11px] font-bold rounded-lg backdrop-blur-xs">
                    {jobDetails.jobType}
                  </span>
                  <span className="px-2.5 py-0.5 bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[11px] font-bold rounded-lg">
                    {jobDetails.workMode}
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-medium flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-brand-400" /> {jobDetails.companyName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-400" /> {jobDetails.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-brand-400" /> {jobDetails.vacancies} Openings</span>
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(jobDetails.skills || ['React', 'Node.js', 'MongoDB', 'AWS']).map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/10 text-gray-300 text-[10px] font-semibold rounded-md backdrop-blur-xs">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Pills in Banner */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md shrink-0">
              <div className="text-center px-3 border-r border-white/10">
                <div className="text-lg font-black text-amber-400">{stats.inReview}</div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Reviewing</div>
              </div>
              <div className="text-center px-3 border-r border-white/10">
                <div className="text-lg font-black text-purple-400">{stats.shortlisted + stats.interview}</div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pipeline</div>
              </div>
              <div className="text-center px-3">
                <div className="text-lg font-black text-emerald-400">{stats.hired}</div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Hired</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Interactive Metric Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Applicants */}
          <div
            onClick={() => setActiveTab('All')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'All'
                ? 'bg-white border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                : 'bg-white border-gray-200/80 hover:border-brand-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                <Users className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                100% Total
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900 leading-none">{stats.total}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">Total Applicants</div>
            </div>
          </div>

          {/* Card 2: In Review */}
          <div
            onClick={() => setActiveTab('In Review')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'In Review'
                ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                : 'bg-white border-gray-200/80 hover:border-amber-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                {Math.round((stats.inReview / (stats.total || 1)) * 100)}% pending
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900 leading-none">{stats.inReview}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">In Review</div>
            </div>
          </div>

          {/* Card 3: Interviews */}
          <div
            onClick={() => setActiveTab('Interview')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'Interview'
                ? 'bg-white border-purple-500 ring-2 ring-purple-500/20 shadow-md'
                : 'bg-white border-gray-200/80 hover:border-purple-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <Calendar className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                {stats.interview} Scheduled
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900 leading-none">{stats.interview}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">Interviews</div>
            </div>
          </div>

          {/* Card 4: Hired */}
          <div
            onClick={() => setActiveTab('Hired')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'Hired'
                ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                : 'bg-white border-gray-200/80 hover:border-emerald-200 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <UserCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Target Met
              </span>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-gray-900 leading-none">{stats.hired}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">Hired Candidates</div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="bg-white p-1.5 rounded-2xl border border-gray-200/90 shadow-2xs overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 min-w-max">
            {statusTabs.map((tab) => {
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Sort Toolbar & Quick Filter Toggles */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, skills, experience, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-800 placeholder:text-gray-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Right Controls */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs border border-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                <span>Filters</span>
                {(filterStatus !== 'All Status' || filterExperience !== 'All Levels' || filterLocation !== 'All Locations' || filterSkill !== 'All Skills') && (
                  <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 hidden md:inline">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-2.5 px-3 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest_match">Highest Match %</option>
                  <option value="name">Candidate Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Filter Bar Dropdown/Drawer */}
          {(showFiltersMobile || filterStatus !== 'All Status' || filterExperience !== 'All Levels' || filterLocation !== 'All Locations' || filterSkill !== 'All Skills') && (
            <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold">
              <div>
                <label className="block text-gray-500 mb-1">Status Filter</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                >
                  <option value="All Status">All Status</option>
                  <option value="Applied">Applied</option>
                  <option value="In Review">In Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Offered">Offered</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Experience Level</label>
                <select
                  value={filterExperience}
                  onChange={(e) => setFilterExperience(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                >
                  <option value="All Levels">All Levels</option>
                  <option value="1 yr exp">1+ Years</option>
                  <option value="2 yrs exp">2+ Years</option>
                  <option value="3 yrs exp">3+ Years</option>
                  <option value="4 yrs exp">4+ Years</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Location</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                >
                  <option value="All Locations">All Locations</option>
                  <option value="Bangalore, India">Bangalore</option>
                  <option value="Delhi, India">Delhi NCR</option>
                  <option value="Mumbai, India">Mumbai</option>
                  <option value="Pune, India">Pune</option>
                  <option value="Hyderabad, India">Hyderabad</option>
                  <option value="Noida, India">Noida</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 mb-1">Skills</label>
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800"
                >
                  <option value="All Skills">All Skills</option>
                  <option value="React">React</option>
                  <option value="Node.js">Node.js</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="Docker">Docker</option>
                  <option value="AWS">AWS</option>
                </select>
              </div>

              <div className="sm:col-span-2 md:col-span-4 flex items-center justify-between pt-2">
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-gray-500 hover:text-brand-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <X size={14} /> Clear all filters
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors cursor-pointer shadow-xs"
                >
                  Apply Filter Rules
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Main Column: Applicants List / Table */}
          <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-3xl shadow-xs overflow-hidden relative">
            {loading ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-gray-500">Loading applicants data...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <div className="w-16 h-16 bg-orange-50 text-brand-600 rounded-3xl flex items-center justify-center mx-auto border border-orange-100 shadow-inner">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">No applicants match current filters</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Try resetting search parameters or changing status tab.</p>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                        <th className="py-3.5 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedApplicants.length === applicants.length && applicants.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                          />
                        </th>
                        <th className="py-3.5 px-4">Candidate Profile</th>
                        <th className="py-3.5 px-4">Applied Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Skill Match</th>
                        <th className="py-3.5 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {applicants.map((item) => {
                        const candidate = item.applicant || {};
                        const isSelected = selectedApplicants.includes(item._id);

                        return (
                          <tr
                            key={item._id}
                            className={`hover:bg-gray-50/80 transition-all ${
                              isSelected ? 'bg-orange-50/40' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-4 px-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectOne(item._id)}
                                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                              />
                            </td>

                            {/* Candidate Profile Info */}
                            <td className="py-4 px-4">
                              <div className="flex items-start gap-3">
                                <div className="relative shrink-0">
                                  <img
                                    src={candidate.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || 'User')}&background=0f172a&color=fff`}
                                    alt={candidate.name}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-xs"
                                  />
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-extrabold text-gray-900 text-sm leading-tight hover:text-brand-600 cursor-pointer" onClick={() => setViewCandidate(item)}>
                                    {candidate.name || 'Candidate Name'}
                                  </h4>
                                  <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5">
                                    <MapPin size={11} className="text-gray-400" />
                                    <span>{candidate.location || 'Location Not Specified'}</span>
                                    <span>•</span>
                                    <span>{candidate.experienceText || '2 yrs exp'}</span>
                                  </p>
                                  <div className="flex flex-wrap gap-1 pt-0.5">
                                    {(candidate.skills || ['React', 'Node.js', 'MongoDB']).slice(0, 3).map((skill, idx) => (
                                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded-md">
                                        {skill}
                                      </span>
                                    ))}
                                    {candidate.skills?.length > 3 && (
                                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md">
                                        +{candidate.skills.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Applied Date */}
                            <td className="py-4 px-4 font-bold text-gray-600 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-gray-400" />
                                <span>{formatDate(item.appliedOn)}</span>
                              </div>
                            </td>

                            {/* Status Pill & Interactive Popover */}
                            <td className="py-4 px-4 whitespace-nowrap relative">
                              <div
                                onClick={() => setStatusDropdownId(statusDropdownId === item._id ? null : item._id)}
                                className="cursor-pointer inline-block transform hover:scale-105 transition-transform"
                                title="Click to update application status"
                              >
                                {getStatusBadge(item.status)}
                              </div>

                              {/* Dropdown Menu */}
                              {statusDropdownId === item._id && (
                                <div className="absolute left-4 top-12 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 py-1.5 w-40 text-xs font-bold animate-in fade-in zoom-in-95 duration-100">
                                  <div className="px-3 py-1 text-[10px] uppercase font-black text-gray-400 border-b border-gray-100">Update Status</div>
                                  {['Applied', 'In Review', 'Shortlisted', 'Interview', 'Offered', 'Hired', 'Rejected'].map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => handleStatusChange(item._id, s)}
                                      className={`w-full text-left px-3.5 py-2 hover:bg-orange-50 hover:text-brand-600 transition-colors flex items-center justify-between ${
                                        s === item.status ? 'font-black text-brand-600 bg-orange-50/50' : 'text-gray-700'
                                      }`}
                                    >
                                      <span>{s}</span>
                                      {s === item.status && <Check size={14} />}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </td>

                            {/* Match Progress */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              {getMatchProgressBar(item.matchPercentage || 85)}
                            </td>

                            {/* Quick Actions */}
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => setViewCandidate(item)}
                                  className="p-2 text-gray-600 hover:text-brand-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                                  title="View Full Profile & Resume"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => showToast(`Opening candidate chat message dialog...`)}
                                  className="p-2 text-gray-600 hover:text-brand-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                                  title="Send Message"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>

                                {/* More Popup */}
                                <div className="relative">
                                  <button
                                    onClick={() => setActiveMenuId(activeMenuId === item._id ? null : item._id)}
                                    className="p-2 text-gray-600 hover:text-brand-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {activeMenuId === item._id && (
                                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 py-1.5 w-44 text-xs font-bold animate-in fade-in duration-100">
                                      <button
                                        onClick={() => {
                                          setViewCandidate(item);
                                          setActiveMenuId(null);
                                        }}
                                        className="w-full text-left px-3.5 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                                        <span>Candidate Details</span>
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(item._id, 'Shortlisted')}
                                        className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2"
                                      >
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>Shortlist</span>
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(item._id, 'Interview')}
                                        className="w-full text-left px-3.5 py-2 hover:bg-purple-50 text-purple-700 flex items-center gap-2"
                                      >
                                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                                        <span>Schedule Interview</span>
                                      </button>
                                      <button
                                        onClick={() => handleStatusChange(item._id, 'Rejected')}
                                        className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 border-t border-gray-100"
                                      >
                                        <X className="w-3.5 h-3.5 text-rose-500" />
                                        <span>Reject</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards */}
                <div className="md:hidden divide-y divide-gray-100 p-4 space-y-4">
                  {applicants.map((item) => {
                    const candidate = item.applicant || {};
                    return (
                      <div key={item._id} className="bg-gray-50/60 rounded-2xl p-4 space-y-3 border border-gray-200/60">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={candidate.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name || 'User')}`}
                              alt={candidate.name}
                              className="w-11 h-11 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <h4 className="font-extrabold text-gray-900 text-sm">{candidate.name}</h4>
                              <p className="text-xs text-gray-500 font-semibold">{candidate.location} • {candidate.experienceText}</p>
                            </div>
                          </div>
                          <div>{getStatusBadge(item.status)}</div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold pt-1">
                          <span className="text-gray-500">Match Rating:</span>
                          <span className="text-emerald-600 font-black">{item.matchPercentage || 85}%</span>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200/60">
                          <button
                            onClick={() => setViewCandidate(item)}
                            className="px-3 py-1.5 bg-brand-600 text-white font-bold text-xs rounded-xl"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleStatusChange(item._id, 'Shortlisted')}
                            className="px-3 py-1.5 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl"
                          >
                            Shortlist
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pagination Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-600">
              <div>
                Showing {applicants.length > 0 ? 1 : 0} to {applicants.length} of {pagination.totalCount} applicants
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={pagination.currentPage === 1}
                  onClick={() => fetchApplicants(pagination.currentPage - 1)}
                  className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pNum = i + 1;
                  const isCurrent = pNum === pagination.currentPage;
                  return (
                    <button
                      key={pNum}
                      onClick={() => fetchApplicants(pNum)}
                      className={`w-7 h-7 rounded-xl text-xs font-black transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => fetchApplicants(pagination.currentPage + 1)}
                  className="p-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Limit Selector */}
              <div>
                <select
                  value={pagination.limit}
                  onChange={(e) => {
                    setPagination(prev => ({ ...prev, limit: Number(e.target.value) }));
                    fetchApplicants(1);
                  }}
                  className="py-1 px-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
                >
                  <option value={6}>6 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: Job Details Overview */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-gray-900 text-base">Job Summary</h3>
                <Link
                  to={`/recruiter/jobs/${jobDetails._id}/edit`}
                  className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-11 h-11 bg-slate-900 text-amber-400 font-black text-xl rounded-2xl flex items-center justify-center shrink-0 shadow-xs">
                  {jobDetails.companyLogo ? (
                    <img src={jobDetails.companyLogo} alt={jobDetails.companyName} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    jobDetails.companyName?.charAt(0) || 'J'
                  )}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm leading-tight">
                    {jobDetails.title}
                  </h4>
                  <p className="text-xs font-bold text-gray-500 mt-0.5">
                    {jobDetails.companyName}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-bold text-gray-600 pt-1">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-500" />
                  <span>{jobDetails.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-brand-500" />
                  <span>{jobDetails.jobType} • {jobDetails.workMode}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span>Posted {formatDate(jobDetails.postedDate)}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-brand-500" />
                  <span>{jobDetails.vacancies} Openings Available</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <Link
                  to={`/jobs/${jobDetails._id}`}
                  className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span>View Public Listing</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Filter Applicants Panel */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 font-black text-gray-900 text-base">
                <Filter className="w-4 h-4 text-brand-600" />
                <h3>Quick Filters</h3>
              </div>

              <div className="space-y-3 text-xs font-bold">
                <div>
                  <label className="block text-gray-600 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:border-brand-500"
                  >
                    <option value="All Status">All Status</option>
                    <option value="Applied">Applied</option>
                    <option value="In Review">In Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">Experience Level</label>
                  <select
                    value={filterExperience}
                    onChange={(e) => setFilterExperience(e.target.value)}
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:border-brand-500"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="1 yr exp">1 yr exp</option>
                    <option value="2 yrs exp">2 yrs exp</option>
                    <option value="3 yrs exp">3 yrs exp</option>
                    <option value="4 yrs exp">4+ yrs exp</option>
                  </select>
                </div>

                <button
                  onClick={handleApplyFilters}
                  className="w-full mt-2 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs border border-brand-200 rounded-xl transition-colors cursor-pointer"
                >
                  Apply Active Filters
                </button>
              </div>
            </div>

            {/* Card 3: Recruiter Assistant Shortcuts */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-black text-gray-900 text-base">Hiring Actions</h3>

              <div className="space-y-2 text-xs font-bold text-gray-700">
                <button
                  onClick={() => showToast('Opening interview scheduling portal...')}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer text-left"
                >
                  <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Schedule Bulk Interviews</span>
                </button>

                <button
                  onClick={() => showToast('Preparing candidate email broadcast...')}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer text-left"
                >
                  <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Send Message to Selected</span>
                </button>

                <button
                  onClick={() => showToast('Downloading resume attachments package...')}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center gap-3 transition-colors cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Batch Download Resumes</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bulk Actions Bar */}
        {selectedApplicants.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-4 border border-slate-700 animate-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-[11px] font-black">
                {selectedApplicants.length}
              </span>
              <span>Applicants Selected</span>
            </div>

            <div className="h-4 w-px bg-slate-700"></div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatusChange('Shortlisted')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Shortlist
              </button>
              <button
                onClick={() => handleBulkStatusChange('Interview')}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Schedule Interview
              </button>
              <button
                onClick={() => handleBulkStatusChange('Rejected')}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedApplicants([])}
                className="p-1.5 text-gray-400 hover:text-white rounded-full ml-1"
                title="Deselect All"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Candidate Resume Preview Modal */}
        {viewCandidate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={viewCandidate.applicant?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewCandidate.applicant?.name || 'User')}`}
                    alt={viewCandidate.applicant?.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-gray-900 text-xl">{viewCandidate.applicant?.name}</h3>
                      {getStatusBadge(viewCandidate.status)}
                    </div>
                    <p className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-2">
                      <MapPin size={12} /> {viewCandidate.applicant?.location} • {viewCandidate.applicant?.experienceText || '2+ Yrs Exp'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewCandidate(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Match Banner */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-200/70 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-brand-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    <span>AI Skill Compatibility Score</span>
                  </div>
                  <p className="text-[11px] font-semibold text-gray-600 mt-0.5">
                    Candidate meets {viewCandidate.matchPercentage || 85}% of job requirements.
                  </p>
                </div>
                <div className="text-2xl font-black text-brand-700 bg-white px-3.5 py-1 rounded-xl shadow-xs border border-orange-200">
                  {viewCandidate.matchPercentage || 85}%
                </div>
              </div>

              {/* Details Tabs */}
              <div className="space-y-4 text-xs font-medium">
                <div>
                  <h4 className="font-black text-gray-900 mb-2 text-sm">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(viewCandidate.applicant?.skills || ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'TailwindCSS']).map((s, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 font-bold rounded-xl border border-gray-200/60 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-gray-900 mb-1 text-sm">Application Date</h4>
                  <p className="text-gray-600 font-bold">{formatDate(viewCandidate.appliedOn)}</p>
                </div>

                <div>
                  <h4 className="font-black text-gray-900 mb-2 text-sm">Resume File</h4>
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-black text-gray-900">{viewCandidate.applicant?.name}_Resume.pdf</div>
                        <div className="text-[11px] font-semibold text-gray-400">PDF Document • 1.2 MB</div>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast('Opening resume preview document...')}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                    >
                      Download Resume
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={() => {
                    handleStatusChange(viewCandidate._id, 'Shortlisted');
                    setViewCandidate(null);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Shortlist Candidate
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(viewCandidate._id, 'Interview');
                    setViewCandidate(null);
                  }}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => setViewCandidate(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default JobApplicants;
