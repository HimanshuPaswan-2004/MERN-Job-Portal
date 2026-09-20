import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Plus,
  Search,
  Briefcase,
  CheckCircle2,
  PauseCircle,
  XCircle,
  MapPin,
  Calendar,
  Edit3,
  MoreVertical,
  Lightbulb,
  Filter,
  ChevronRight,
  Trash2,
  Users,
  Eye,
  Building2,
  RotateCcw
} from 'lucide-react';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pausedJobs: 0,
    closedJobs: 0
  });
  const [companiesList, setCompaniesList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [jobTypeFilter, setJobTypeFilter] = useState('All Types');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [companyFilter, setCompanyFilter] = useState('All Companies');
  const [sortBy, setSortBy] = useState('newest');
  
  // Active dropdown state for card menu
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'All Status') params.status = statusFilter;
      if (jobTypeFilter !== 'All Types') params.jobType = jobTypeFilter;
      if (locationFilter !== 'All Locations') params.location = locationFilter;
      if (companyFilter !== 'All Companies') params.company = companyFilter;
      if (sortBy) params.sortBy = sortBy;

      const { data } = await axios.get('/api/jobs/my', { params });
      if (data.success) {
        setJobs(data.data || []);
        if (data.summary) {
          setSummary(data.summary);
        }
        if (data.companies) {
          setCompaniesList(data.companies);
        }
        if (data.locations) {
          setLocationsList(data.locations);
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApplyFilters = () => {
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All Status');
    setJobTypeFilter('All Types');
    setLocationFilter('All Locations');
    setCompanyFilter('All Companies');
    setSortBy('newest');
    setTimeout(() => {
      fetchJobs();
    }, 50);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await axios.delete(`/api/jobs/${id}`);
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
    setActiveDropdown(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/jobs/${id}/status`, { status: newStatus });
      fetchJobs();
    } catch (error) {
      console.error('Error updating status:', error);
    }
    setActiveDropdown(null);
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100/80 text-emerald-700 border border-emerald-200/80">Active</span>;
      case 'paused':
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100/80 text-amber-700 border border-amber-200/80">Paused</span>;
      case 'closed':
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">{status || 'Draft'}</span>;
    }
  };

  // Helper for initial / company icon
  const getCompanyLogo = (companyName) => {
    if (!companyName) return 'T';
    if (companyName.toLowerCase().includes('google')) return 'G';
    if (companyName.toLowerCase().includes('aws') || companyName.toLowerCase().includes('amazon')) return 'aws';
    if (companyName.toLowerCase().includes('microsoft')) return 'MS';
    return companyName.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1">
            <Link to="/recruiter/dashboard" className="hover:text-gray-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-semibold">My Jobs</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Jobs</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">
            Manage your job postings, track applications, and find the best talent.
          </p>
        </div>
        <Link
          to="/recruiter/jobs/new"
          className="inline-flex items-center justify-center gap-2 bg-[#f9571c] hover:bg-[#e04810] text-white text-sm font-bold px-5 py-3 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post a New Job</span>
        </Link>
      </div>

      {/* Summary Metric Cards (4 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 shrink-0">
            <Briefcase className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 leading-none">{summary.totalJobs}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Total Jobs</div>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100/80 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
            <span className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 leading-none">{summary.activeJobs}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Active Jobs</div>
          </div>
        </div>

        {/* Paused Jobs */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100/80 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
            <PauseCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 leading-none">{summary.pausedJobs}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Paused Jobs</div>
          </div>
        </div>

        {/* Closed Jobs */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100/80 rounded-xl flex items-center justify-center text-red-500 shrink-0">
            <XCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900 leading-none">{summary.closedJobs}</div>
            <div className="text-xs font-semibold text-gray-500 mt-1">Closed Jobs</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Job Cards & Search Toolbar */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Toolbar */}
          <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by job title, location, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-gray-50 border border-gray-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-800 placeholder:text-gray-400"
              />
            </form>

            {/* Quick Status Select */}
            <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs font-semibold bg-gray-50 border border-gray-200/80 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c] cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 px-3 text-xs font-semibold bg-gray-50 border border-gray-200/80 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most_applicants">Most Applicants</option>
              </select>
            </div>
          </div>

          {/* Job List Cards */}
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200/80 text-center text-gray-500 font-medium">
              Loading job postings...
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200/80 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-[#f9571c] mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">No job postings found</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query or filters to find what you are looking for.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          ) : (
            jobs.map((job) => {
              const companyName = job.company?.name || 'TechNova Solutions';
              const logoText = getCompanyLogo(companyName);
              const isMenuOpen = activeDropdown === job._id;

              return (
                <div
                  key={job._id}
                  className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow relative"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left Info Column */}
                    <div className="flex items-start gap-4">
                      {/* Logo Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-gray-900 text-white font-black flex items-center justify-center text-lg shrink-0 overflow-hidden shadow-xs">
                        {job.company?.logo ? (
                          <img src={job.company.logo} alt={companyName} className="w-full h-full object-cover" />
                        ) : logoText === 'aws' ? (
                          <span className="text-xs font-bold tracking-tighter text-amber-400">aws</span>
                        ) : logoText === 'G' ? (
                          <span className="text-blue-400 font-black">G</span>
                        ) : (
                          logoText
                        )}
                      </div>

                      {/* Title & Metadata */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                            {job.title}
                          </h3>
                          {getStatusBadge(job.status)}
                        </div>

                        <p className="text-xs font-semibold text-gray-500">{companyName}</p>

                        {/* Meta Tags Row */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 pt-0.5">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{job.location}</span>
                          </span>
                          <span className="flex items-center gap-1.5 capitalize">
                            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                            <span>{job.jobType}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>Posted {formatDate(job.createdAt)}</span>
                          </span>
                        </div>

                        {/* Skill Badges */}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {job.skills.slice(0, 5).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded-lg"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Applicants Stats & Actions */}
                    <div className="flex flex-col items-end gap-4 shrink-0 md:self-stretch justify-between">
                      {/* 3 Metric Box */}
                      <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5 flex items-center gap-4 text-center">
                        <div className="px-2">
                          <div className="text-sm font-black text-gray-900">
                            {job.stats?.totalApplicants ?? 0}
                          </div>
                          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            Applicants
                          </div>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div className="px-2">
                          <div className="text-sm font-black text-gray-900">
                            {job.stats?.inReviewCount ?? 0}
                          </div>
                          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            In Review
                          </div>
                        </div>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <div className="px-2">
                          <div className="text-sm font-black text-gray-900">
                            {job.stats?.interviewsCount ?? 0}
                          </div>
                          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            Interviews
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/recruiter/applicants?jobId=${job._id}`}
                          className="px-4 py-2 bg-white hover:bg-orange-50 text-[#f9571c] font-bold text-xs border border-orange-200 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Applicants</span>
                        </Link>

                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs border border-gray-200 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                          <span>Edit</span>
                        </Link>

                        {/* Dropdown Menu Trigger */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdown(isMenuOpen ? null : job._id)}
                            className="p-2 bg-white hover:bg-gray-100 text-gray-500 rounded-xl border border-gray-200 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 text-xs font-semibold">
                              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400">Change Status</div>
                              {job.status !== 'active' && (
                                <button
                                  onClick={() => handleStatusChange(job._id, 'active')}
                                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Mark Active</span>
                                </button>
                              )}
                              {job.status !== 'paused' && (
                                <button
                                  onClick={() => handleStatusChange(job._id, 'paused')}
                                  className="w-full text-left px-3 py-2 hover:bg-amber-50 text-amber-700 flex items-center gap-2"
                                >
                                  <PauseCircle className="w-3.5 h-3.5" />
                                  <span>Pause Job</span>
                                </button>
                              )}
                              {job.status !== 'closed' && (
                                <button
                                  onClick={() => handleStatusChange(job._id, 'closed')}
                                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Close Job</span>
                                </button>
                              )}
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => handleDelete(job._id)}
                                className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Job</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Sidebar Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Job Posting Tips */}
          <div className="bg-[#fffdf7] p-5 rounded-2xl border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-gray-900 font-extrabold text-base">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
                <Lightbulb className="w-5 h-5 fill-amber-300 stroke-[2]" />
              </div>
              <h3>Job Posting Tips</h3>
            </div>

            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span className="text-xs font-semibold text-gray-700 leading-snug">
                  Write a clear and specific job title
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span className="text-xs font-semibold text-gray-700 leading-snug">
                  Add detailed job description
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span className="text-xs font-semibold text-gray-700 leading-snug">
                  Mention key skills and requirements
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <span className="text-xs font-semibold text-gray-700 leading-snug">
                  Keep the information up to date
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  5
                </span>
                <span className="text-xs font-semibold text-gray-700 leading-snug">
                  Review applications regularly
                </span>
              </li>
            </ol>
          </div>

          {/* Card 2: Filter Jobs */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-extrabold text-base">
              <Filter className="w-4 h-4 text-[#f9571c]" />
              <h3>Filter Jobs</h3>
            </div>

            <div className="space-y-3.5">
              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs font-semibold bg-gray-50 border border-gray-200/80 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c]"
                >
                  <option value="All Status">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Job Type</label>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs font-semibold bg-gray-50 border border-gray-200/80 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c]"
                >
                  <option value="All Types">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs font-semibold bg-gray-50 border border-gray-200/80 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c]"
                >
                  <option value="All Locations">All Locations</option>
                  {locationsList.map((loc, i) => (
                    <option key={i} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Company</label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs font-semibold bg-gray-50 border border-gray-200/80 rounded-xl text-gray-700 focus:outline-none focus:border-[#f9571c]"
                >
                  <option value="All Companies">All Companies</option>
                  {companiesList.map((comp, i) => (
                    <option key={i} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={handleApplyFilters}
                className="w-full mt-2 py-2.5 bg-white hover:bg-orange-50 text-[#f9571c] font-bold text-xs border border-[#f9571c] rounded-xl transition-colors shadow-2xs"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Card 3: Inspirational / Branding Banner */}
          <div className="p-6 bg-[#fff6f0] rounded-2xl border border-orange-100 text-center relative overflow-hidden space-y-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#f9571c] mx-auto shadow-xs">
              <span className="w-6 h-6 rounded-full border-2 border-[#f9571c] flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-[#f9571c] rounded-full"></span>
              </span>
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg leading-snug tracking-tight font-serif italic">
              "Great teams start with great opportunities."
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
