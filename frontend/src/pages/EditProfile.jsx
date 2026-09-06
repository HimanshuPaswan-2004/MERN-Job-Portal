import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User, Briefcase, GraduationCap, Link as LinkIcon, Settings,
  Camera, CheckCircle2, Circle, Lightbulb, Eye, BarChart2
} from 'lucide-react';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    gender: 'Male',
    bio: '',
    linkedin: '',
    github: '',
    portfolio: '',
    tagline: '',
    preferredJobType: 'Full Time',
    expectedSalary: 'Not Disclosed'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || 'Male',
        bio: user.bio || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        portfolio: user.portfolio || '',
        tagline: user.tagline || '',
        preferredJobType: user.preferredJobType || 'Full Time',
        expectedSalary: user.expectedSalary || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const res = await axios.put('/api/auth/me', formData);
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          setSuccess('');
          navigate('/candidate/profile');
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let completed = 0;
    const totalFields = 5;
    if (user.name && user.email) completed++; 
    if (user.education?.length > 0) completed++;
    if (user.skills?.length > 0) completed++;
    if (user.experience?.length > 0) completed++;
    if (user.resume) completed++;
    return (completed / totalFields) * 100;
  };

  const profileScore = calculateProfileCompletion();

  const tabs = [
    { id: 'Personal Info', icon: <User size={16} /> },
    { id: 'Professional Info', icon: <Briefcase size={16} /> },
    { id: 'Skills', icon: <Settings size={16} /> },
    { id: 'Education', icon: <GraduationCap size={16} /> },
    { id: 'Experience', icon: <Briefcase size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div>
        <div className="flex items-center text-sm text-gray-500 mb-2 font-medium">
          <Link to="/candidate/profile" className="hover:text-brand-600 transition-colors flex items-center gap-1"><User size={14}/> My Profile</Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-gray-900">Edit Profile</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
             <h1 className="text-3xl font-black text-gray-900">Edit Your Profile</h1>
             <p className="text-gray-500 text-sm font-medium mt-1">Keep your information up to date to get better job opportunities.</p>
           </div>
           
           <div className="flex gap-3">
             <Link to="/candidate/profile" className="px-6 py-2.5 rounded-lg border border-brand-200 text-brand-600 font-bold hover:bg-orange-50 transition-colors bg-white shadow-sm">
               Cancel
             </Link>
             <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-70">
               {loading ? 'Saving...' : 'Save Changes'}
             </button>
           </div>
        </div>
      </div>

      {success && <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl font-semibold shadow-sm">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-x-auto">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-4 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-2 whitespace-nowrap
                  ${activeTab === tab.id ? 'border-brand-500 text-brand-600 bg-orange-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                {tab.icon} {tab.id}
              </button>
            ))}
          </div>

          {activeTab === 'Personal Info' && (
             <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Information */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><User size={20} className="text-brand-500"/> Personal Information</h3>
                   
                   <div className="flex flex-col md:flex-row gap-8">
                      {/* Photo Upload */}
                      <div className="shrink-0 flex flex-col items-center">
                        <label className="text-sm font-semibold text-gray-700 mb-3 self-start md:self-center">Profile Photo</label>
                        <div className="relative mb-3">
                           <div className="w-28 h-28 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50">
                              {user?.profilePhoto ? (
                                 <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                 <div className="w-full h-full text-gray-300 flex items-center justify-center text-4xl font-bold bg-gray-100">
                                    {formData.name.charAt(0) || 'U'}
                                 </div>
                              )}
                           </div>
                           <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-brand-600 shadow-sm transition-colors">
                              <Camera size={16} />
                           </button>
                        </div>
                        <button type="button" className="text-brand-600 border border-brand-200 hover:bg-orange-50 font-bold text-xs px-4 py-2 rounded-lg transition-colors w-full">Change Photo</button>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">JPG, PNG (Max 2MB)</p>
                      </div>

                      {/* Inputs Grid */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed text-sm font-medium" readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400"><MapPin size={16}/></span>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender <span className="text-red-500">*</span></label>
                          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium appearance-none bg-white">
                             <option value="Male">Male</option>
                             <option value="Female">Female</option>
                             <option value="Other">Other</option>
                             <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                   </div>
                </div>

                {/* About Me */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><FileText size={20} className="text-brand-500"/> About Me</h3>
                   <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium leading-relaxed" placeholder="Write a short summary about yourself..."></textarea>
                   <div className="text-right text-xs text-gray-400 mt-2 font-medium">{formData.bio.length}/500</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Social Links */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                     <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><LinkIcon size={20} className="text-brand-500"/> Social Links</h3>
                     
                     <div className="space-y-4">
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1.5">LinkedIn Profile</label>
                         <div className="relative">
                            <span className="absolute left-3 top-3.5 text-gray-400 font-bold font-serif text-xs">in</span>
                            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium" />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1.5">GitHub Profile</label>
                         <div className="relative flex items-center">
                            <span className="absolute left-3 text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></span>
                            <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium" />
                         </div>
                       </div>
                     </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                     <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Settings size={20} className="text-brand-500"/> Additional Information</h3>
                     
                     <div className="space-y-4">
                       <div>
                         <label className="block text-xs font-semibold text-gray-500 mb-1.5">Website / Portfolio</label>
                         <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400"><LinkIcon size={16}/></span>
                            <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium" />
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Preferred Job Type</label>
                            <select name="preferredJobType" value={formData.preferredJobType} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium appearance-none bg-white">
                               <option value="Full Time">Full Time</option>
                               <option value="Part Time">Part Time</option>
                               <option value="Contract">Contract</option>
                               <option value="Internship">Internship</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Expected Salary (LPA)</label>
                            <select name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-800 font-medium appearance-none bg-white">
                               <option value="Not Disclosed">Not Disclosed</option>
                               <option value="5 - 10">5 - 10</option>
                               <option value="10 - 15">10 - 15</option>
                               <option value="15 - 20">15 - 20</option>
                               <option value="20 - 30">20 - 30</option>
                               <option value="30+">30+</option>
                            </select>
                          </div>
                       </div>
                     </div>
                  </div>
                </div>
             </form>
          )}
          
          {activeTab !== 'Personal Info' && (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center py-24">
                <p className="text-gray-500 font-medium text-lg">Editing for <span className="text-brand-600 font-bold">{activeTab}</span> is coming soon!</p>
             </div>
          )}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6 lg:sticky lg:top-24">
           
           {/* Profile Completion */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-gray-900">Profile Completion</h3>
               <span className="text-xl font-black text-brand-600">{profileScore}%</span>
             </div>
             <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
               <div className="bg-brand-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${profileScore}%` }}></div>
             </div>
             
             <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600"><CheckCircle2 size={14} className="text-green-500 shrink-0"/> Basic Information</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{user?.education?.length ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Education Details</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{user?.skills?.length ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Add Skills</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{user?.experience?.length ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Add Experience</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{user?.resume ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Upload Resume</div>
             </div>
           </div>

           {/* Tip Widget */}
           <div className="bg-[#FEF8F0] rounded-3xl p-6 shadow-sm border border-orange-100">
             <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={20} className="text-yellow-500 fill-current"/>
                <h3 className="font-bold text-gray-900 text-sm">Tip</h3>
             </div>
             <p className="text-xs text-gray-700 font-medium leading-relaxed">
               A complete profile is 3x more likely to get noticed by recruiters.
             </p>
           </div>

           {/* Preview Profile Widget */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 mb-2">
                <Eye size={20} className="text-gray-900"/>
                <h3 className="font-bold text-gray-900 text-sm">Preview Profile</h3>
             </div>
             <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
               See how your profile looks to recruiters.
             </p>
             <Link to="/candidate/profile" className="w-full flex items-center justify-center gap-2 border border-brand-200 text-brand-600 hover:bg-orange-50 transition-colors font-bold text-xs py-2.5 rounded-xl">
               View Profile &rarr;
             </Link>
           </div>
           
           {/* Career Growth Starts Here */}
           <div className="bg-[#FEF3E8] rounded-3xl p-6 shadow-sm border border-orange-100 relative overflow-hidden">
             <div className="relative z-10">
               <BarChart2 size={24} className="text-brand-500 mb-3"/>
               <h3 className="font-bold text-gray-900 text-sm mb-1">Career Growth Starts Here</h3>
               <p className="text-xs text-gray-600 font-medium leading-relaxed">
                 Keep your profile updated and showcase your best self to top companies.
               </p>
             </div>
             <div className="absolute right-[-20%] bottom-[-20%] w-32 h-32 bg-orange-200/60 rounded-full blur-2xl"></div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default EditProfile;
