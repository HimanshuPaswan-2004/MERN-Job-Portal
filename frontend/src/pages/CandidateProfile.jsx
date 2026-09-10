import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Phone, Mail, Link as LinkIcon, Camera, CheckCircle2, Circle, 
  FileText, Download, Upload, Trash2, Edit2, Plus, Briefcase, GraduationCap, Settings
} from 'lucide-react';

const CandidateProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Personal Info');

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
                     <img src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:8000${user.profilePhoto}`} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full bg-brand-100 text-brand-600 flex items-center justify-center text-4xl font-bold">
                        {user?.name?.charAt(0) || 'U'}
                     </div>
                  )}
               </div>
            </div>
            
            {/* Info */}
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                 <h1 className="text-2xl font-black text-gray-900">{user?.name}</h1>
               </div>
               <p className="text-brand-600 font-bold mb-2">{user?.tagline || 'Add a professional tagline in Edit Profile'}</p>
               <p className="text-sm text-gray-600 mb-3 max-w-xl">
                 {user?.bio || 'No bio added yet. Tell recruiters about yourself!'}
               </p>
               
               <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600">
                  {user?.location && <span className="flex items-center gap-1"><MapPin size={14}/> {user.location}</span>}
                  {user?.phone && <span className="flex items-center gap-1"><Phone size={14}/> {user.phone}</span>}
                  <span className="flex items-center gap-1"><Mail size={14}/> {user?.email}</span>
                  {user?.linkedin && (
                     <a href={user.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-600">
                        <LinkIcon size={14}/> LinkedIn
                     </a>
                  )}
               </div>
            </div>
         </div>
         
         <div className="mt-4 md:mt-0 relative z-10 shrink-0 self-start md:self-auto">
            <Link to="/candidate/profile/edit" className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm inline-flex">
               <Edit2 size={16}/> Edit Profile
            </Link>
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
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><UserIcon size={20} className="text-brand-500"/> Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">Full Name</p>
                     <p className="text-base text-gray-900 font-medium">{user?.name}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">Email Address</p>
                     <p className="text-base text-gray-900 font-medium">{user?.email}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">Phone Number</p>
                     <p className="text-base text-gray-900 font-medium">{user?.phone || 'Not provided'}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">Location</p>
                     <p className="text-base text-gray-900 font-medium">{user?.location || 'Not provided'}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">Date of Birth</p>
                     <p className="text-base text-gray-900 font-medium">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">Gender</p>
                     <p className="text-base text-gray-900 font-medium">{user?.gender || 'Not provided'}</p>
                   </div>
                   <div className="md:col-span-2">
                     <p className="text-sm text-gray-500 font-semibold mb-1">About Me</p>
                     <p className="text-base text-gray-900 font-medium leading-relaxed">{user?.bio || 'No bio added yet.'}</p>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Professional Info' && (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><Briefcase size={20} className="text-brand-500"/> Professional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                     <p className="text-sm text-gray-500 font-semibold mb-1">Professional Tagline</p>
                     <p className="text-base text-gray-900 font-medium">{user?.tagline || 'Not provided'}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">Preferred Job Type</p>
                     <p className="text-base text-gray-900 font-medium">{user?.preferredJobType || 'Not provided'}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">Expected Salary</p>
                     <p className="text-base text-gray-900 font-medium">{user?.expectedSalary || 'Not provided'}</p>
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">LinkedIn Profile</p>
                     {user?.linkedin ? <a href={user.linkedin} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">{user.linkedin}</a> : <p className="text-gray-500">Not provided</p>}
                   </div>
                   <div>
                     <p className="text-sm text-gray-500 font-semibold mb-1">GitHub Profile</p>
                     {user?.github ? <a href={user.github} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">{user.github}</a> : <p className="text-gray-500">Not provided</p>}
                   </div>
                   <div className="md:col-span-2">
                     <p className="text-sm text-gray-500 font-semibold mb-1">Portfolio/Website</p>
                     {user?.portfolio ? <a href={user.portfolio} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">{user.portfolio}</a> : <p className="text-gray-500">Not provided</p>}
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'Skills' && (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><Settings size={20} className="text-brand-500"/> Skills</h3>
                <div className="flex flex-wrap gap-2">
                   {user?.skills?.length ? (
                     user.skills.map((skill, idx) => (
                       <span key={idx} className="bg-gray-100 text-gray-800 border border-gray-200 font-semibold text-sm px-4 py-2 rounded-xl">{skill}</span>
                     ))
                   ) : (
                     <p className="text-gray-500">No skills added yet.</p>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'Education' && (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><GraduationCap size={20} className="text-brand-500"/> Education</h3>
                <div className="space-y-6">
                   {user?.education?.length ? (
                     user.education.map((edu, idx) => (
                       <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-2xl">
                          <div className="mt-1 bg-brand-50 p-3 rounded-full text-brand-600 h-12 w-12 flex items-center justify-center shrink-0">
                            <GraduationCap size={20}/>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{edu.institution}</h4>
                            <p className="text-base text-gray-700 font-medium">{edu.degree} in {edu.fieldOfStudy}</p>
                            <p className="text-sm text-gray-500 font-medium mt-1">{edu.startYear} - {edu.endYear}</p>
                          </div>
                       </div>
                     ))
                   ) : (
                     <p className="text-gray-500">No education details added yet.</p>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'Experience' && (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><Briefcase size={20} className="text-brand-500"/> Experience</h3>
                <div className="space-y-6 relative border-l-2 border-gray-100 ml-4">
                   {user?.experience?.length ? (
                     user.experience.map((exp, idx) => (
                       <div key={idx} className="relative pl-6">
                          <div className="absolute left-[-9px] top-1.5 w-4 h-4 bg-white border-2 border-brand-500 rounded-full"></div>
                          <div className="p-5 border border-gray-100 rounded-2xl hover:border-brand-200 transition-colors bg-gray-50/50">
                            <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                            <p className="text-base text-brand-600 font-bold">{exp.company}</p>
                            <p className="text-sm text-gray-500 font-medium mt-1 mb-3">
                               {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} - {exp.currentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A')}
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                          </div>
                       </div>
                     ))
                   ) : (
                     <p className="text-gray-500 pl-6">No experience details added yet.</p>
                   )}
                </div>
             </div>
          )}

          {activeTab === 'Resume' && (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><FileText size={20} className="text-brand-500"/> Resume</h3>
                {user?.resume ? (
                  <div className="border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center bg-gray-50">
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl shrink-0">
                      <FileText size={40}/>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className="font-bold text-gray-900 text-lg mb-1">{user.resume.split('/').pop()}</p>
                      <p className="text-sm font-medium text-gray-500 mb-4">Click download to view your resume.</p>
                      <a href={user.resume.startsWith('http') ? user.resume : `http://localhost:8000${user.resume}`} target="_blank" rel="noreferrer" download className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors inline-flex items-center gap-2 shadow-sm">
                         <Download size={18}/> Download Resume
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                     <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                     <p className="text-gray-500 font-medium">No resume uploaded yet.</p>
                     <Link to="/candidate/profile/edit" className="text-brand-600 font-bold hover:underline mt-2 inline-block">Upload Resume</Link>
                  </div>
                )}
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
             {profileScore < 100 && (
                <Link to="/candidate/profile/edit" className="block text-center w-full bg-brand-50 hover:bg-brand-100 text-brand-600 font-bold py-2 rounded-xl text-sm transition-colors">
                  Complete Profile
                </Link>
             )}
           </div>

           {/* Resume Widget */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-brand-500"/>
                  <h3 className="font-bold text-gray-900">Resume</h3>
                </div>
             </div>
             
             {user?.resume ? (
                <>
                   <div className="border border-gray-100 rounded-xl p-4 flex gap-4 items-start mb-4 bg-gray-50/50 hover:border-brand-200 transition-colors">
                      <div className="bg-red-50 text-red-600 p-2.5 rounded-lg shrink-0">
                        <FileText size={24}/>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{user.resume.split('/').pop()}</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-2">
                      <a href={user.resume.startsWith('http') ? user.resume : `http://localhost:8000${user.resume}`} target="_blank" rel="noreferrer" download className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 shadow-sm">
                         <Download size={14}/> Download
                      </a>
                      <Link to="/candidate/profile/edit" className="flex-1 bg-white hover:bg-gray-50 text-brand-600 border border-brand-200 font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1">
                         <Upload size={14}/> Replace
                      </Link>
                   </div>
                </>
             ) : (
                <div className="text-center py-6">
                   <p className="text-sm text-gray-500 mb-4">No resume uploaded</p>
                   <Link to="/candidate/profile/edit" className="bg-brand-50 hover:bg-brand-100 text-brand-600 font-bold py-2 px-4 rounded-lg text-xs transition-colors inline-flex items-center gap-1">
                      <Upload size={14}/> Upload Resume
                   </Link>
                </div>
             )}
           </div>

           {/* Skills Widget */}
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-brand-500 rounded flex items-center justify-center text-white"><CheckCircle2 size={12}/></div>
                  <h3 className="font-bold text-gray-900">My Skills</h3>
                </div>
                <Link to="/candidate/profile/edit" className="text-brand-600 border border-brand-200 hover:bg-orange-50 font-bold text-xs px-3 py-1 rounded-md transition-colors flex items-center gap-1"><Edit2 size={12}/> Edit</Link>
             </div>
             
             <div className="flex flex-wrap gap-2">
                {user?.skills?.length ? (
                  user.skills.map((skill, idx) => (
                    <span key={idx} className="bg-orange-50 text-brand-600 border border-orange-100 font-semibold text-xs px-3 py-1.5 rounded-lg">{skill}</span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 w-full text-center py-4">Add skills to get noticed.</p>
                )}
                <Link to="/candidate/profile/edit" className="bg-white border border-dashed border-brand-300 text-brand-600 hover:bg-brand-50 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Plus size={12}/> Add Skill
                </Link>
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
