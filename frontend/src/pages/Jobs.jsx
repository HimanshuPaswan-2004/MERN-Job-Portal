import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Bookmark, Clock, ChevronDown, Filter, 
  ChevronLeft, ChevronRight, X, Briefcase, Sparkles, 
  Building2, ArrowRight, RotateCcw, Heart, CheckCircle2, SlidersHorizontal 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Jobs = () => {
  const { search: qs } = useLocation();
  const searchParams = new URLSearchParams(qs);
  
  // Initial filter state from URL if provided
  const initialKeyword = searchParams.get('search') || '';
  const initialLoc = searchParams.get('location') || '';

  // Applied Filters State (used for fetching)
  const [appliedFilters, setAppliedFilters] = useState({
    search: initialKeyword,
    location: initialLoc,
    jobType: [],
    experienceLevel: [],
    minSalary: 0,
    maxSalary: 100, // in LPA
    sortBy: 'latest',
    page: 1,
  });

  // Pending Filters State (used in sidebar UI before clicking Apply)
  const [pendingFilters, setPendingFilters] = useState({
    search: initialKeyword,
    location: initialLoc,
    jobType: [],
    experienceLevel: [],
    minSalary: 0,
    maxSalary: 100,
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ totalJobs: 0, totalPages: 1 });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Popular Quick Filter Pills
  const quickFilters = [
    { label: 'Remote', type: 'jobType', value: 'remote' },
    { label: 'Full Time', type: 'jobType', value: 'full-time' },
    { label: 'Fresher', type: 'experienceLevel', value: 'fresher' },
    { label: 'Internship', type: 'jobType', value: 'internship' },
  ];

  // Job Type options
  const jobTypeOptions = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'internship', label: 'Internship' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' }
  ];

  // Experience options
  const experienceOptions = [
    { value: 'fresher', label: 'Fresher' },
    { value: '1-2 years', label: '1 - 2 Years' },
    { value: '2-4 years', label: '2 - 4 Years' },
    { value: '5+ years', label: '5+ Years' }
  ];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (appliedFilters.search) params.append('search', appliedFilters.search);
      if (appliedFilters.location) params.append('location', appliedFilters.location);
      if (appliedFilters.jobType.length > 0) params.append('jobType', appliedFilters.jobType.join(','));
      if (appliedFilters.experienceLevel.length > 0) params.append('experienceLevel', appliedFilters.experienceLevel.join(','));
      if (appliedFilters.minSalary > 0) params.append('minSalary', appliedFilters.minSalary * 100000);
      if (appliedFilters.maxSalary < 100) params.append('maxSalary', appliedFilters.maxSalary * 100000);
      params.append('sortBy', appliedFilters.sortBy);
      params.append('page', appliedFilters.page);
      
      const res = await axios.get(`/api/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data.jobs || []);
        setPagination(res.data.data.pagination || { totalJobs: 0, totalPages: 1 });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...appliedFilters,
      ...pendingFilters,
      page: 1,
    });
    setIsMobileFiltersOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      search: '',
      location: '',
      jobType: [],
      experienceLevel: [],
      minSalary: 0,
      maxSalary: 100,
    };
    setPendingFilters(emptyFilters);
    setAppliedFilters({
      ...appliedFilters,
      ...emptyFilters,
      page: 1,
    });
  };

  const toggleSavedJob = (jobId, jobTitle) => {
    setSavedJobIds(prev => {
      const isSaved = prev.includes(jobId);
      const updated = isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
      showToast(isSaved ? `Removed "${jobTitle}" from saved jobs` : `Saved "${jobTitle}" to your bookmarks!`);
      return updated;
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const removeFilterChip = (type, value) => {
    let updatedArray = [];
    if (type === 'jobType') {
      updatedArray = appliedFilters.jobType.filter(item => item !== value);
      setPendingFilters({ ...pendingFilters, jobType: updatedArray });
      setAppliedFilters({ ...appliedFilters, jobType: updatedArray, page: 1 });
    } else if (type === 'experienceLevel') {
      updatedArray = appliedFilters.experienceLevel.filter(item => item !== value);
      setPendingFilters({ ...pendingFilters, experienceLevel: updatedArray });
      setAppliedFilters({ ...appliedFilters, experienceLevel: updatedArray, page: 1 });
    } else if (type === 'search') {
      setPendingFilters({ ...pendingFilters, search: '' });
      setAppliedFilters({ ...appliedFilters, search: '', page: 1 });
    } else if (type === 'location') {
      setPendingFilters({ ...pendingFilters, location: '' });
      setAppliedFilters({ ...appliedFilters, location: '', page: 1 });
    }
  };

  const togglePendingArrayFilter = (type, value) => {
    const current = pendingFilters[type];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    
    setPendingFilters({ ...pendingFilters, [type]: updated });
  };

  const toggleQuickFilter = (type, value) => {
    const current = appliedFilters[type];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    setPendingFilters({ ...pendingFilters, [type]: updated });
    setAppliedFilters({ ...appliedFilters, [type]: updated, page: 1 });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not Disclosed';
    if (!min) return `Up to ₹${max/100000} LPA`;
    if (!max) return `₹${min/100000}+ LPA`;
    return `₹${min/100000} - ${max/100000} LPA`;
  };
  
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 14) return `1 week ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays/7)} weeks ago`;
    return `${Math.floor(diffInDays/30)} months ago`;
  };

  const activeFilterCount = 
    appliedFilters.jobType.length + 
    appliedFilters.experienceLevel.length + 
    (appliedFilters.search ? 1 : 0) + 
    (appliedFilters.location ? 1 : 0) +
    (appliedFilters.minSalary > 0 ? 1 : 0);

  return (
    <div className="bg-[#fcf9f2] min-h-screen pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-bounce">
          <Sparkles className="text-brand-400" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="bg-gradient-to-b from-[#FEF3E8] to-[#fcf9f2] pt-12 pb-10 border-b border-orange-100/60 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-4 right-1/4 w-72 h-72 bg-orange-200/40 rounded-full mix-blend-multiply blur-3xl pointer-events-none"></div>
        <div className="absolute top-12 left-10 w-48 h-48 bg-brand-200/40 rounded-full mix-blend-multiply blur-2xl pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-4xl mx-auto text-center mb-8">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-brand-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 border border-orange-200">
              <Sparkles size={14} /> Over 5,000+ Active Tech Jobs
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1A1A2E] tracking-tight leading-tight mb-4">
              Explore <span className="text-brand-600 underline decoration-brand-300 decoration-wavy underline-offset-8">Career</span> Opportunities
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Discover verified roles at top tech companies, startups, and Fortune 500 enterprises.
            </p>
          </div>

          {/* Quick Search Box Bar in Hero */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-3 shadow-xl border border-orange-100/80 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-3">
              
              {/* Keyword Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50/80 rounded-2xl w-full border border-gray-100 focus-within:border-brand-500 focus-within:bg-white transition-all">
                <Search size={20} className="text-brand-500 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Job title, skills, or company..." 
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none"
                  value={pendingFilters.search}
                  onChange={(e) => setPendingFilters({...pendingFilters, search: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
                {pendingFilters.search && (
                  <button onClick={() => setPendingFilters({...pendingFilters, search: ''})} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50/80 rounded-2xl w-full border border-gray-100 focus-within:border-brand-500 focus-within:bg-white transition-all">
                <MapPin size={20} className="text-brand-500 shrink-0" />
                <input 
                  type="text" 
                  placeholder="City, state, or 'Remote'..." 
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none"
                  value={pendingFilters.location}
                  onChange={(e) => setPendingFilters({...pendingFilters, location: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
                {pendingFilters.location && (
                  <button onClick={() => setPendingFilters({...pendingFilters, location: ''})} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Search Button */}
              <button 
                onClick={handleApplyFilters}
                className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 transition-all flex items-center justify-center gap-2 text-sm shrink-0"
              >
                <span>Find Jobs</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-gray-500 mr-2 flex items-center gap-1">
              <SlidersHorizontal size={14} /> Popular:
            </span>
            {quickFilters.map((qf) => {
              const isSelected = appliedFilters[qf.type].includes(qf.value);
              return (
                <button
                  key={qf.value}
                  onClick={() => toggleQuickFilter(qf.type, qf.value)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all border ${
                    isSelected 
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-400 hover:text-brand-600'
                  }`}
                >
                  {qf.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Mobile Filter Header Toggle */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{pagination.totalJobs} Jobs Available</h2>
            <p className="text-xs text-gray-500 font-medium">Showing matching listings</p>
          </div>
          <button 
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            <Filter size={18} className="text-brand-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-brand-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar - Filters */}
          <div className={`lg:w-[300px] xl:w-[320px] flex-shrink-0 ${isMobileFiltersOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}`}>
            
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-brand-600" />
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Filters</h3>
                  {activeFilterCount > 0 && (
                    <span className="bg-orange-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>

                {isMobileFiltersOpen ? (
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="text-gray-500 hover:text-gray-900 p-1">
                    <X size={20} />
                  </button>
                ) : (
                  <button onClick={handleClearFilters} className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    <RotateCcw size={12} /> Clear All
                  </button>
                )}
              </div>

              {/* Keyword Search inside Sidebar */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Job Title / Skills</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. React, Node, Frontend" 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    value={pendingFilters.search}
                    onChange={(e) => setPendingFilters({...pendingFilters, search: e.target.value})}
                  />
                </div>
              </div>

              {/* Location inside Sidebar */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Bangalore, Remote" 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    value={pendingFilters.location}
                    onChange={(e) => setPendingFilters({...pendingFilters, location: e.target.value})}
                  />
                </div>
              </div>

              {/* Job Type Options */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Job Type</label>
                <div className="space-y-2.5">
                  {jobTypeOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500 cursor-pointer accent-brand-600"
                        checked={pendingFilters.jobType.includes(option.value)}
                        onChange={() => togglePendingArrayFilter('jobType', option.value)}
                      />
                      <span className="text-xs font-bold text-gray-700 group-hover:text-brand-600 transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Options */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Experience Level</label>
                <div className="space-y-2.5">
                  {experienceOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500 cursor-pointer accent-brand-600"
                        checked={pendingFilters.experienceLevel.includes(option.value)}
                        onChange={() => togglePendingArrayFilter('experienceLevel', option.value)}
                      />
                      <span className="text-xs font-bold text-gray-700 group-hover:text-brand-600 transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Min Salary</label>
                  <span className="text-xs font-bold text-brand-600">₹{pendingFilters.minSalary} LPA+</span>
                </div>
                <div className="px-1">
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    step="1"
                    value={pendingFilters.minSalary}
                    onChange={(e) => setPendingFilters({...pendingFilters, minSalary: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                    <span>₹0 LPA</span>
                    <span>₹50+ LPA</span>
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button 
                onClick={handleApplyFilters}
                className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-2xl shadow-md hover:bg-brand-700 hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Apply Filters</span>
              </button>
              
            </div>
          </div>

          {/* Right Area - Job Feed */}
          <div className="flex-grow">
            
            {/* Feed Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg font-black text-gray-900 hidden lg:block">
                  {pagination.totalJobs} {pagination.totalJobs === 1 ? 'Job' : 'Jobs'} Found
                </h2>
                
                {/* Active Filter Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {appliedFilters.search && (
                    <span className="inline-flex items-center gap-1 bg-orange-50 text-brand-700 border border-brand-200 text-xs font-bold px-3 py-1 rounded-full">
                      "{appliedFilters.search}"
                      <button onClick={() => removeFilterChip('search')}><X size={12} className="hover:text-brand-900 ml-0.5"/></button>
                    </span>
                  )}
                  {appliedFilters.location && (
                    <span className="inline-flex items-center gap-1 bg-orange-50 text-brand-700 border border-brand-200 text-xs font-bold px-3 py-1 rounded-full">
                      📍 {appliedFilters.location}
                      <button onClick={() => removeFilterChip('location')}><X size={12} className="hover:text-brand-900 ml-0.5"/></button>
                    </span>
                  )}
                  {appliedFilters.jobType.map(type => (
                    <span key={type} className="inline-flex items-center gap-1 bg-orange-50 text-brand-700 border border-brand-200 text-xs font-bold px-3 py-1 rounded-full capitalize">
                      {jobTypeOptions.find(o => o.value === type)?.label || type}
                      <button onClick={() => removeFilterChip('jobType', type)}><X size={12} className="hover:text-brand-900 ml-0.5"/></button>
                    </span>
                  ))}
                  {appliedFilters.experienceLevel.map(lvl => (
                    <span key={lvl} className="inline-flex items-center gap-1 bg-orange-50 text-brand-700 border border-brand-200 text-xs font-bold px-3 py-1 rounded-full capitalize">
                      {experienceOptions.find(o => o.value === lvl)?.label || lvl}
                      <button onClick={() => removeFilterChip('experienceLevel', lvl)}><X size={12} className="hover:text-brand-900 ml-0.5"/></button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 ml-auto shrink-0">
                <span>Sort by:</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 py-1.5 pl-3 pr-8 rounded-xl font-bold text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-xs cursor-pointer"
                    value={appliedFilters.sortBy}
                    onChange={(e) => setAppliedFilters({...appliedFilters, sortBy: e.target.value, page: 1})}
                  >
                    <option value="latest">Latest First</option>
                    <option value="salary">Highest Salary</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Jobs Cards Feed */}
            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 animate-pulse flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 rounded-lg w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                      <div className="flex gap-2 pt-2">
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center max-w-lg mx-auto my-6">
                <div className="w-16 h-16 bg-orange-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No matching jobs found</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">
                  We couldn't find any positions matching your current search parameters. Try clearing some filters.
                </p>
                <button 
                  onClick={handleClearFilters} 
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors text-sm inline-flex items-center gap-2"
                >
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => {
                  const isSaved = savedJobIds.includes(job._id);
                  return (
                    <div 
                      key={job._id} 
                      className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100 hover:border-brand-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col sm:flex-row gap-5 relative overflow-hidden"
                    >
                      
                      {/* Company Logo / Avatar */}
                      <div className="w-16 h-16 rounded-2xl border border-gray-100 flex items-center justify-center flex-shrink-0 bg-gray-50 p-2 shadow-xs group-hover:scale-105 transition-transform">
                        {job.company?.logo ? (
                          <img src={job.company.logo} alt={job.company.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brand-50 to-orange-100 text-brand-600 rounded-xl flex items-center justify-center font-black text-2xl">
                            {job.company?.name?.charAt(0) || 'C'}
                          </div>
                        )}
                      </div>
                      
                      {/* Content Details Area */}
                      <div className="flex-grow flex flex-col md:flex-row justify-between gap-4">
                        
                        {/* Left Info */}
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Link 
                              to={`/jobs/${job._id}`} 
                              className="text-xl font-extrabold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1"
                            >
                              {job.title}
                            </Link>
                            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                              <CheckCircle2 size={10} /> Verified
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-3 font-bold flex items-center gap-1.5">
                            <Building2 size={14} className="text-gray-400" />
                            <span>{job.company?.name || 'Top Company'}</span>
                          </p>
                          
                          {/* Metadata Badges Grid */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-xs text-gray-600 font-semibold">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                              <MapPin size={14} className="text-brand-500" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 capitalize">
                              <Briefcase size={14} className="text-brand-500" /> {jobTypeOptions.find(o => o.value === job.jobType)?.label || job.jobType}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                              <Clock size={14} className="text-brand-500" /> {job.experienceLevel}
                            </span>
                            <span className="flex items-center gap-1.5 bg-orange-50 text-brand-700 px-2.5 py-1 rounded-lg border border-orange-100 font-bold">
                              ₹ {formatSalary(job.salary?.min, job.salary?.max)}
                            </span>
                          </div>
                          
                          {/* Skill Tags */}
                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {job.skills.slice(0, 4).map((skill, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-700 text-[11px] font-bold px-3 py-1 rounded-full hover:bg-orange-50 hover:text-brand-700 transition-colors">
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 4 && (
                                <span className="bg-gray-50 text-gray-500 border border-gray-200 text-[10px] font-bold px-2 py-1 rounded-full">
                                  +{job.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Right Action Button & Bookmark */}
                        <div className="flex md:flex-col justify-between items-center md:items-end md:min-w-[140px] border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 shrink-0">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-gray-400">
                              {getTimeAgo(job.createdAt)}
                            </span>
                            <button 
                              onClick={() => toggleSavedJob(job._id, job.title)}
                              className={`p-2 rounded-xl transition-all ${
                                isSaved 
                                  ? 'bg-red-50 text-red-500' 
                                  : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
                              }`}
                              title={isSaved ? "Remove bookmark" : "Save job"}
                            >
                              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                            </button>
                          </div>

                          <div className="w-full sm:w-auto md:w-full md:mt-auto">
                            <Link 
                              to={`/jobs/${job._id}`} 
                              className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md hover:shadow-brand-600/30 transition-all text-xs text-center flex items-center justify-center gap-1.5 w-full group/btn"
                            >
                              <span>View Details</span>
                              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 mt-10 pt-6">
                <p className="text-xs text-gray-500 hidden sm:block font-bold">
                  Showing Page <span className="text-gray-900">{pagination.page}</span> of <span className="text-gray-900">{pagination.totalPages}</span> ({pagination.totalJobs} total jobs)
                </p>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button 
                    disabled={pagination.page === 1}
                    onClick={() => setAppliedFilters({...appliedFilters, page: pagination.page - 1})}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs font-bold text-xs flex items-center gap-1"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setAppliedFilters({...appliedFilters, page: i + 1})}
                        className={`w-9 h-9 rounded-xl text-xs font-black flex items-center justify-center transition-all ${
                          pagination.page === i + 1 
                            ? 'bg-brand-600 text-white shadow-md' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setAppliedFilters({...appliedFilters, page: pagination.page + 1})}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs font-bold text-xs flex items-center gap-1"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
