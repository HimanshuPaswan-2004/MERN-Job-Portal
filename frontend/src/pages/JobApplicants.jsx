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
  Sparkles
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

  // Interactive selection state
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [statusDropdownId, setStatusDropdownId] = useState(null);

  // Resume Modal state
  const [viewCandidate, setViewCandidate] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
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
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      // Optimistic UI update
      setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
      setStatusDropdownId(null);
      setActiveMenuId(null);

      await axios.put(`/api/applications/${appId}/status`, { status: newStatus });
      showToast(`Status updated to ${newStatus}`);
      fetchApplicants(pagination.currentPage);
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status');
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

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/90 text-emerald-700">Shortlisted</span>;
      case 'In Review':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100/90 text-sky-700">In Review</span>;
      case 'Interview':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100/90 text-purple-700">Interview</span>;
      case 'Applied':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">Applied</span>;
      case 'Offered':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Offered</span>;
      case 'Hired':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Hired</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  // Progress Bar Helper for Match Percentage
  const getMatchProgressBar = (percent) => {
    let barColor = 'bg-emerald-500';
    if (percent < 75) barColor = 'bg-red-500';
    else if (percent < 82) barColor = 'bg-sky-500';

    return (
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-bold text-gray-800 w-8">{percent}%</span>
        <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }}></div>
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
      <div className="space-y-6 pb-12">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-8 z-50 bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Top Header & Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1">
            <Link to="/recruiter/jobs" className="hover:text-gray-600 transition-colors">My Jobs</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600 font-semibold">{jobDetails.title}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-bold">Applicants</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Job Applicants
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-0.5">
            Manage and track all applications for {jobDetails.title} at {jobDetails.companyName}.
          </p>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Total Applicants */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-11 h-11 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 shrink-0">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 leading-none">{stats.total}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1">Total Applicants</div>
            </div>
          </div>

          {/* Card 2: In Review */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 leading-none">{stats.inReview}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1">In Review</div>
            </div>
          </div>

          {/* Card 3: Interviews */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 leading-none">{stats.interview}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1">Interviews</div>
            </div>
          </div>

          {/* Card 4: Hired */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center gap-4">
            <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
              <UserCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 leading-none">{stats.hired}</div>
              <div className="text-xs font-semibold text-gray-500 mt-1">Hired</div>
            </div>
          </div>
        </div>

        {/* Navigation Status Tabs */}
        <div className="border-b border-gray-200/90 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 min-w-max">
            {statusTabs.map((tab) => {
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`pb-3 text-xs font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? 'text-[#f9571c] font-bold border-b-2 border-[#f9571c]'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <span>{tab.label} ({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Search input, Sort select & Export button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full max-w-lg">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applicants by name, skills, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-800 placeholder:text-gray-400 shadow-2xs"
            />
          </form>

          {/* Right Actions: Sort dropdown & Export */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 hidden md:inline">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 px-3 text-xs font-semibold bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c] cursor-pointer shadow-2xs"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest_match">Highest Match</option>
                <option value="name">Candidate Name</option>
              </select>
            </div>

            <button
              onClick={() => showToast('Exporting applicant list to CSV...')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs border border-gray-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Applicants Table */}
          <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-2xl shadow-2xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs font-semibold text-gray-500">
                Loading applicants...
              </div>
            ) : applicants.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl text-[#f9571c] flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">No applicants found</h3>
                <p className="text-xs text-gray-500">Try changing the status tab or search keyword.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedApplicants.length === applicants.length && applicants.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-[#f9571c] focus:ring-[#f9571c] cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Applied On</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Match</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {applicants.map((item) => {
                      const candidate = item.applicant || {};
                      const isSelected = selectedApplicants.includes(item._id);

                      return (
                        <tr key={item._id} className={`hover:bg-gray-50/80 transition-colors ${isSelected ? 'bg-orange-50/30' : ''}`}>
                          {/* Checkbox */}
                          <td className="py-4 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectOne(item._id)}
                              className="rounded border-gray-300 text-[#f9571c] focus:ring-[#f9571c] cursor-pointer"
                            />
                          </td>

                          {/* Candidate Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-start gap-3">
                              <img
                                src={candidate.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=23272e&color=fff`}
                                alt={candidate.name}
                                className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200"
                              />
                              <div className="space-y-1">
                                <h4 className="font-extrabold text-gray-900 leading-tight">
                                  {candidate.name}
                                </h4>
                                <p className="text-[11px] font-semibold text-gray-500">
                                  {candidate.location} • {candidate.experienceText || '2 yrs exp'}
                                </p>
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                  {(candidate.skills || ['React', 'Node.js', 'MongoDB']).slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded">
                                      {skill}
                                    </span>
                                  ))}
                                  {candidate.skills?.length > 3 && (
                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">
                                      +{candidate.skills.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Applied On */}
                          <td className="py-4 px-4 font-semibold text-gray-600 whitespace-nowrap">
                            {formatDate(item.appliedOn)}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 whitespace-nowrap relative">
                            <div
                              onClick={() => setStatusDropdownId(statusDropdownId === item._id ? null : item._id)}
                              className="cursor-pointer inline-block"
                              title="Click to update status"
                            >
                              {getStatusBadge(item.status)}
                            </div>

                            {/* Status Quick Dropdown */}
                            {statusDropdownId === item._id && (
                              <div className="absolute left-4 top-12 bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1 w-36 text-xs font-semibold">
                                {['Applied', 'In Review', 'Shortlisted', 'Interview', 'Offered', 'Hired', 'Rejected'].map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => handleStatusChange(item._id, s)}
                                    className={`w-full text-left px-3 py-1.5 hover:bg-orange-50 hover:text-[#f9571c] ${s === item.status ? 'font-bold text-[#f9571c]' : 'text-gray-700'}`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Match Progress */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {getMatchProgressBar(item.matchPercentage || 85)}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View Resume */}
                              <button
                                onClick={() => setViewCandidate(item)}
                                className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="View Candidate Profile & Resume"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Send Message */}
                              <button
                                onClick={() => showToast(`Opening chat with ${candidate.name}...`)}
                                className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="Send Message"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>

                              {/* More Options Dropdown */}
                              <div className="relative">
                                <button
                                  onClick={() => setActiveMenuId(activeMenuId === item._id ? null : item._id)}
                                  className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {activeMenuId === item._id && (
                                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-xl z-30 py-1 w-40 text-xs font-semibold">
                                    <button
                                      onClick={() => setViewCandidate(item)}
                                      className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                                    >
                                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                                      <span>View Details</span>
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(item._id, 'Shortlisted')}
                                      className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                      <span>Shortlist</span>
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(item._id, 'Interview')}
                                      className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-purple-700 flex items-center gap-2"
                                    >
                                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                                      <span>Schedule Interview</span>
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(item._id, 'Rejected')}
                                      className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2"
                                    >
                                      <X className="w-3.5 h-3.5 text-red-500" />
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
            )}

            {/* Pagination Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-600">
              <div>
                Showing 1 to {applicants.length} of {pagination.totalCount} applicants
              </div>

              {/* Page buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={pagination.currentPage === 1}
                  onClick={() => fetchApplicants(pagination.currentPage - 1)}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
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
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#f9571c] text-white'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                {pagination.totalPages > 5 && (
                  <>
                    <span className="px-1 text-gray-400">...</span>
                    <button
                      onClick={() => fetchApplicants(pagination.totalPages)}
                      className="w-7 h-7 rounded-lg text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}

                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => fetchApplicants(pagination.currentPage + 1)}
                  className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Per page selector */}
              <div>
                <select
                  value={pagination.limit}
                  onChange={(e) => {
                    setPagination(prev => ({ ...prev, limit: Number(e.target.value) }));
                    fetchApplicants(1);
                  }}
                  className="py-1 px-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer"
                >
                  <option value={6}>6 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Sidebar Cards */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card 1: Job Details */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-gray-900 text-base">Job Details</h3>
                <Link
                  to={`/recruiter/jobs/${jobDetails._id}/edit`}
                  className="text-xs font-bold text-[#f9571c] hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Job</span>
                </Link>
              </div>

              {/* Title & Company */}
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 bg-[#23272e] text-amber-500 font-black text-xl rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                  {jobDetails.companyLogo ? (
                    <img src={jobDetails.companyLogo} alt={jobDetails.companyName} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    'T'
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm leading-tight">
                    {jobDetails.title}
                  </h4>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    {jobDetails.companyName}
                  </p>
                </div>
              </div>

              {/* Metadata details */}
              <div className="space-y-2 text-xs font-medium text-gray-600 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{jobDetails.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>{jobDetails.jobType} • {jobDetails.workMode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Posted {formatDate(jobDetails.postedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{jobDetails.vacancies} Openings</span>
                </div>
              </div>

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                {(jobDetails.skills || ['React', 'Node.js', 'PostgreSQL', 'AWS']).map((sk, i) => (
                  <span key={i} className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-lg">
                    {sk}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100">
                <Link
                  to={`/jobs/${jobDetails._id}`}
                  className="text-xs font-bold text-[#f9571c] hover:underline flex items-center gap-1"
                >
                  <span>View Job Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Filter Applicants Panel */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 font-extrabold text-gray-900 text-base">
                <Filter className="w-4 h-4 text-[#f9571c]" />
                <h3>Filter Applicants</h3>
              </div>

              <div className="space-y-3.5 text-xs font-semibold">
                {/* Application Status */}
                <div>
                  <label className="block text-gray-700 mb-1">Application Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c] cursor-pointer"
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

                {/* Experience Level */}
                <div>
                  <label className="block text-gray-700 mb-1">Experience Level</label>
                  <select
                    value={filterExperience}
                    onChange={(e) => setFilterExperience(e.target.value)}
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c] cursor-pointer"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="1 yr exp">1 yr exp</option>
                    <option value="2 yrs exp">2 yrs exp</option>
                    <option value="3 yrs exp">3 yrs exp</option>
                    <option value="4 yrs exp">4+ yrs exp</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-gray-700 mb-1">Location</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c] cursor-pointer"
                  >
                    <option value="All Locations">All Locations</option>
                    <option value="Bangalore, India">Bangalore, India</option>
                    <option value="Delhi, India">Delhi, India</option>
                    <option value="Mumbai, India">Mumbai, India</option>
                    <option value="Pune, India">Pune, India</option>
                    <option value="Hyderabad, India">Hyderabad, India</option>
                    <option value="Noida, India">Noida, India</option>
                  </select>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-gray-700 mb-1">Skills</label>
                  <select
                    value={filterSkill}
                    onChange={(e) => setFilterSkill(e.target.value)}
                    className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c] cursor-pointer"
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

                {/* Apply Filters Button */}
                <button
                  onClick={handleApplyFilters}
                  className="w-full mt-2 py-2.5 bg-white hover:bg-orange-50 text-[#f9571c] font-bold text-xs border border-[#f9571c] rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Card 3: Quick Actions */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base">Quick Actions</h3>

              <div className="space-y-2.5 text-xs font-bold text-gray-700">
                <button
                  onClick={() => showToast('Opening interview scheduler...')}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-3 transition-colors cursor-pointer text-left"
                >
                  <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Schedule Interviews</span>
                </button>

                <button
                  onClick={() => showToast('Opening bulk message editor...')}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-3 transition-colors cursor-pointer text-left"
                >
                  <Send className="w-4 h-4 text-[#f9571c] shrink-0" />
                  <span>Send Message</span>
                </button>

                <button
                  onClick={() => showToast('Preparing download ZIP of candidate resumes...')}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center gap-3 transition-colors cursor-pointer text-left"
                >
                  <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Download Resumes</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Resume Preview Modal */}
        {viewCandidate && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={viewCandidate.applicant?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(viewCandidate.applicant?.name)}`}
                    alt={viewCandidate.applicant?.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">{viewCandidate.applicant?.name}</h3>
                    <p className="text-xs font-semibold text-gray-500">{viewCandidate.applicant?.location} • {viewCandidate.applicant?.experienceText}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewCandidate(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Application Details */}
              <div className="space-y-4 text-xs font-medium text-gray-700">
                <div className="flex items-center justify-between bg-orange-50/60 p-3 rounded-2xl border border-orange-100">
                  <span className="font-bold text-gray-800">Job Skill Match</span>
                  <div className="flex items-center gap-2 font-black text-emerald-700 text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{viewCandidate.matchPercentage}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1.5">Skills & Qualifications</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(viewCandidate.applicant?.skills || ['React', 'Node.js', 'MongoDB']).map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-800 font-semibold rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Applied Date</h4>
                  <p className="text-gray-600">{formatDate(viewCandidate.appliedOn)}</p>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-gray-900 mb-2">Resume Document</h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-extrabold text-gray-900">{viewCandidate.applicant?.name}_Resume.pdf</div>
                        <div className="text-[11px] text-gray-400">PDF Document • 1.2 MB</div>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast('Opening resume document...')}
                      className="px-3.5 py-1.5 bg-[#f9571c] hover:bg-[#e04810] text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      View Resume
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    handleStatusChange(viewCandidate._id, 'Shortlisted');
                    setViewCandidate(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Shortlist Candidate
                </button>
                <button
                  onClick={() => setViewCandidate(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl"
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
