import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, Clock, Users, Trophy, MapPin, Briefcase, IndianRupee,
  CheckCircle2, Circle, ArrowRight, Flame, Bookmark
} from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: { total: 0, inReview: 0, interviews: 0, offers: 0 },
    recentApplications: [],
    recommendedJobs: [],
    latestJobs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/applications/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let completed = 0;
    const totalFields = 5;
    
    if (user.name && user.email) completed++; // Basic info
    if (user.education && user.education.length > 0) completed++;
    if (user.skills && user.skills.length > 0) completed++;
    if (user.experience && user.experience.length > 0) completed++;
    if (user.resume) completed++;
    
    return (completed / totalFields) * 100;
  };

  const profileScore = calculateProfileCompletion();

  // Helper formats
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not Disclosed';
    if (!min) return `Upto ₹${max/100000} LPA`;
    if (!max) return `₹${min/100000}+ LPA`;
    return `₹${min/100000} - ${max/100000} LPA`;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const diffInDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return `${Math.floor(diffInDays/7)} weeks ago`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Applied': 'bg-orange-50 text-orange-600',
      'In Review': 'bg-blue-50 text-blue-600',
      'Shortlisted': 'bg-purple-50 text-purple-600',
      'Rejected': 'bg-red-50 text-red-600',
      'Hired': 'bg-green-50 text-green-600'
    };
    return (
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${styles[status] || styles['Applied']}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Welcome Banner */}
        <div className="lg:w-2/3 bg-[#FEF3E8] rounded-3xl p-8 relative overflow-hidden flex justify-between items-center border border-orange-100">
           <div className="relative z-10">
             <p className="text-orange-800 font-bold mb-1">Welcome back,</p>
             <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-2">
               {user?.name?.split(' ')[0] || 'Himanshu'} <span className="text-3xl">👋</span>
             </h1>
             <p className="text-gray-700 font-medium mb-4">Keep going! Great things take consistency.</p>
             <p className="italic text-gray-500 text-sm">"Apply. Learn. Improve. Get Hired."</p>
           </div>
           
           <div className="hidden md:block relative z-10 text-right pr-4">
             <div className="transform rotate-12 -mt-4 mb-2">
               <p className="font-caveat text-xl text-gray-800 font-bold">Better Skills<br/>Brighter<br/><span className="text-brand-600">Future</span></p>
               <div className="w-12 h-1 bg-brand-500 rounded-full mt-1 ml-auto"></div>
             </div>
           </div>
           
           {/* Abstract Background Elements */}
           <div className="absolute right-[-10%] bottom-[-20%] w-64 h-64 bg-orange-200/50 rounded-full blur-3xl"></div>
           <div className="absolute top-[-10%] right-[20%] w-32 h-32 bg-brand-200/50 rounded-full blur-2xl"></div>
        </div>

        {/* Profile Completion Widget */}
        <div className="lg:w-1/3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-900">Profile Completion</h3>
               <span className="font-black text-brand-600">{profileScore}%</span>
             </div>
             <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
               <div className="bg-brand-600 h-2.5 rounded-full" style={{ width: `${profileScore}%` }}></div>
             </div>
             
             <div className="space-y-3 mb-6">
               <div className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 size={16} className="text-green-500"/> Basic Information</div>
               <div className="flex items-center gap-2 text-sm text-gray-600">{user?.education?.length ? <CheckCircle2 size={16} className="text-green-500"/> : <Circle size={16} className="text-gray-300"/>} Education Details</div>
               <div className="flex items-center gap-2 text-sm text-gray-600">{user?.skills?.length ? <CheckCircle2 size={16} className="text-green-500"/> : <Circle size={16} className="text-gray-300"/>} Add Skills</div>
               <div className="flex items-center gap-2 text-sm text-gray-600">{user?.experience?.length ? <CheckCircle2 size={16} className="text-green-500"/> : <Circle size={16} className="text-gray-300"/>} Add Experience</div>
               <div className="flex items-center gap-2 text-sm text-gray-600">{user?.resume ? <CheckCircle2 size={16} className="text-green-500"/> : <Circle size={16} className="text-gray-300"/>} Upload Resume</div>
             </div>
           </div>
           
           <button className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors flex justify-center items-center gap-2 text-sm">
             Complete Your Profile <ArrowRight size={16} />
           </button>
        </div>
        
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:border-brand-200 transition-colors">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-brand-600 flex items-center justify-center shrink-0"><FileText size={20}/></div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">{data.stats.total}</h2>
            <p className="text-xs text-gray-500 font-medium">Total Applications</p>
            <p className="text-xs text-green-500 font-bold mt-1">&uarr; 2 this month</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:border-brand-200 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Clock size={20}/></div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">{data.stats.inReview}</h2>
            <p className="text-xs text-gray-500 font-medium">In Review</p>
            <p className="text-xs text-green-500 font-bold mt-1">&uarr; 1 this week</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:border-brand-200 transition-colors">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Users size={20}/></div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">{data.stats.interviews}</h2>
            <p className="text-xs text-gray-500 font-medium">Interviews</p>
            <p className="text-xs text-gray-400 font-bold mt-1">No change</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:border-brand-200 transition-colors">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0"><Trophy size={20}/></div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">{data.stats.offers}</h2>
            <p className="text-xs text-gray-500 font-medium">Offers</p>
            <p className="text-xs text-green-500 font-bold mt-1">&uarr; 1 this month</p>
          </div>
        </div>
      </div>

      {/* Main Grid area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recommended Jobs */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Flame size={20} className="text-brand-500"/> Recommended Jobs for You</h3>
             <Link to="/jobs" className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline">View All <ArrowRight size={14}/></Link>
           </div>
           
           <div className="space-y-4">
             {data.recommendedJobs.map(job => (
               <div key={job._id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-brand-200 transition-all group">
                 <div className="flex justify-between items-start">
                   <div className="flex gap-4">
                     <div className="w-14 h-14 bg-white border border-gray-100 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-sm">
                       {job.company?.logo ? <img src={job.company.logo} alt={job.company.name} className="max-w-full max-h-full object-contain" /> : <span className="font-bold text-brand-600">{job.company?.name?.charAt(0) || 'C'}</span>}
                     </div>
                     <div>
                       <Link to={`/jobs/${job._id}`} className="font-bold text-gray-900 text-lg group-hover:text-brand-600 transition-colors">{job.title}</Link>
                       <p className="text-sm text-gray-500 font-medium">{job.company?.name}</p>
                       <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-gray-500">
                         <span className="flex items-center gap-1"><MapPin size={12}/> {job.location?.split(',')[0]}</span>
                         <span className="flex items-center gap-1"><Briefcase size={12}/> {job.jobType}</span>
                         <span className="flex items-center gap-1"><Clock size={12}/> {job.experienceLevel}</span>
                         <span className="flex items-center gap-1"><IndianRupee size={12}/> {formatSalary(job.salary?.min, job.salary?.max).replace(' LPA', '')}</span>
                       </div>
                       <div className="flex gap-2 mt-3">
                         {job.skills?.slice(0,4).map((skill, i) => (
                           <span key={i} className="text-[10px] font-bold px-2 py-1 bg-orange-50 text-brand-600 rounded-md border border-orange-100">{skill}</span>
                         ))}
                       </div>
                     </div>
                   </div>
                   <div className="flex flex-col items-end justify-between h-full">
                     <button className="text-gray-300 hover:text-brand-500 mb-6"><Bookmark size={20}/></button>
                     <Link to={`/jobs/${job._id}`} className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-5 rounded-lg text-sm shadow-sm transition-colors">Apply Now</Link>
                   </div>
                 </div>
               </div>
             ))}
             {data.recommendedJobs.length === 0 && (
               <p className="text-gray-500 text-center py-4">No recommended jobs found. Update your skills!</p>
             )}
           </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Briefcase size={20} className="text-brand-500"/> Recent Applications</h3>
             <Link to="#" className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline">View All <ArrowRight size={14}/></Link>
           </div>
           
           <div className="space-y-4">
             {data.recentApplications.map(app => (
               <div key={app._id} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0">
                 <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                   {app.job.company?.logo ? <img src={app.job.company.logo} alt={app.job.company.name} className="max-w-full max-h-full object-contain" /> : <span className="font-bold text-brand-600">{app.job.company?.name?.charAt(0) || 'C'}</span>}
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className="font-bold text-gray-900 text-sm truncate">{app.job.title}</h4>
                   <p className="text-xs text-gray-500 font-medium truncate">{app.job.company?.name}</p>
                   <p className="text-[10px] text-gray-400 font-medium mt-1">Applied {getTimeAgo(app.createdAt)}</p>
                 </div>
                 <div className="shrink-0 flex items-start">
                   {getStatusBadge(app.status)}
                 </div>
               </div>
             ))}
             {data.recentApplications.length === 0 && (
               <p className="text-gray-500 text-sm text-center py-4">You haven't applied to any jobs yet.</p>
             )}
           </div>
        </div>

      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Latest Jobs Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
          <div className="flex justify-between items-center mb-6 min-w-[600px]">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Clock size={20} className="text-brand-500"/> Latest Jobs</h3>
             <Link to="/jobs" className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline">View All <ArrowRight size={14}/></Link>
          </div>
          
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-semibold w-1/3">Job Title</th>
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Posted</th>
              </tr>
            </thead>
            <tbody>
              {data.latestJobs.map(job => (
                <tr key={job._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3">
                    <Link to={`/jobs/${job._id}`} className="font-bold text-gray-900 text-sm hover:text-brand-600 truncate">{job.title}</Link>
                  </td>
                  <td className="py-3 text-sm text-gray-600 font-medium">{job.company?.name}</td>
                  <td className="py-3 text-sm text-gray-600 font-medium">{job.location?.split(',')[0]}</td>
                  <td className="py-3 text-sm text-gray-600 font-medium capitalize">{job.jobType}</td>
                  <td className="py-3 text-sm text-gray-500 font-medium">{getTimeAgo(job.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Job Search Tips Widget */}
        <div className="bg-[#FEF3E8] rounded-3xl p-6 shadow-sm border border-orange-100 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6 relative z-10">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">💡 Job Search Tips</h3>
             <Link to="#" className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:underline">View All <ArrowRight size={14}/></Link>
          </div>
          
          <ul className="space-y-4 relative z-10 flex-1">
            {[
              "Keep your profile updated",
              "Add relevant skills",
              "Upload a well-formatted resume",
              "Apply to relevant jobs regularly",
              "Track and follow up on your applications"
            ].map((tip, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">{idx + 1}</div>
                <span className="text-sm text-gray-700 font-medium">{tip}</span>
              </li>
            ))}
          </ul>
          
          <div className="absolute right-[-10%] bottom-0 transform -rotate-12 opacity-80 z-0 text-right pr-6 pb-2">
            <p className="font-caveat text-xl text-gray-800 font-bold leading-tight">Small<br/>Steps<br/><span className="text-brand-600 text-2xl">Big<br/>Opportunities</span></p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CandidateDashboard;
