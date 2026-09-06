import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Phone, Mail, Link, Camera, CheckCircle2, Circle, 
  FileText, Download, Upload, Trash2, Edit2, Plus
} from 'lucide-react';

const CandidateProfile = () => {
  const { user } = useAuth();
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
    tagline: ''
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
        tagline: user.tagline || ''
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
        // Ideally we should update auth context here, but reloading or waiting for next fetch works for now
        setTimeout(() => setSuccess(''), 3000);
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

  const tabs = ['Personal Info', 'Professional Info', 'Skills', 'Education', 'Experience', 'Resume'];

  return (
    <div className="space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-[#FEF3E8] rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center border border-orange-100">
         <div className="flex gap-6 relative z-10 w-full md:w-auto items-center">
            {/* Avatar */}
            <div className="relative shrink-0">
               <div className="w-28 h-28 rounded-full border-4 border-white shadow-sm overflow-hidden bg-white">
                  {user?.profilePhoto ? (
                     <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full bg-brand-100 text-brand-600 flex items-center justify-center text-4xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                     </div>
                  )}
               </div>
               <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-brand-600 shadow-sm transition-colors">
                  <Camera size={16} />
               </button>
            </div>
            
            {/* Info */}
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                 <h1 className="text-2xl font-black text-gray-900">{user?.name}</h1>
                 <button className="text-brand-500 hover:text-brand-600"><Edit2 size={16}/></button>
               </div>
               <p className="text-brand-600 font-bold mb-2">{user?.tagline || 'Add a tagline...'}</p>
               <p className="text-sm text-gray-600 mb-3 max-w-xl">
                 {user?.bio || 'Passionate about building scalable web applications and solving real world problems. Open to full-time opportunities and internships.'}
               </p>
               
               <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {user?.location || 'Add Location'}</span>
                  <span className="flex items-center gap-1"><Phone size={14}/> {user?.phone || 'Add Phone'}</span>
                  <span className="flex items-center gap-1"><Mail size={14}/> {user?.email}</span>
                  <span className="flex items-center gap-1"><Link size={14}/> {user?.linkedin || 'linkedin.com/in/...'}</span>
               </div>
            </div>
         </div>
         
         <div className="mt-4 md:mt-0 relative z-10 shrink-0 self-start md:self-auto">
            <button className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm">
               <Edit2 size={16}/> Edit Profile
            </button>
         </div>

         {/* Abstract background graphics */}
         <div className="hidden md:block absolute right-[20%] top-[20%] transform -rotate-12 z-0">
             <p className="font-caveat text-xl text-gray-800 font-bold leading-tight">Small<br/>Steps<br/><span className="text-brand-600 text-2xl">Big<br/>Opportunities</span></p>
         </div>
         <div className="absolute right-[-5%] top-[-20%] w-48 h-48 bg-orange-200/40 rounded-full blur-3xl"></div>
         <div className="absolute left-[-5%] bottom-[-20%] w-48 h-48 bg-white/40 rounded-full blur-3xl"></div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'Personal Info' && (
             <>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><UserIcon size={20} className="text-brand-500"/> Personal Information</h3>
                      <button onClick={handleSubmit} className="text-brand-600 border border-brand-200 bg-orange-50 hover:bg-orange-100 font-bold text-sm px-4 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                        {loading ? 'Saving...' : <><Edit2 size={14}/> Save</>}
                      </button>
                   </div>
                   
                   {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-semibold">{success}</div>}

                   <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm bg-gray-50 text-gray-500" readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-700 appearance-none bg-white">
                           <option value="Male">Male</option>
                           <option value="Female">Female</option>
                           <option value="Other">Other</option>
                           <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FileText size={16} className="text-brand-500"/> About Me</label>
                         <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm text-gray-700" placeholder="Write a short summary about yourself..."></textarea>
                         <div className="text-right text-xs text-gray-400 mt-1">{formData.bio.length}/500</div>
                      </div>
                   </form>
                </div>
             </>
          )}
          
          {activeTab !== 'Personal Info' && (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center py-20">
                <p className="text-gray-500 font-medium">This section ({activeTab}) will be implemented soon!</p>
             </div>
          )}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
           
           {/* Profile Completion */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 mb-6">
               <UserIcon size={20} className="text-brand-500"/>
               <h3 className="font-bold text-gray-900">Profile Completion</h3>
             </div>
             
             <div className="flex items-center gap-6 mb-6">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-brand-500 transition-all duration-1000 ease-out" strokeWidth="4" strokeDasharray={`${profileScore}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-lg font-black text-gray-900">{profileScore}%</span>
                  </div>
                </div>
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600"><CheckCircle2 size={14} className="text-green-500 shrink-0"/> Basic Info</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{user?.education?.length ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Education</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{user?.skills?.length ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Skills</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{user?.experience?.length ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Experience</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{user?.resume ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Resume</div>
                </div>
             </div>
           </div>

           {/* Resume Widget */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-brand-500"/>
                  <h3 className="font-bold text-gray-900">Resume</h3>
                </div>
                <button className="text-brand-600 border border-brand-200 hover:bg-orange-50 font-bold text-xs px-3 py-1 rounded-md transition-colors">View</button>
             </div>
             
             <div className="border border-gray-100 rounded-xl p-4 flex gap-4 items-start mb-4 bg-gray-50/50 hover:border-brand-200 transition-colors">
                <div className="bg-red-50 text-red-600 p-2.5 rounded-lg shrink-0">
                  <FileText size={24}/>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{user?.name ? `${user.name.replace(' ', '_')}_Resume.pdf` : 'My_Resume.pdf'}</p>
                  <p className="text-[10px] font-medium text-gray-500 mt-1">Uploaded on 12 Aug 2025 • 428 KB</p>
                </div>
             </div>
             
             <div className="flex gap-2">
                <button className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 shadow-sm">
                   <Download size={14}/> Download
                </button>
                <button className="flex-1 bg-white hover:bg-gray-50 text-brand-600 border border-brand-200 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                   <Upload size={14}/> Replace
                </button>
                <button className="w-9 shrink-0 bg-white hover:bg-red-50 text-red-500 border border-red-100 font-bold py-2 rounded-lg transition-colors flex items-center justify-center">
                   <Trash2 size={14}/>
                </button>
             </div>
           </div>

           {/* Skills Widget */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-brand-500 rounded flex items-center justify-center text-white"><CheckCircle2 size={12}/></div>
                  <h3 className="font-bold text-gray-900">My Skills</h3>
                </div>
                <button className="text-brand-600 border border-brand-200 hover:bg-orange-50 font-bold text-xs px-3 py-1 rounded-md transition-colors flex items-center gap-1"><Edit2 size={12}/> Edit</button>
             </div>
             
             <div className="flex flex-wrap gap-2">
                {user?.skills?.length ? (
                  user.skills.map((skill, idx) => (
                    <span key={idx} className="bg-orange-50 text-brand-600 border border-orange-100 font-semibold text-xs px-3 py-1.5 rounded-lg">{skill}</span>
                  ))
                ) : (
                  <>
                    <span className="bg-orange-50 text-brand-600 border border-orange-100 font-semibold text-xs px-3 py-1.5 rounded-lg">JavaScript</span>
                    <span className="bg-orange-50 text-brand-600 border border-orange-100 font-semibold text-xs px-3 py-1.5 rounded-lg">React.js</span>
                    <span className="bg-orange-50 text-brand-600 border border-orange-100 font-semibold text-xs px-3 py-1.5 rounded-lg">Node.js</span>
                    <span className="bg-orange-50 text-brand-600 border border-orange-100 font-semibold text-xs px-3 py-1.5 rounded-lg">Express.js</span>
                    <span className="bg-orange-50 text-brand-600 border border-orange-100 font-semibold text-xs px-3 py-1.5 rounded-lg">MongoDB</span>
                    <span className="bg-orange-50 text-brand-600 border border-orange-100 font-semibold text-xs px-3 py-1.5 rounded-lg">Tailwind CSS</span>
                  </>
                )}
                <button className="bg-white border border-dashed border-brand-300 text-brand-600 hover:bg-brand-50 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Plus size={12}/> Add Skill
                </button>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
};

// Quick fix for missing UserIcon import since it was defined differently in App.jsx
function UserIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

export default CandidateProfile;
