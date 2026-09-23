import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Briefcase, BarChart, IndianRupee, Bookmark, Share2, 
  Users, Building, ChevronRight, Home, ExternalLink, ArrowRight, Clock, 
  Search, CheckCircle2, Sparkles, Heart, Check, Copy, ShieldCheck, 
  HelpCircle, Award, FileText, List, Laptop, Building2, Bell, AlertCircle
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('job-overview');
  
  // Interactive UI states
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertSubscribed, setAlertSubscribed] = useState(false);

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
          setSimilarJobs(similarRes.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const { user } = useAuth();

  const handleApply = async () => {
    if (hasApplied) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      showToast('⚠️ Recruiters cannot apply for jobs. Please log in as a candidate.');
      return;
    }

    setApplying(true);
    try {
      const res = await axios.post(`/api/applications/${id}`);
      if (res.data.success) {
        setHasApplied(true);
        showToast('🎉 Application submitted successfully!');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit application.';
      if (errorMsg.toLowerCase().includes('already applied')) {
        setHasApplied(true);
        showToast('ℹ️ You have already applied for this position.');
      } else {
        showToast(`⚠️ ${errorMsg}`);
      }
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const toggleBookmark = () => {
    setIsSaved(!isSaved);
    showToast(!isSaved ? 'Job saved to your bookmarks!' : 'Removed job from bookmarks');
  };

  const handleSubscribeAlert = (e) => {
    e.preventDefault();
    if (!alertEmail) return;
    setAlertSubscribed(true);
    showToast(`Job alerts set for ${alertEmail}!`);
  };

  // Salary format helper
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not Disclosed';
    if (!min) return `Up to ₹${max/100000} LPA`;
    if (!max) return `₹${min/100000}+ LPA`;
    return `₹${min/100000} - ${max/100000} LPA`;
  };

  // Time ago helper
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-bold text-sm">Fetching position details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 font-medium mb-8 text-sm">{error || "The job post you are looking for is unavailable or expired."}</p>
          <button 
            onClick={() => navigate('/jobs')} 
            className="w-full bg-brand-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md hover:bg-brand-700 transition-all text-sm flex items-center justify-center gap-2"
          >
            Browse Other Positions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f2] min-h-screen pb-20 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-bounce">
          <Sparkles className="text-brand-400" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Decorative Background */}
      <div className="bg-gradient-to-b from-[#FEF3E8] to-[#fcf9f2] h-72 absolute top-0 left-0 w-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute top-[20%] left-[-5%] w-80 h-80 bg-brand-200/40 rounded-full mix-blend-multiply blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-6">
        
        {/* Breadcrumbs Navigation */}
        <div className="flex items-center text-xs text-gray-600 font-bold mb-6 bg-white/70 backdrop-blur-md py-2 px-4 rounded-xl inline-flex border border-white shadow-xs">
          <Link to="/" className="flex items-center hover:text-brand-600 transition-colors">
            <Home size={14} className="mr-1.5 text-brand-500" /> Home
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <Link to="/jobs" className="hover:text-brand-600 transition-colors">Jobs</Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="text-gray-900 truncate max-w-[200px] sm:max-w-xs">{job.title}</span>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Main Column */}
          <div className="lg:w-[68%] xl:w-[70%]">
            
            {/* Top Primary Job Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                
                {/* Company Logo & Job Title */}
                <div className="flex gap-5 items-start">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-2xl shadow-xs flex items-center justify-center p-3 shrink-0">
                    {job.company?.logo ? (
                      <img src={job.company.logo} alt={job.company.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="text-3xl font-black text-brand-600">{job.company?.name?.charAt(0) || 'C'}</span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2 leading-tight">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-2 text-base font-bold text-gray-700 mb-2 flex-wrap">
                      <span>{job.company?.name || 'Top Employer'}</span>
                      <span className="bg-blue-50 text-blue-600 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 border border-blue-100">
                        <CheckCircle2 size={12} /> Verified Hiring
                      </span>
                    </div>
                  </div>
                </div>

                {/* Share & Save Action Buttons */}
                <div className="flex gap-2 shrink-0 self-start sm:self-auto">
                  <button 
                    onClick={toggleBookmark}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-center ${
                      isSaved 
                        ? 'bg-red-50 text-red-500 border-red-200' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                    title={isSaved ? "Remove bookmark" : "Save position"}
                  >
                    <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-2xl font-semibold transition-all flex items-center justify-center"
                    title="Share job"
                  >
                    {isCopied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
                  </button>
                </div>

              </div>

              {/* Meta Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand-600 flex items-center justify-center shrink-0">
                    <MapPin size={18}/>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Location</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Briefcase size={18}/>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Job Type</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 capitalize">{job.jobType?.replace('-', ' ')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <BarChart size={18}/>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Experience</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 capitalize">{job.experienceLevel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    <IndianRupee size={18}/>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Salary</p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900">{formatSalary(job.salary?.min, job.salary?.max)}</p>
                  </div>
                </div>
              </div>

              {/* Skills Tags & Apply Action */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, idx) => (
                    <span key={idx} className="bg-orange-50 text-brand-700 text-xs font-extrabold px-3.5 py-1.5 rounded-full border border-orange-200">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="w-full sm:w-auto flex flex-col items-stretch sm:items-end gap-2">
                  <button 
                    onClick={handleApply}
                    disabled={hasApplied || applying}
                    className={`w-full sm:w-auto font-black text-base py-3.5 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                      hasApplied 
                        ? 'bg-green-600 text-white cursor-default shadow-green-600/20' 
                        : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30 hover:-translate-y-0.5'
                    }`}
                  >
                    {applying ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </span>
                    ) : hasApplied ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={20} /> Applied Successfully
                      </span>
                    ) : (
                      <>Apply Now <ArrowRight size={20} strokeWidth={2.5} /></>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center sm:justify-end gap-4 text-xs font-bold text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={13}/> Posted {getTimeAgo(job.createdAt)}</span>
                    <span className="flex items-center gap-1"><Users size={13}/> {job.vacancies || 1} Openings</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Interactive Content Tabs Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              
              {/* Tab Bar */}
              <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar bg-gray-50/50 p-1.5 gap-1">
                {[
                  { id: 'job-overview', label: 'Job Overview', icon: FileText },
                  { id: 'company-profile', label: 'Company Profile', icon: Building2 },
                  { id: 'perks-benefits', label: 'Perks & Benefits', icon: Award },
                  { id: 'faqs', label: 'FAQs & Process', icon: HelpCircle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-3 font-extrabold text-xs sm:text-sm rounded-2xl whitespace-nowrap transition-all ${
                        isActive 
                          ? 'bg-white text-brand-600 shadow-sm border border-gray-100' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Body */}
              <div className="p-6 sm:p-8">
                
                {/* 1. Job Overview Tab */}
                {activeTab === 'job-overview' && (
                  <div className="space-y-8">
                    
                    {/* Job Description */}
                    <section>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 text-brand-600 flex items-center justify-center shrink-0">
                          <FileText size={18}/>
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Job Description</h3>
                      </div>
                      <div className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap text-sm sm:text-base">
                        {job.description || "No specific job description provided."}
                      </div>
                    </section>

                    {/* Key Responsibilities */}
                    {job.responsibilities && job.responsibilities.length > 0 && (
                      <section className="pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 text-brand-600 flex items-center justify-center shrink-0">
                            <List size={18}/>
                          </div>
                          <h3 className="text-xl font-black text-gray-900">Key Responsibilities</h3>
                        </div>
                        <ul className="space-y-3">
                          {job.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700 font-semibold text-sm">
                              <span className="mt-1 w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                              <span className="leading-relaxed">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                      <section className="pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 text-brand-600 flex items-center justify-center shrink-0">
                            <Laptop size={18}/>
                          </div>
                          <h3 className="text-xl font-black text-gray-900">Requirements & Qualifications</h3>
                        </div>
                        <ul className="space-y-3">
                          {job.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700 font-semibold text-sm">
                              <span className="mt-1 w-2 h-2 rounded-full bg-brand-500 shrink-0"></span>
                              <span className="leading-relaxed">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                  </div>
                )}

                {/* 2. Company Profile Tab */}
                {activeTab === 'company-profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 p-2 flex items-center justify-center shrink-0">
                        {job.company?.logo ? (
                          <img src={job.company.logo} alt={job.company.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-2xl font-black text-brand-600">{job.company?.name?.charAt(0) || 'C'}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900">{job.company?.name}</h3>
                        <p className="text-xs font-bold text-gray-500">{job.company?.location || 'Global Headquarters'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-500 mb-2">About the Organization</h4>
                      <p className="text-gray-700 font-medium leading-relaxed text-sm">
                        {job.company?.description || `${job.company?.name || 'This company'} is a dynamic, innovative company committed to engineering exceptional products and building a supportive work culture for top talent.`}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                      <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                        <p className="text-[11px] font-bold text-gray-400 uppercase">Industry</p>
                        <p className="text-sm font-extrabold text-gray-900">{job.company?.industry || 'Technology & Software'}</p>
                      </div>
                      <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                        <p className="text-[11px] font-bold text-gray-400 uppercase">Team Size</p>
                        <p className="text-sm font-extrabold text-gray-900">{job.company?.companySize || '50-200 Employees'}</p>
                      </div>
                      <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 col-span-2 sm:col-span-1">
                        <p className="text-[11px] font-bold text-gray-400 uppercase">Website</p>
                        <a href={job.company?.website || '#'} target="_blank" rel="noopener noreferrer" className="text-sm font-extrabold text-brand-600 hover:underline flex items-center gap-1">
                          Visit Site <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Perks & Benefits Tab */}
                {activeTab === 'perks-benefits' && (
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-6">Employee Benefits & Perks</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { title: "Health & Wellness", desc: "Comprehensive medical coverage for employee and dependents." },
                        { title: "Flexible Work Options", desc: "Work remotely or from modern coworking spaces." },
                        { title: "Learning Allowance", desc: "Annual budget for courses, conferences, and certifications." },
                        { title: "Competitive Compensation", desc: "Market-leading base pay with performance bonuses." },
                        { title: "Generous PTO", desc: "Flexible paid vacation, sick leave, and parental leave." },
                        { title: "Tech Setup Stipend", desc: "Hardware allowance for high-end laptops and monitors." }
                      ].map((benefit, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-orange-50/40 hover:border-orange-200 transition-all flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-orange-100 text-brand-600 flex items-center justify-center shrink-0 font-bold text-sm">
                            ✓
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{benefit.title}</h4>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. FAQs Tab */}
                {activeTab === 'faqs' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Frequently Asked Questions</h3>
                    {[
                      { q: "What is the interview timeline?", a: "Typically 2 to 3 rounds including an initial recruiter phone screen, technical assessment, and team interview within 1-2 weeks." },
                      { q: "Is this position open for remote candidates?", a: `Yes, this role is categorized as ${job.jobType || 'Remote / Hybrid'} and supports flexible working locations.` },
                      { q: "How long until I receive application updates?", a: "Our hiring team reviews applications daily. You will be notified via email within 3 business days." }
                    ].map((faq, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/80">
                        <h4 className="font-extrabold text-gray-900 text-sm mb-2 flex items-center gap-2">
                          <HelpCircle size={16} className="text-brand-500" /> {faq.q}
                        </h4>
                        <p className="text-xs text-gray-600 font-medium leading-relaxed pl-6">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Column - Sidebars */}
          <div className="lg:w-[32%] xl:w-[30%] space-y-6">
            
            {/* About Company Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-black text-gray-900 mb-4">About the Company</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl p-2 flex items-center justify-center shrink-0 shadow-xs">
                  {job.company?.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="text-xl font-black text-brand-600">{job.company?.name?.charAt(0) || 'C'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base truncate">{job.company?.name || 'Company Name'}</h4>
                  <p className="text-xs text-gray-500 truncate font-medium">{job.company?.location || 'Worldwide'}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100 text-xs font-semibold text-gray-700 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Industry:</span>
                  <span className="font-bold text-gray-900">{job.company?.industry || 'Technology'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Employees:</span>
                  <span className="font-bold text-gray-900">{job.company?.companySize || '50-200'}</span>
                </div>
              </div>

              {job.company?.website && (
                <a 
                  href={job.company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-brand-600 bg-orange-50 hover:bg-orange-100 rounded-xl font-bold transition-colors text-xs"
                >
                  Visit Company Website <ExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Similar Jobs Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-black text-gray-900">Similar Positions</h3>
                <Link to="/jobs" className="text-brand-600 text-xs font-bold hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {similarJobs.length > 0 ? (
                  similarJobs.map(sJob => (
                    <Link 
                      key={sJob._id} 
                      to={`/jobs/${sJob._id}`} 
                      className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group block"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 p-1 shadow-xs shrink-0 flex items-center justify-center">
                        {sJob.company?.logo ? (
                          <img src={sJob.company.logo} alt={sJob.company.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-sm font-black text-brand-600">{sJob.company?.name?.charAt(0) || 'C'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-gray-900 text-xs truncate group-hover:text-brand-600 transition-colors">
                          {sJob.title}
                        </h5>
                        <p className="text-[11px] text-gray-400 font-semibold truncate">{sJob.company?.name} • {sJob.location}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-600 transition-colors" />
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-gray-400 font-bold bg-gray-50 rounded-2xl">
                    No similar jobs available right now.
                  </div>
                )}
              </div>
            </div>

            {/* Job Alerts Newsletter Box */}
            <div className="bg-gradient-to-br from-brand-600 to-orange-600 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                  <Bell size={20} className="text-white" />
                </div>
                <h4 className="font-extrabold text-base mb-1">Never Miss a Job</h4>
                <p className="text-xs text-orange-100 font-medium mb-4 leading-relaxed">
                  Get daily email notifications whenever similar engineering roles open up.
                </p>

                {alertSubscribed ? (
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl text-xs font-bold text-center">
                    ✓ Alerts Activated!
                  </div>
                ) : (
                  <form onSubmit={handleSubscribeAlert} className="space-y-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email..." 
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 text-xs font-bold outline-none"
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-all"
                    >
                      Subscribe Alerts
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default JobDetails;
