import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Phone, Mail, Link as LinkIcon, Camera, CheckCircle2, Circle, 
  FileText, Download, Upload, Trash2, Edit2, Plus, Briefcase, GraduationCap, Settings,
  User, Share2, Sparkles, ExternalLink, Globe, Award, ShieldCheck, Copy, Check,
  ArrowRight, Calendar, Building2
} from 'lucide-react';

const LinkedInIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
);

const CandidateProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [copiedText, setCopiedText] = useState('');

  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let completed = 0;
    const totalFields = 5;
    if (user.name && user.email) completed++; 
    if (user.education?.length > 0) completed++;
    if (user.skills?.length > 0) completed++;
    if (user.experience?.length > 0) completed++;
    if (user.resume) completed++;
    return Math.round((completed / totalFields) * 100);
  };

  const profileScore = calculateProfileCompletion();

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user?.name || 'Candidate'}'s Profile`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopy(window.location.href, 'profileUrl');
    }
  };

  const tabs = [
    { id: 'Personal Info', label: 'Personal Info', icon: User, count: null },
    { id: 'Professional Info', label: 'Professional Info', icon: Briefcase, count: null },
    { id: 'Skills', label: 'Skills', icon: Settings, count: user?.skills?.length || 0 },
    { id: 'Education', label: 'Education', icon: GraduationCap, count: user?.education?.length || 0 },
    { id: 'Experience', label: 'Experience', icon: Award, count: user?.experience?.length || 0 },
    { id: 'Resume', label: 'Resume', icon: FileText, count: user?.resume ? 1 : 0 },
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Banner Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-brand-950 p-6 md:p-8 text-white shadow-2xl overflow-hidden border border-gray-800">
        
        {/* Background Decorative Ambient Shapes */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Avatar & Main Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Avatar with Glow Ring & Status Badge */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl p-1 bg-gradient-to-tr from-brand-500 via-amber-400 to-orange-500 shadow-xl">
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-gray-900 flex items-center justify-center border-2 border-gray-900">
                  {user?.profilePhoto ? (
                    <img 
                      src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:8000${user.profilePhoto}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <span className="text-4xl font-extrabold bg-gradient-to-r from-brand-400 to-orange-300 bg-clip-text text-transparent">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Online / Active Badge */}
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-gray-900 shadow-lg flex items-center justify-center" title="Open to Work">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
              </div>
            </div>

            {/* Candidate Details */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {user?.name || 'Candidate Name'}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Verified Candidate
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 backdrop-blur-md">
                  <Sparkles size={13} className="text-brand-300" />
                  Open to Work
                </span>
              </div>

              <p className="text-brand-300 font-medium text-base">
                {user?.tagline || 'Add a professional tagline in Edit Profile'}
              </p>

              <p className="text-gray-300 text-sm max-w-2xl leading-relaxed line-clamp-2">
                {user?.bio || 'No bio added yet. Tell recruiters about yourself by updating your profile!'}
              </p>

              {/* Quick Contact Chips */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-gray-300">
                {user?.location && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <MapPin size={14} className="text-brand-400" />
                    {user.location}
                  </span>
                )}
                
                {user?.phone && (
                  <button 
                    onClick={() => handleCopy(user.phone, 'phone')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
                  >
                    <Phone size={14} className="text-brand-400" />
                    {user.phone}
                    {copiedText === 'phone' ? <Check size={12} className="text-emerald-400 ml-1"/> : <Copy size={12} className="text-gray-400 opacity-60 hover:opacity-100 ml-1"/>}
                  </button>
                )}

                <button 
                  onClick={() => handleCopy(user?.email, 'email')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
                >
                  <Mail size={14} className="text-brand-400" />
                  {user?.email}
                  {copiedText === 'email' ? <Check size={12} className="text-emerald-400 ml-1"/> : <Copy size={12} className="text-gray-400 opacity-60 hover:opacity-100 ml-1"/>}
                </button>

                {user?.linkedin && (
                  <a 
                    href={user.linkedin} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-colors backdrop-blur-md"
                  >
                    <LinkedInIcon size={13} />
                    LinkedIn
                    <ExternalLink size={12} className="opacity-70" />
                  </a>
                )}

                {user?.github && (
                  <a 
                    href={user.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700 transition-colors backdrop-blur-md"
                  >
                    <GithubIcon size={13} />
                    GitHub
                    <ExternalLink size={12} className="opacity-70" />
                  </a>
                )}
              </div>

            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0 self-stretch lg:self-auto justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
            <Link 
              to="/candidate/profile/edit" 
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 transition-all duration-300 transform active:scale-95"
            >
              <Edit2 size={16} />
              Edit Profile
            </Link>

            <button 
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all duration-200 backdrop-blur-md"
            >
              <Share2 size={16} />
              {copiedText === 'profileUrl' ? 'Link Copied!' : 'Share Profile'}
            </button>
          </div>

        </div>

      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 border border-brand-100">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile Score</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">{profileScore}%</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Settings size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills Added</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">{user?.skills?.length || 0}</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">{user?.experience?.length || 0} Roles</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resume Status</p>
            <p className="text-sm font-extrabold text-emerald-600 mt-1">
              {user?.resume ? 'Uploaded & Ready' : 'Pending Upload'}
            </p>
          </div>
        </div>

      </div>

      {/* Tabs Switcher Navigation */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex overflow-x-auto scrollbar-none gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-white' : 'text-gray-500'} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details Panel (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info Tab */}
          {activeTab === 'Personal Info' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Personal Details</h3>
                    <p className="text-xs text-gray-500 font-medium">Your identity & contact information</p>
                  </div>
                </div>
                <Link to="/candidate/profile/edit" className="text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <Edit2 size={13} /> Edit
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</span>
                  <p className="text-base text-gray-900 font-bold">{user?.name || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</span>
                  <p className="text-base text-gray-900 font-bold">{user?.email || 'N/A'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone Number</span>
                  <p className="text-base text-gray-900 font-bold">{user?.phone || 'Not provided'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Current Location</span>
                  <p className="text-base text-gray-900 font-bold">{user?.location || 'Not provided'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Date of Birth</span>
                  <p className="text-base text-gray-900 font-bold">
                    {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Gender</span>
                  <p className="text-base text-gray-900 font-bold">{user?.gender || 'Not specified'}</p>
                </div>

              </div>

              {/* Bio card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-50/50 to-amber-50/30 border border-orange-100/70">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-2">About Me</span>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {user?.bio || 'No bio written yet. Click "Edit Profile" to write a summary about yourself.'}
                </p>
              </div>

            </div>
          )}

          {/* Professional Info Tab */}
          {activeTab === 'Professional Info' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Professional Profile</h3>
                    <p className="text-xs text-gray-500 font-medium">Preferences, links & career focus</p>
                  </div>
                </div>
                <Link to="/candidate/profile/edit" className="text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <Edit2 size={13} /> Edit
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Professional Tagline</span>
                  <p className="text-base text-gray-900 font-bold">{user?.tagline || 'Not provided'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Preferred Job Type</span>
                  <span className="inline-block mt-1 px-3 py-1 bg-brand-100 text-brand-700 font-extrabold text-xs rounded-lg">
                    {user?.preferredJobType || 'Full Time'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Expected Salary</span>
                  <p className="text-base text-gray-900 font-bold">{user?.expectedSalary || 'Not Disclosed'}</p>
                </div>

              </div>

              {/* Online Links Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">Online Portfolios & Socials</h4>
                
                <div className="space-y-3">
                  
                  {/* LinkedIn */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <LinkedInIcon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-500">LinkedIn Profile</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.linkedin || 'Not linked'}
                        </p>
                      </div>
                    </div>
                    {user?.linkedin ? (
                      <a href={user.linkedin} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1">
                        Visit <ExternalLink size={12}/>
                      </a>
                    ) : (
                      <Link to="/candidate/profile/edit" className="text-xs text-brand-600 font-bold hover:underline">Add Link</Link>
                    )}
                  </div>

                  {/* GitHub */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0">
                        <GithubIcon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-500">GitHub Profile</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.github || 'Not linked'}
                        </p>
                      </div>
                    </div>
                    {user?.github ? (
                      <a href={user.github} target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1">
                        Visit <ExternalLink size={12}/>
                      </a>
                    ) : (
                      <Link to="/candidate/profile/edit" className="text-xs text-brand-600 font-bold hover:underline">Add Link</Link>
                    )}
                  </div>

                  {/* Portfolio */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Globe size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-500">Portfolio Website</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.portfolio || 'Not linked'}
                        </p>
                      </div>
                    </div>
                    {user?.portfolio ? (
                      <a href={user.portfolio} target="_blank" rel="noreferrer" className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1">
                        Visit <ExternalLink size={12}/>
                      </a>
                    ) : (
                      <Link to="/candidate/profile/edit" className="text-xs text-brand-600 font-bold hover:underline">Add Link</Link>
                    )}
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'Skills' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Skills & Tech Stack</h3>
                    <p className="text-xs text-gray-500 font-medium">Highlight your core technical capabilities</p>
                  </div>
                </div>
                <Link to="/candidate/profile/edit" className="text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <Plus size={14} /> Add Skill
                </Link>
              </div>

              {user?.skills?.length ? (
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {user.skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50/60 text-gray-900 border border-orange-200/60 font-bold text-sm shadow-sm hover:border-brand-400 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-500 group-hover:scale-125 transition-transform"></span>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Settings size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-bold text-sm">No skills added yet</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Showcase your technical domain expertise to employers.</p>
                  <Link to="/candidate/profile/edit" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors inline-flex items-center gap-1.5">
                    <Plus size={14} /> Add Skills Now
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'Education' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Academic Background</h3>
                    <p className="text-xs text-gray-500 font-medium">Degrees, universities & qualifications</p>
                  </div>
                </div>
                <Link to="/candidate/profile/edit" className="text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <Plus size={14} /> Add Education
                </Link>
              </div>

              {user?.education?.length ? (
                <div className="space-y-4">
                  {user.education.map((edu, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-5 items-start">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20">
                        <GraduationCap size={26} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <h4 className="text-lg font-black text-gray-900">{edu.institution}</h4>
                          <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-extrabold text-xs border border-brand-100">
                            {edu.startYear} — {edu.endYear || 'Present'}
                          </span>
                        </div>
                        <p className="text-base text-gray-800 font-bold">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <GraduationCap size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-bold text-sm">No education details added yet</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Add your degree and university details.</p>
                  <Link to="/candidate/profile/edit" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors inline-flex items-center gap-1.5">
                    <Plus size={14} /> Add Education
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'Experience' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Work Experience</h3>
                    <p className="text-xs text-gray-500 font-medium">Career history & accomplishments</p>
                  </div>
                </div>
                <Link to="/candidate/profile/edit" className="text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <Plus size={14} /> Add Experience
                </Link>
              </div>

              {user?.experience?.length ? (
                <div className="relative border-l-2 border-brand-200 ml-4 pl-6 space-y-8 my-2">
                  {user.experience.map((exp, idx) => (
                    <div key={idx} className="relative group">
                      
                      {/* Timeline Glow Node */}
                      <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-brand-600 group-hover:scale-125 transition-transform shadow-md"></div>
                      
                      <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-lg transition-all duration-300 space-y-3">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <h4 className="text-lg font-black text-gray-900">{exp.position}</h4>
                            <p className="text-sm font-bold text-brand-600 flex items-center gap-1.5 mt-0.5">
                              <Building2 size={15} />
                              {exp.company}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gray-200/60 text-gray-700">
                            <Calendar size={13} />
                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'} 
                            {' — '}
                            {exp.currentlyWorking ? (
                              <span className="text-emerald-600 font-black">Present</span>
                            ) : (
                              exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'
                            )}
                          </span>
                        </div>

                        {exp.description && (
                          <p className="text-sm text-gray-700 leading-relaxed font-medium pt-2 border-t border-gray-100">
                            {exp.description}
                          </p>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Award size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-bold text-sm">No work experience added yet</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Add your previous job roles and responsibilities.</p>
                  <Link to="/candidate/profile/edit" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors inline-flex items-center gap-1.5">
                    <Plus size={14} /> Add Experience
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Resume Tab */}
          {activeTab === 'Resume' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Attached Resume</h3>
                    <p className="text-xs text-gray-500 font-medium">Your primary application document</p>
                  </div>
                </div>
                <Link to="/candidate/profile/edit" className="text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                  <Upload size={13} /> Update File
                </Link>
              </div>

              {user?.resume ? (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50/70 via-amber-50/40 to-white border border-orange-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                      <FileText size={32} />
                    </div>
                    <div className="min-w-0">
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 mb-1">
                        PDF Document
                      </span>
                      <h4 className="text-base font-extrabold text-gray-900 truncate max-w-xs md:max-w-md">
                        {user.resume.split('/').pop()}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Active resume for 1-click job applications
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    <a 
                      href={user.resume.startsWith('http') ? user.resume : `http://localhost:8000${user.resume}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      download 
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all flex items-center gap-2"
                    >
                      <Download size={15} /> Download PDF
                    </a>
                    
                    <Link 
                      to="/candidate/profile/edit" 
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Upload size={14} /> Replace
                    </Link>
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-3">
                  <FileText size={48} className="text-gray-300 mx-auto" />
                  <h4 className="text-base font-bold text-gray-800">No Resume File Uploaded</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Uploading a resume increases candidate profile visibility by up to 300%.
                  </p>
                  <Link to="/candidate/profile/edit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs hover:bg-brand-700 shadow-md shadow-brand-600/20 transition-all">
                    <Upload size={15} /> Upload Resume PDF
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          
          {/* Widget 1: Profile Score Gauge */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <Sparkles size={18} className="text-brand-500" />
                Profile Completion
              </h3>
              <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                {profileScore}%
              </span>
            </div>

            <div className="flex items-center gap-5">
              
              {/* Circular Gauge */}
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-brand-500 transition-all duration-1000 ease-out" strokeWidth="4" strokeDasharray={`${profileScore}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-black text-gray-900">{profileScore}%</span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span>Basic Details</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  {user?.education?.length ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <Circle size={14} className="text-gray-300 shrink-0" />}
                  <span>Education</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  {user?.skills?.length ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <Circle size={14} className="text-gray-300 shrink-0" />}
                  <span>Skills Stack</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  {user?.experience?.length ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <Circle size={14} className="text-gray-300 shrink-0" />}
                  <span>Experience</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  {user?.resume ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <Circle size={14} className="text-gray-300 shrink-0" />}
                  <span>Resume Attached</span>
                </div>
              </div>

            </div>

            {profileScore < 100 && (
              <Link 
                to="/candidate/profile/edit" 
                className="block text-center w-full bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 text-brand-700 font-extrabold py-2.5 rounded-xl text-xs border border-orange-200/80 transition-all shadow-sm"
              >
                Complete Remaining Details &rarr;
              </Link>
            )}
          </div>

          {/* Widget 2: Resume Quick Actions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <FileText size={18} className="text-brand-500" />
                Resume Quick Action
              </h3>
            </div>

            {user?.resume ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-100 text-red-600 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {user.resume.split('/').pop()}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-extrabold">Ready to Send</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href={user.resume.startsWith('http') ? user.resume : `http://localhost:8000${user.resume}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    download 
                    className="py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download size={14} /> Download
                  </a>
                  
                  <Link 
                    to="/candidate/profile/edit" 
                    className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Upload size={14} /> Replace
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500 mb-3 font-medium">No resume attached to profile</p>
                <Link to="/candidate/profile/edit" className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors">
                  <Upload size={14} /> Upload PDF
                </Link>
              </div>
            )}
          </div>

          {/* Widget 3: Quick Skills Cloud */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <Settings size={18} className="text-brand-500" />
                Featured Skills
              </h3>
              <Link to="/candidate/profile/edit" className="text-xs text-brand-600 font-bold hover:underline">
                Edit
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {user?.skills?.length ? (
                user.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 bg-orange-50/80 text-brand-700 font-bold text-xs rounded-xl border border-orange-100"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-400 py-2">Add skills to showcase your proficiency.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CandidateProfile;
