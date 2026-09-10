import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User, Briefcase, GraduationCap, Link as LinkIcon, Settings,
  Camera, CheckCircle2, Circle, Lightbulb, Eye, BarChart2,
  MapPin, FileText, Plus, Trash2, Upload
} from 'lucide-react';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '', dateOfBirth: '', gender: 'Male', bio: '',
    linkedin: '', github: '', portfolio: '', tagline: '', preferredJobType: 'Full Time', expectedSalary: 'Not Disclosed',
    skills: [], education: [], experience: [], resume: '', profilePhoto: ''
  });

  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const [newSkill, setNewSkill] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '', email: user.email || '', phone: user.phone || '', location: user.location || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || 'Male', bio: user.bio || '', linkedin: user.linkedin || '', github: user.github || '',
        portfolio: user.portfolio || '', tagline: user.tagline || '', preferredJobType: user.preferredJobType || 'Full Time',
        expectedSalary: user.expectedSalary || 'Not Disclosed', skills: user.skills || [], education: user.education || [],
        experience: user.experience || [], resume: user.resume || '', profilePhoto: user.profilePhoto || ''
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const data = new FormData();
    data.append('file', file);
    
    setUploading(true);
    try {
      const res = await axios.post('/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData({ ...formData, [type]: res.data.data.url });
      }
    } catch (error) {
      console.error(`Error uploading ${type}`, error);
      alert(`Failed to upload ${type}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const handleAddEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', degree: '', fieldOfStudy: '', startYear: '', endYear: '' }]
    });
  };

  const handleEducationChange = (index, e) => {
    const updatedEdu = formData.education.map((edu, i) => i === index ? { ...edu, [e.target.name]: e.target.value } : edu);
    setFormData({ ...formData, education: updatedEdu });
  };

  const handleRemoveEducation = (index) => {
    setFormData({ ...formData, education: formData.education.filter((_, i) => i !== index) });
  };

  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', position: '', startDate: '', endDate: '', currentlyWorking: false, description: '' }]
    });
  };

  const handleExperienceChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedExp = formData.experience.map((exp, i) => i === index ? { ...exp, [name]: type === 'checkbox' ? checked : value } : exp);
    setFormData({ ...formData, experience: updatedExp });
  };

  const handleRemoveExperience = (index) => {
    setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccess('');
    try {
      const res = await axios.put('/api/auth/me', formData);
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => { setSuccess(''); navigate('/candidate/profile'); }, 1500);
      }
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!user) return 0;
    let completed = 0; const totalFields = 5;
    if (formData.name && formData.email) completed++; 
    if (formData.education?.length > 0) completed++;
    if (formData.skills?.length > 0) completed++;
    if (formData.experience?.length > 0) completed++;
    if (formData.resume) completed++;
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
      {uploading && <div className="p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-semibold shadow-sm">Uploading file... please wait.</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-x-auto">
            {tabs.map(tab => (
              <button 
                key={tab.id} onClick={() => setActiveTab(tab.id)}
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
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><User size={20} className="text-brand-500"/> Personal Information</h3>
                   <div className="flex flex-col md:flex-row gap-8">
                      <div className="shrink-0 flex flex-col items-center">
                        <label className="text-sm font-semibold text-gray-700 mb-3 self-start md:self-center">Profile Photo</label>
                        <div className="relative mb-3">
                           <div className="w-28 h-28 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50">
                              {formData.profilePhoto ? (
                                 <img src={formData.profilePhoto.startsWith('http') ? formData.profilePhoto : `http://localhost:8000${formData.profilePhoto}`} alt={formData.name} className="w-full h-full object-cover" />
                              ) : (
                                 <div className="w-full h-full text-gray-300 flex items-center justify-center text-4xl font-bold bg-gray-100">
                                    {formData.name.charAt(0) || 'U'}
                                 </div>
                              )}
                           </div>
                           <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-brand-600 shadow-sm transition-colors">
                              <Camera size={16} />
                           </button>
                           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePhoto')} />
                        </div>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-brand-600 border border-brand-200 hover:bg-orange-50 font-bold text-xs px-4 py-2 rounded-lg transition-colors w-full">Change Photo</button>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed text-sm font-medium" readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth</label>
                          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400"><MapPin size={16}/></span>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm font-medium" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm font-medium bg-white">
                             <option value="Male">Male</option>
                             <option value="Female">Female</option>
                             <option value="Other">Other</option>
                             <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><FileText size={20} className="text-brand-500"/> About Me</h3>
                   <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm font-medium" placeholder="Short summary about yourself..."></textarea>
                </div>
             </form>
          )}

          {activeTab === 'Professional Info' && (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Briefcase size={20} className="text-brand-500"/> Professional Details</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Professional Tagline</label>
                        <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="e.g. Senior Frontend Developer | React Specialist" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Job Type</label>
                        <select name="preferredJobType" value={formData.preferredJobType} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 text-sm bg-white">
                           <option value="Full Time">Full Time</option>
                           <option value="Part Time">Part Time</option>
                           <option value="Contract">Contract</option>
                           <option value="Internship">Internship</option>
                           <option value="Freelance">Freelance</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Expected Salary</label>
                        <input type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} placeholder="e.g. 15 LPA" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 text-sm" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">LinkedIn Profile</label>
                         <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 text-sm" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">GitHub Profile</label>
                         <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 text-sm" />
                      </div>
                      <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-1.5">Portfolio/Website</label>
                         <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 text-sm" />
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><FileText size={20} className="text-brand-500"/> Resume</h3>
                   <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                     <Upload size={32} className="text-brand-400 mb-3" />
                     <p className="text-sm text-gray-600 mb-2">Upload your updated resume (PDF preferred)</p>
                     <input type="file" ref={resumeInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'resume')} />
                     <button type="button" onClick={() => resumeInputRef.current?.click()} className="bg-brand-50 text-brand-600 font-bold px-6 py-2 rounded-lg hover:bg-brand-100 transition-colors">
                        Select File
                     </button>
                     {formData.resume && (
                       <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 flex items-center gap-2">
                         <FileText size={16} className="text-brand-500" />
                         <span className="truncate max-w-xs">{formData.resume.split('/').pop()}</span>
                       </div>
                     )}
                   </div>
                </div>
             </form>
          )}

          {activeTab === 'Skills' && (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4"><Settings size={20} className="text-brand-500"/> Skills</h3>
                   <div className="flex gap-2 mb-6">
                     <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} placeholder="Add a skill (e.g. React, Node.js)" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-brand-500 text-sm" />
                     <button type="button" onClick={handleAddSkill} className="bg-brand-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-1 hover:bg-brand-700"><Plus size={16}/> Add</button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {formData.skills.map((skill, idx) => (
                       <div key={idx} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                         {skill}
                         <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                       </div>
                     ))}
                   </div>
                </div>
             </form>
          )}

          {activeTab === 'Education' && (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><GraduationCap size={20} className="text-brand-500"/> Education Details</h3>
                     <button type="button" onClick={handleAddEducation} className="text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors"><Plus size={16}/> Add Education</button>
                   </div>
                   <div className="space-y-6">
                     {formData.education.map((edu, idx) => (
                       <div key={idx} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 relative">
                         <button type="button" onClick={() => handleRemoveEducation(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Institution</label>
                             <input type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(idx, e)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500" />
                           </div>
                           <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Degree</label>
                             <input type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(idx, e)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500" />
                           </div>
                           <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Field of Study</label>
                             <input type="text" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(idx, e)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500" />
                           </div>
                           <div className="flex gap-4">
                             <div className="flex-1">
                               <label className="block text-sm font-semibold text-gray-700 mb-1">Start Year</label>
                               <input type="number" name="startYear" value={edu.startYear} onChange={(e) => handleEducationChange(idx, e)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500" />
                             </div>
                             <div className="flex-1">
                               <label className="block text-sm font-semibold text-gray-700 mb-1">End Year</label>
                               <input type="number" name="endYear" value={edu.endYear} onChange={(e) => handleEducationChange(idx, e)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500" />
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                     {formData.education.length === 0 && <p className="text-center text-gray-500 text-sm">No education details added yet.</p>}
                   </div>
                </div>
             </form>
          )}

          {activeTab === 'Experience' && (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Briefcase size={20} className="text-brand-500"/> Experience</h3>
                     <button type="button" onClick={handleAddExperience} className="text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors"><Plus size={16}/> Add Experience</button>
                   </div>
                   <div className="space-y-6">
                     {formData.experience.map((exp, idx) => (
                       <div key={idx} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 relative">
                         <button type="button" onClick={() => handleRemoveExperience(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Company</label>
                             <input type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(idx, e)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500" />
                           </div>
                           <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Position</label>
                             <input type="text" name="position" value={exp.position} onChange={(e) => handleExperienceChange(idx, e)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500" />
                           </div>
                           <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                             <input type="date" name="startDate" value={exp.startDate ? exp.startDate.split('T')[0] : ''} onChange={(e) => handleExperienceChange(idx, e)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500" />
                           </div>
                           <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                             <input type="date" name="endDate" value={exp.endDate ? exp.endDate.split('T')[0] : ''} disabled={exp.currentlyWorking} onChange={(e) => handleExperienceChange(idx, e)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500 disabled:opacity-50" />
                             <div className="mt-2 flex items-center gap-2">
                               <input type="checkbox" name="currentlyWorking" checked={exp.currentlyWorking} onChange={(e) => handleExperienceChange(idx, e)} id={`current-${idx}`} />
                               <label htmlFor={`current-${idx}`} className="text-xs text-gray-600 font-semibold">I currently work here</label>
                             </div>
                           </div>
                           <div className="sm:col-span-2">
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                             <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(idx, e)} rows="3" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-brand-500" placeholder="Describe your responsibilities..."></textarea>
                           </div>
                         </div>
                       </div>
                     ))}
                     {formData.experience.length === 0 && <p className="text-center text-gray-500 text-sm">No experience details added yet.</p>}
                   </div>
                </div>
             </form>
          )}

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-24">
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
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{formData.education?.length ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Education Details</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{formData.skills?.length ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Add Skills</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{formData.experience?.length ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Add Experience</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">{formData.resume ? <CheckCircle2 size={14} className="text-green-500 shrink-0"/> : <Circle size={14} className="text-gray-300 shrink-0"/>} Upload Resume</div>
             </div>
           </div>

           <div className="bg-[#FEF8F0] rounded-3xl p-6 shadow-sm border border-orange-100">
             <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={20} className="text-yellow-500 fill-current"/>
                <h3 className="font-bold text-gray-900 text-sm">Tip</h3>
             </div>
             <p className="text-xs text-gray-700 font-medium leading-relaxed">
               A complete profile is 3x more likely to get noticed by recruiters.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
