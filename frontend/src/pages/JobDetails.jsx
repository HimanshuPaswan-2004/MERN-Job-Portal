import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Briefcase, BarChart, IndianRupee, Bookmark, Share2, 
  Users, Building, ChevronRight, Home, ExternalLink, ArrowRight, Clock, Search
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const [jobRes, similarRes] = await Promise.all([
          axios.get(`/api/jobs/${id}`),
          axios.get(`/api/jobs/${id}/similar`)
        ]);

        if (jobRes.data.success) {
          setJob(jobRes.data.data);
        }
        if (similarRes.data.success) {
          setSimilarJobs(similarRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
    // Scroll to top when id changes
    window.scrollTo(0, 0);
  }, [id]);

  // Utility to format salary
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not Disclosed';
    if (!min) return `Upto ₹${max/100000} LPA`;
    if (!max) return `₹${min/100000}+ LPA`;
    return `₹${min/100000} - ${max/100000} LPA`;
  };

  // Utility to format time ago
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center">
        <div className="flex flex-col items-center">
           <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
           <p className="text-gray-500 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-8">{error || "The job you're looking for doesn't exist or has been removed."}</p>
          <button onClick={() => navigate('/jobs')} className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-brand-700 transition-all">
            Browse Other Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f2] min-h-screen pb-20">
      {/* Decorative Header Background */}
      <div className="bg-[#FEF3E8] h-64 absolute top-0 left-0 w-full z-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[10%] w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute top-[20%] left-[-10%] w-72 h-72 bg-brand-200/50 rounded-full mix-blend-multiply blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 font-medium mb-6 bg-white/50 backdrop-blur-sm py-2 px-4 rounded-lg inline-flex">
          <Link to="/" className="flex items-center hover:text-brand-600 transition-colors"><Home size={14} className="mr-1"/> Home</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to="/jobs" className="hover:text-brand-600 transition-colors">Jobs</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900 truncate max-w-[200px] sm:max-w-xs">{job.title}</span>
        </div>

        {/* Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Job Details */}
          <div className="lg:w-[65%] xl:w-[70%]">
            
            {/* Top Header Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                 
                 <div className="flex gap-5">
                    <div className="w-20 h-20 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center p-3 flex-shrink-0">
                      {job.company?.logo ? (
                        <img src={job.company.logo} alt={job.company.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-3xl font-black text-brand-600">{job.company?.name?.charAt(0) || 'C'}</span>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2 leading-tight">
                        {job.title}
                      </h1>
                      <div className="flex items-center gap-2 text-lg font-bold text-gray-700 mb-4">
                        {job.company?.name || 'Company Name'}
                        <span className="bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                           <CheckCircle2 size={12} /> Verified Company
                        </span>
                      </div>
                    </div>
                 </div>

                 <div className="flex gap-3 md:flex-col lg:flex-row flex-shrink-0">
                   <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl font-semibold transition-colors shadow-sm">
                     <Bookmark size={18} /> <span className="hidden sm:inline">Save</span>
                   </button>
                   <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl font-semibold transition-colors shadow-sm">
                     <Share2 size={18} /> <span className="hidden sm:inline">Share</span>
                   </button>
                 </div>
               </div>

               {/* Meta Info Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-brand-600 shrink-0"><MapPin size={18}/></div>
                   <div>
                     <p className="text-xs text-gray-500 font-medium">Location</p>
                     <p className="text-sm font-bold text-gray-900 truncate">{job.location}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><Briefcase size={18}/></div>
                   <div>
                     <p className="text-xs text-gray-500 font-medium">Job Type</p>
                     <p className="text-sm font-bold text-gray-900 capitalize">{job.jobType.replace('-', ' ')}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0"><BarChart size={18}/></div>
                   <div>
                     <p className="text-xs text-gray-500 font-medium">Experience</p>
                     <p className="text-sm font-bold text-gray-900 capitalize">{job.experienceLevel}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0"><IndianRupee size={18}/></div>
                   <div>
                     <p className="text-xs text-gray-500 font-medium">Salary (LPA)</p>
                     <p className="text-sm font-bold text-gray-900">{formatSalary(job.salary?.min, job.salary?.max).replace(' LPA', '')}</p>
                   </div>
                 </div>
               </div>

               {/* Skills Tags & Apply Button */}
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill, idx) => (
                      <span key={idx} className="bg-orange-50 text-brand-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-orange-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="w-full sm:w-auto flex flex-col items-center gap-2">
                    <button className="w-full sm:w-auto bg-brand-600 text-white font-black text-lg py-3.5 px-8 rounded-xl shadow-lg hover:shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                      Apply Now <ArrowRight size={20} strokeWidth={3} />
                    </button>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={12}/> Posted {getTimeAgo(job.createdAt)}</span>
                      <span className="flex items-center gap-1"><Users size={12}/> {job.vacancies || 1} Vacancies</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
                 {['Job Overview', 'Company', 'Reviews', 'FAQs'].map((tab) => {
                   const isActive = activeTab === tab.toLowerCase().replace(' ', '-');
                   return (
                     <button 
                       key={tab}
                       onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                       className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${isActive ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                     >
                       {tab}
                     </button>
                   );
                 })}
               </div>

               <div className="p-6 md:p-8">
                 {activeTab === 'job-overview' && (
                   <div className="space-y-8">
                     
                     {/* Job Description */}
                     <section>
                       <div className="flex items-center gap-3 mb-4">
                         <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-600 flex items-center justify-center"><FileTextIcon size={18}/></div>
                         <h3 className="text-xl font-bold text-gray-900">Job Description</h3>
                       </div>
                       <div className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                         {job.description}
                       </div>
                     </section>

                     {/* Key Responsibilities */}
                     {job.responsibilities && job.responsibilities.length > 0 && (
                       <section>
                         <div className="flex items-center gap-3 mb-4">
                           <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-600 flex items-center justify-center"><ListIcon size={18}/></div>
                           <h3 className="text-xl font-bold text-gray-900">Key Responsibilities</h3>
                         </div>
                         <ul className="space-y-3">
                           {job.responsibilities.map((resp, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-gray-600 font-medium">
                               <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"></div>
                               <span className="leading-relaxed">{resp}</span>
                             </li>
                           ))}
                         </ul>
                       </section>
                     )}

                     {/* Requirements */}
                     {job.requirements && job.requirements.length > 0 && (
                       <section>
                         <div className="flex items-center gap-3 mb-4">
                           <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-600 flex items-center justify-center"><ScreenIcon size={18}/></div>
                           <h3 className="text-xl font-bold text-gray-900">Requirements</h3>
                         </div>
                         <ul className="space-y-3">
                           {job.requirements.map((req, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-gray-600 font-medium">
                               <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"></div>
                               <span className="leading-relaxed">{req}</span>
                             </li>
                           ))}
                         </ul>
                       </section>
                     )}
                   </div>
                 )}

                 {activeTab !== 'job-overview' && (
                   <div className="py-12 text-center text-gray-500 font-medium">
                     Content for {activeTab.replace('-', ' ')} will be displayed here.
                   </div>
                 )}
               </div>
            </div>
          </div>

          {/* Right Column - Sidebars */}
          <div className="lg:w-[35%] xl:w-[30%] space-y-6">
            
            {/* About Company Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-gray-900 mb-6">About Company</h3>
               
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-sm">
                   {job.company?.logo ? (
                      <img src={job.company.logo} alt={job.company.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-xl font-black text-brand-600">{job.company?.name?.charAt(0) || 'C'}</span>
                    )}
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className="font-bold text-gray-900 text-lg truncate">{job.company?.name}</h4>
                   <p className="text-sm text-gray-500 truncate line-clamp-2 leading-snug">{job.company?.description || 'Organize the world\'s information and make it universally accessible and useful.'}</p>
                 </div>
                 <button className="px-4 py-1.5 border border-brand-600 text-brand-600 hover:bg-brand-50 rounded-lg text-sm font-bold transition-colors">
                   Follow
                 </button>
               </div>

               <div className="grid grid-cols-2 gap-y-4 mb-6 pt-4 border-t border-gray-100">
                 <div className="flex items-start gap-2">
                   <Users size={16} className="text-gray-400 mt-0.5" />
                   <div>
                     <p className="text-xs text-gray-500 font-medium">Employees</p>
                     <p className="text-sm font-bold text-gray-900">{job.company?.companySize || '10K+'}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-2">
                   <MapPin size={16} className="text-gray-400 mt-0.5" />
                   <div>
                     <p className="text-xs text-gray-500 font-medium">Location</p>
                     <p className="text-sm font-bold text-gray-900">{job.company?.location?.split(',')[0] || 'Multiple'}</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-2 col-span-2">
                   <Building size={16} className="text-gray-400 mt-0.5" />
                   <div>
                     <p className="text-xs text-gray-500 font-medium">Industry</p>
                     <p className="text-sm font-bold text-gray-900">{job.company?.industry || 'Technology'}</p>
                   </div>
                 </div>
               </div>

               <a href={job.company?.website || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl font-bold transition-colors text-sm">
                 Visit Website <ExternalLink size={16} />
               </a>
            </div>

            {/* Similar Jobs Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Similar Jobs</h3>
                <Link to="/jobs" className="text-brand-600 text-sm font-bold hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14}/>
                </Link>
              </div>

              <div className="space-y-4">
                {similarJobs.length > 0 ? similarJobs.map(sJob => (
                  <div key={sJob._id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 p-2 shadow-sm shrink-0 flex items-center justify-center">
                       {sJob.company?.logo ? (
                         <img src={sJob.company.logo} alt={sJob.company.name} className="max-w-full max-h-full object-contain" />
                       ) : (
                         <span className="text-lg font-black text-brand-600">{sJob.company?.name?.charAt(0) || 'C'}</span>
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/jobs/${sJob._id}`} className="font-bold text-gray-900 text-sm truncate block group-hover:text-brand-600 transition-colors">
                        {sJob.title}
                      </Link>
                      <p className="text-xs text-gray-500 font-medium truncate">{sJob.company?.name}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] font-semibold text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={10}/> {sJob.location?.split(',')[0]}</span>
                        <span className="flex items-center gap-1"><IndianRupee size={10}/> {formatSalary(sJob.salary?.min, sJob.salary?.max).replace(' LPA', '')}</span>
                      </div>
                    </div>
                    <button className="text-gray-300 hover:text-brand-500 transition-colors">
                      <Bookmark size={18} />
                    </button>
                  </div>
                )) : (
                  <div className="text-center py-6 text-sm text-gray-500 font-medium bg-gray-50 rounded-xl">
                    No similar jobs found right now.
                  </div>
                )}
              </div>
            </div>

            {/* Job Alerts Widget */}
            <div className="bg-orange-50 rounded-3xl p-6 shadow-sm border border-orange-100 relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-orange-200/50 rounded-full blur-2xl"></div>
               <div className="relative z-10 flex gap-4">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-500 shadow-sm shrink-0">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-900 mb-1">Get job alerts for similar roles</h4>
                   <p className="text-xs text-gray-600 font-medium mb-4">Be the first to know when new jobs are posted.</p>
                   <button className="w-full bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50 font-bold py-2.5 rounded-xl shadow-sm transition-colors text-sm">
                     Set Job Alert
                   </button>
                 </div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Icon Components to keep import list clean
const FileTextIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const ListIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const ScreenIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;

export default JobDetails;
