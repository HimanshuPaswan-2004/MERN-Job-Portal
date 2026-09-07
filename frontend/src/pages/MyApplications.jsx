import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, SlidersHorizontal, MapPin, Briefcase, IndianRupee, Clock, Bell, Info } from 'lucide-react';

// Static Data based on Mockup
const applications = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
    location: 'Bangalore, India',
    type: 'Full Time',
    experience: '2 - 4 Years',
    salary: '₹25 - 40 LPA',
    status: 'In Review',
    appliedDate: '12 Aug 2025'
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    location: 'Hyderabad, India',
    type: 'Full Time',
    experience: '1 - 3 Years',
    salary: '₹18 - 32 LPA',
    status: 'Shortlisted',
    appliedDate: '05 Aug 2025'
  },
  {
    id: 3,
    title: 'Backend Developer',
    company: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    location: 'Bangalore, India',
    type: 'Full Time',
    experience: '2 - 5 Years',
    salary: '₹20 - 35 LPA',
    status: 'Applied',
    appliedDate: '28 Jul 2025'
  },
  {
    id: 4,
    title: 'Product Designer',
    company: 'Adobe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Systems_logo_and_wordmark.svg',
    location: 'Noida, India',
    type: 'Full Time',
    experience: '2 - 4 Years',
    salary: '₹15 - 28 LPA',
    status: 'Offered',
    appliedDate: '14 Jul 2025'
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'Swiggy',
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg',
    location: 'Bangalore, India',
    type: 'Full Time',
    experience: '2 - 5 Years',
    salary: '₹18 - 30 LPA',
    status: 'Rejected',
    appliedDate: '02 Jul 2025'
  }
];

const statsData = [
  { label: 'Applied', count: 3, color: 'bg-blue-500' },
  { label: 'In Review', count: 2, color: 'bg-orange-700' },
  { label: 'Shortlisted', count: 2, color: 'bg-purple-500' },
  { label: 'Interview', count: 1, color: 'bg-orange-400' },
  { label: 'Offered', count: 1, color: 'bg-green-500' },
  { label: 'Rejected', count: 2, color: 'bg-red-500' }
];

const getStatusStyles = (status) => {
  switch (status) {
    case 'In Review': return 'bg-green-50 text-green-600 border-green-100';
    case 'Shortlisted': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Applied': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Offered': return 'bg-green-50 text-green-600 border-green-100';
    case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

const MyApplications = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    { label: 'All', count: 12 },
    { label: 'Applied', count: 3 },
    { label: 'In Review', count: 2 },
    { label: 'Shortlisted', count: 2 },
    { label: 'Interview', count: 1 },
    { label: 'Offered', count: 1 },
    { label: 'Rejected', count: 2 }
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
              onClick={() => setActiveFilter(filter.label)}
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
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-gray-900"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer">
                <option>All Status</option>
                <option>In Review</option>
                <option>Shortlisted</option>
                <option>Applied</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer">
                <option>All Job Type</option>
                <option>Full Time</option>
                <option>Part Time</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <button className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <SlidersHorizontal size={16} /> Sort by: Latest <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-brand-200 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Job Info */}
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-white border border-gray-100 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-sm">
                    <img src={app.logo} alt={app.company} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">{app.title}</h3>
                    <p className="text-sm text-gray-500 font-medium">{app.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {app.location}</span>
                      <span className="flex items-center gap-1"><Briefcase size={12}/> {app.type}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {app.experience}</span>
                      <span className="flex items-center gap-1"><IndianRupee size={12}/> {app.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Status and Action */}
                <div className="flex flex-col md:items-end justify-between self-stretch">
                  <div className="flex justify-between items-center w-full md:w-auto md:justify-end gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${getStatusStyles(app.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {app.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600"><span className="text-xl rotate-90 inline-block font-bold">...</span></button>
                  </div>
                  
                  <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 mt-4 md:mt-0">
                    <div className="text-xs text-gray-400 font-medium">
                      Applied on<br/><span className="text-gray-600">{app.appliedDate}</span>
                    </div>
                    <Link to={`/jobs/${app.id}`} className="text-brand-600 border border-brand-200 hover:bg-brand-50 font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-1">
                      View Details <ChevronRight size={14} className="stroke-[3]" />
                    </Link>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination/Showing Entries */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500 font-medium">Showing 1-5 of 12 applications</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">&larr;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-500 text-white font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">&rarr;</button>
          </div>
        </div>

      </div>

      {/* Right Column: Widgets */}
      <div className="lg:w-80 space-y-6">
        
        {/* Application Stats Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Application Stats</h3>
          
          {/* Doughnut Chart Mock */}
          <div className="flex justify-center mb-6">
            <div className="relative w-36 h-36">
              {/* SVG Doughnut mimicking the design */}
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Applied - Blue */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="188.4" />
                {/* In Review - Orange */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#c2410c" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="213.5" className="transform rotate-[90deg] origin-center" />
                {/* Shortlisted - Purple */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="213.5" className="transform rotate-[144deg] origin-center" />
                {/* Interview - Light Orange */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#fb923c" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="230" className="transform rotate-[198deg] origin-center" />
                {/* Offered - Green */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#22c55e" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="230" className="transform rotate-[234deg] origin-center" />
                {/* Rejected - Red */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="213.5" className="transform rotate-[270deg] origin-center" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-gray-900 leading-none">12</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1 w-16">Total Applications</span>
              </div>
            </div>
          </div>
          
          {/* Stats List */}
          <div className="space-y-3">
            {statsData.map((stat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stat.color}`}></span>
                  <span className="text-gray-600 font-medium">{stat.label}</span>
                </div>
                <span className="font-bold text-gray-900">{stat.count}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-400 font-medium">Total Applications</span>
            <span className="font-bold text-gray-900">12</span>
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
