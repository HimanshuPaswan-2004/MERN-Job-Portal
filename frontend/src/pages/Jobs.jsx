import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bookmark, Clock, ChevronDown, Filter, ChevronLeft, ChevronRight, X, Briefcase } from 'lucide-react';
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
      // Build query string
      const params = new URLSearchParams();
      if (appliedFilters.search) params.append('search', appliedFilters.search);
      if (appliedFilters.location) params.append('location', appliedFilters.location);
      if (appliedFilters.jobType.length > 0) params.append('jobType', appliedFilters.jobType.join(','));
      if (appliedFilters.experienceLevel.length > 0) params.append('experienceLevel', appliedFilters.experienceLevel.join(','));
      if (appliedFilters.minSalary > 0) params.append('minSalary', appliedFilters.minSalary * 100000); // converting LPA to actual value
      if (appliedFilters.maxSalary < 100) params.append('maxSalary', appliedFilters.maxSalary * 100000);
      params.append('sortBy', appliedFilters.sortBy);
      params.append('page', appliedFilters.page);
      
      const res = await axios.get(`/api/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data.jobs);
        setPagination(res.data.data.pagination);
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
      page: 1, // reset to page 1 on new filter
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
    }
  };

  const togglePendingArrayFilter = (type, value) => {
    const current = pendingFilters[type];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    
    setPendingFilters({ ...pendingFilters, [type]: updated });
  };

  // Convert salary nicely
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not Disclosed';
    if (!min) return `Upto ₹${max/100000} LPA`;
    if (!max) return `₹${min/100000}+ LPA`;
    return `₹${min/100000} - ${max/100000} LPA`;
  };
  
  // Convert date nicely
  const getTimeAgo = (dateString) => {
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

  return (
    <div className="bg-[#fcf9f2] min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-[#FEF3E8] pt-16 pb-0 border-b border-[#FEF3E8] relative overflow-hidden flex items-end min-h-[280px]">
        
        {/* Background shapes */}
        <div className="absolute top-4 right-1/4 w-40 h-40 bg-orange-200/50 rounded-full mix-blend-multiply blur-2xl"></div>
        <div className="absolute top-12 right-10 w-24 h-24 bg-brand-200/50 rounded-full mix-blend-multiply blur-xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col md:flex-row items-end justify-between pb-8">
          
          {/* Left Text */}
          <div className="max-w-md w-full md:w-1/3 pb-4">
            <h1 className="text-[3rem] font-black text-[#1A1A2E] tracking-tight leading-tight mb-2">
              Explore <span className="text-brand-600">Jobs</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium">Find the right job, right now.</p>
          </div>

          {/* Middle Handwriting Text */}
          <div className="hidden lg:block w-1/4 pb-12 pl-8">
            <div className="transform -rotate-6">
              <p className="text-2xl font-caveat text-gray-700 leading-tight" style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}>
                Better<br/>Jobs<br/>Brighter<br/>Future
              </p>
              <div className="h-1 w-20 bg-orange-500 rounded-full mt-1 ml-4 -rotate-2"></div>
            </div>
          </div>
          
          {/* Middle Image */}
          <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-[20%] lg:-translate-x-1/2 w-80 lg:w-[450px]">
             <img 
               src="/hero-girl.jpg" 
               alt="Professional Woman" 
               className="w-full object-contain mix-blend-multiply drop-shadow-sm max-h-[350px]" 
             />
          </div>

          {/* Right Quote */}
          <div className="hidden md:block w-1/3 text-right pb-16 pr-8 z-20">
             <div className="relative inline-block text-left">
               <span className="absolute -top-6 -left-8 text-5xl font-serif text-brand-500 font-bold">"</span>
               <p className="text-2xl font-caveat text-gray-700 leading-tight italic font-semibold" style={{ fontFamily: "'Caveat', cursive" }}>
                 Opportunities<br/>don't happen,<br/>you create them."
               </p>
               <div className="absolute -bottom-4 right-0">
                  <svg width="40" height="15" viewBox="0 0 40 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 13C12.5 4 25.5 2 38 4" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M30 11C32.5 10 35.5 8 38 4" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
               </div>
             </div>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Mobile Filter Toggle */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
           <h2 className="text-xl font-bold text-gray-900">{pagination.totalJobs} Jobs Found</h2>
           <button 
             onClick={() => setIsMobileFiltersOpen(true)}
             className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-sm font-medium"
           >
             <Filter size={16} /> Filters
           </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar - Filters */}
          <div className={`lg:w-[280px] xl:w-[320px] flex-shrink-0 ${isMobileFiltersOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block sticky top-24'}`}>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                {isMobileFiltersOpen ? (
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="text-gray-500 hover:text-gray-900">
                    <X size={20} />
                  </button>
                ) : (
                  <button onClick={handleClearFilters} className="text-sm font-medium text-brand-600 hover:text-brand-700">Clear All</button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Job title, keywords..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    value={pendingFilters.search}
                    onChange={(e) => setPendingFilters({...pendingFilters, search: e.target.value})}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Select location" 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                    value={pendingFilters.location}
                    onChange={(e) => setPendingFilters({...pendingFilters, location: e.target.value})}
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-4">Job Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {jobTypeOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500 cursor-pointer"
                        checked={pendingFilters.jobType.includes(option.value)}
                        onChange={() => togglePendingArrayFilter('jobType', option.value)}
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-4">Experience Level</label>
                <div className="space-y-3">
                  {experienceOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500 cursor-pointer"
                        checked={pendingFilters.experienceLevel.includes(option.value)}
                        onChange={() => togglePendingArrayFilter('experienceLevel', option.value)}
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-4">Salary Range</label>
                <div className="px-2">
                   <input 
                     type="range" 
                     min="0" 
                     max="100" 
                     value={pendingFilters.minSalary}
                     onChange={(e) => setPendingFilters({...pendingFilters, minSalary: parseInt(e.target.value)})}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                   />
                   <div className="flex justify-between mt-3 text-xs font-bold text-gray-500">
                     <span>₹0</span>
                     <span>₹50+ LPA</span>
                   </div>
                </div>
              </div>

              <button 
                onClick={handleApplyFilters}
                className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-brand-700 hover:shadow-lg transition-all"
              >
                Apply Filters
              </button>
              
            </div>
          </div>

          {/* Right Area - Job Feed */}
          <div className="flex-grow">
            
            {/* Feed Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                 <h2 className="text-xl font-bold text-gray-900 hidden lg:block">{pagination.totalJobs} Jobs Found</h2>
                 
                 {/* Active Filter Chips */}
                 <div className="flex flex-wrap gap-2">
                   {appliedFilters.jobType.map(type => (
                     <span key={type} className="inline-flex items-center gap-1 bg-orange-50 text-brand-700 border border-brand-100 text-xs font-semibold px-3 py-1 rounded-full">
                       {jobTypeOptions.find(o => o.value === type)?.label || type}
                       <button onClick={() => removeFilterChip('jobType', type)}><X size={12} className="hover:text-brand-900 ml-1"/></button>
                     </span>
                   ))}
                   {appliedFilters.experienceLevel.map(lvl => (
                     <span key={lvl} className="inline-flex items-center gap-1 bg-orange-50 text-brand-700 border border-brand-100 text-xs font-semibold px-3 py-1 rounded-full">
                       {experienceOptions.find(o => o.value === lvl)?.label || lvl}
                       <button onClick={() => removeFilterChip('experienceLevel', lvl)}><X size={12} className="hover:text-brand-900 ml-1"/></button>
                     </span>
                   ))}
                 </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm ml-auto">
                <span className="text-gray-500 whitespace-nowrap">Sort by:</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-gray-200 text-gray-900 py-1.5 pl-3 pr-8 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 shadow-sm"
                    value={appliedFilters.sortBy}
                    onChange={(e) => setAppliedFilters({...appliedFilters, sortBy: e.target.value, page: 1})}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="salary">Highest Salary</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="flex gap-2"><div className="h-6 w-16 bg-gray-200 rounded"></div></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-brand-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={handleClearFilters} className="text-brand-600 font-medium hover:underline">Clear all filters</button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-brand-300 hover:shadow-md transition-all group flex flex-col sm:flex-row gap-6">
                    
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-2xl border border-gray-100 flex items-center justify-center flex-shrink-0 bg-white p-2 shadow-sm">
                      {job.company?.logo ? (
                        <img src={job.company.logo} alt={job.company.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-50 to-orange-50 text-brand-600 rounded-xl flex items-center justify-center font-bold text-2xl">
                          {job.company?.name?.charAt(0) || 'C'}
                        </div>
                      )}
                    </div>
                    
                    {/* Job Details */}
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-3">
                        <div>
                          <Link to={`/jobs/${job._id}`} className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                            {job.title}
                          </Link>
                          <p className="text-gray-600 text-sm mt-1 font-medium">{job.company?.name || 'Unknown Company'}</p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-xs font-medium text-gray-500 hidden sm:block">{getTimeAgo(job.createdAt)}</span>
                          <button className="text-gray-400 hover:text-brand-600 transition-colors p-1">
                            <Bookmark size={20} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5"><MapPin size={16}/> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={16}/> {jobTypeOptions.find(o => o.value === job.jobType)?.label || job.jobType}</span>
                        <span className="flex items-center gap-1.5"><Clock size={16}/> {experienceOptions.find(o => o.value === job.experienceLevel)?.label || job.experienceLevel}</span>
                        <span className="flex items-center gap-1.5 text-gray-700">₹ {formatSalary(job.salary?.min, job.salary?.max)}</span>
                      </div>
                      
                      {/* Tags & Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                        <div className="flex flex-wrap gap-2">
                          {job.skills?.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="bg-orange-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full border border-orange-100">
                              {skill}
                            </span>
                          ))}
                          {job.skills?.length > 4 && (
                            <span className="bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium px-2 py-1 rounded-full">+{job.skills.length - 4}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                           <span className="text-xs font-medium text-gray-500 sm:hidden">{getTimeAgo(job.createdAt)}</span>
                           <Link to={`/jobs/${job._id}`} className="bg-brand-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-brand-700 transition-colors shadow-sm text-sm text-center">
                             Apply Now
                           </Link>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 mt-8 pt-6">
                <p className="text-sm text-gray-600 hidden sm:block font-medium">
                  Showing <span className="font-bold text-gray-900">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-bold text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.totalJobs)}</span> of <span className="font-bold text-gray-900">{pagination.totalJobs}</span> jobs
                </p>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <button 
                    disabled={pagination.page === 1}
                    onClick={() => setAppliedFilters({...appliedFilters, page: pagination.page - 1})}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setAppliedFilters({...appliedFilters, page: i + 1})}
                        className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-colors ${pagination.page === i + 1 ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setAppliedFilters({...appliedFilters, page: pagination.page + 1})}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
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
