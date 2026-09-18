import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Home,
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  Calendar,
  Lightbulb,
  Eye,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  ChevronDown,
  Sparkles,
  Check
} from 'lucide-react';

const JobForm = () => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    country: 'India',
    city: '',
    address: '',
    locationType: 'Select location type',
    jobType: 'Select job type',
    experienceLevel: 'Select experience level',
    workMode: 'Select work mode',
    vacancies: '',
    salaryRange: '',
    currency: 'INR',
    applicationDeadline: '',
    skills: '',
    responsibilities: '',
    requirements: '',
    status: 'active',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('edit');

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get('/api/companies/my');
        const companyList = data.data || [];
        setCompanies(companyList);
        if (!isEditMode && companyList.length > 0) {
          setFormData((prev) => ({ ...prev, company: companyList[0]._id }));
        }
      } catch (err) {
        console.error('Error fetching companies', err);
      }
    };
    fetchCompanies();
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const { data } = await axios.get(`/api/jobs/${id}`);
          const job = data.data;
          setFormData({
            title: job.title || '',
            company: job.company?._id || job.company || '',
            description: job.description || '',
            location: job.location || '',
            country: job.country || 'India',
            city: job.city || '',
            address: job.address || '',
            locationType: job.locationType || 'Select location type',
            jobType: job.jobType || 'Select job type',
            experienceLevel: job.experienceLevel || 'Select experience level',
            workMode: job.workMode || 'Select work mode',
            vacancies: job.vacancies || '',
            salaryRange: job.salaryText || (job.salary?.min ? `₹${job.salary.min} - ₹${job.salary.max || ''}` : ''),
            currency: job.currency || 'INR',
            applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
            skills: job.skills ? job.skills.join(', ') : '',
            responsibilities: job.responsibilities ? job.responsibilities.join('\n') : '',
            requirements: job.requirements ? job.requirements.join('\n') : '',
            status: job.status || 'active',
          });
        } catch (err) {
          setError('Error fetching job details');
        }
      };
      fetchJob();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => {
      const updated = { ...prev, [name]: val };
      // Sync location display string
      if (name === 'city' || name === 'country') {
        const c = name === 'city' ? val : prev.city;
        const cntry = name === 'country' ? val : prev.country;
        updated.location = c ? `${c}, ${cntry}` : cntry;
      }
      return updated;
    });
  };

  const handleFormatText = (command) => {
    let prefix = '';
    let suffix = '';
    if (command === 'bold') {
      prefix = '**';
      suffix = '**';
    } else if (command === 'italic') {
      prefix = '*';
      suffix = '*';
    } else if (command === 'underline') {
      prefix = '<u>';
      suffix = '</u>';
    } else if (command === 'bullet') {
      prefix = '\n• ';
    } else if (command === 'number') {
      prefix = '\n1. ';
    } else if (command === 'link') {
      prefix = '[';
      suffix = '](https://)';
    }

    setFormData((prev) => ({
      ...prev,
      description: prev.description + prefix + suffix,
    }));
  };

  const handleSubmit = async (e, customStatus = null) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const targetStatus = customStatus || formData.status || 'active';

    if (!formData.title.trim()) {
      setError('Please provide a job title.');
      setLoading(false);
      return;
    }

    if (!formData.company) {
      setError('Please select a company. If you do not have one, create a company first.');
      setLoading(false);
      return;
    }

    // Process skills into array
    const skillArray = formData.skills
      ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : ['React', 'Node.js', 'PostgreSQL'];

    // Map fields for backend compatibility
    const submitData = {
      title: formData.title,
      company: formData.company,
      description: formData.description || 'No description provided.',
      location: formData.city ? `${formData.city}, ${formData.country}` : (formData.location || 'Bangalore, India'),
      country: formData.country,
      city: formData.city,
      address: formData.address,
      locationType: formData.locationType !== 'Select location type' ? formData.locationType : 'On-site',
      jobType: formData.jobType !== 'Select job type' ? formData.jobType.toLowerCase() : 'full-time',
      experienceLevel: formData.experienceLevel !== 'Select experience level' ? formData.experienceLevel.toLowerCase() : '1-2 years',
      workMode: formData.workMode !== 'Select work mode' ? formData.workMode : 'On-site',
      vacancies: formData.vacancies ? Number(formData.vacancies) : 1,
      salaryText: formData.salaryRange,
      currency: formData.currency,
      applicationDeadline: formData.applicationDeadline || undefined,
      skills: skillArray.length > 0 ? skillArray : ['React', 'Node.js'],
      responsibilities: formData.responsibilities ? formData.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      requirements: formData.requirements ? formData.requirements.split('\n').map((s) => s.trim()).filter(Boolean) : [],
      remote: formData.workMode === 'Remote' || formData.locationType === 'Remote',
      status: targetStatus,
    };

    try {
      if (isEditMode) {
        await axios.put(`/api/jobs/${id}`, submitData);
      } else {
        await axios.post('/api/jobs', submitData);
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving job');
    } finally {
      setLoading(false);
    }
  };

  const selectedCompanyObj = companies.find((c) => c._id === formData.company);
  const selectedCompanyName = selectedCompanyObj?.name || 'TechNova Solutions';

  const skillBadges = formData.skills
    ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : ['React', 'Node.js', 'PostgreSQL'];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-[#f9571c] transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
        </Link>
        <span className="text-gray-400">&gt;</span>
        <Link to="/recruiter/jobs" className="hover:text-[#f9571c] transition-colors">
          My Jobs
        </Link>
        <span className="text-gray-400">&gt;</span>
        <span className="text-gray-900 font-bold">Post a New Job</span>
      </nav>

      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {isEditMode ? 'Edit Job Posting' : 'Post a New Job'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to create a job posting and reach the best talent.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between shadow-xs">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 font-bold hover:text-red-800">×</button>
        </div>
      )}

      {/* Main Grid: Form Column + Preview Widgets Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Form Area (Span 8) */}
        <form onSubmit={(e) => handleSubmit(e, 'active')} className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#f9571c] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug">Basic Information</h3>
                <p className="text-xs text-gray-500">Add the essential details about the job.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Job Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Job Title <span className="text-[#f9571c]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Company <span className="text-[#f9571c]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all appearance-none pr-8 cursor-pointer font-medium text-gray-800"
                  >
                    <option value="">Select company...</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                    {companies.length === 0 && (
                      <option value="default_company">TechNova Solutions</option>
                    )}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Job Type <span className="text-[#f9571c]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all appearance-none pr-8 cursor-pointer font-medium text-gray-800"
                  >
                    <option value="Select job type">Select job type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Experience Level <span className="text-[#f9571c]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="experienceLevel"
                    required
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all appearance-none pr-8 cursor-pointer font-medium text-gray-800"
                  >
                    <option value="Select experience level">Select experience level</option>
                    <option value="fresher">Fresher / Entry level</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-4 years">2-4 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Number of Openings */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Number of Openings <span className="text-[#f9571c]">*</span>
                </label>
                <input
                  type="text"
                  name="vacancies"
                  placeholder="e.g. 3"
                  value={formData.vacancies}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Work Mode <span className="text-[#f9571c]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="workMode"
                    required
                    value={formData.workMode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all appearance-none pr-8 cursor-pointer font-medium text-gray-800"
                  >
                    <option value="Select work mode">Select work mode</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Job Location */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#f9571c] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug">Job Location</h3>
                <p className="text-xs text-gray-500">Specify where the job is located.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Location Type <span className="text-[#f9571c]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="locationType"
                    required
                    value={formData.locationType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all appearance-none pr-8 cursor-pointer font-medium text-gray-800"
                  >
                    <option value="Select location type">Select location type</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Country <span className="text-[#f9571c]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all appearance-none pr-8 cursor-pointer font-medium text-gray-800"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City <span className="text-[#f9571c]">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Address (Optional) */}
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-700 mb-1">Address (Optional)</label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Manyata Tech Park, Bangalore"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Job Details */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#f9571c] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug">Job Details</h3>
                <p className="text-xs text-gray-500">Provide a detailed description of the role.</p>
              </div>
            </div>

            {/* Job Description with Rich Text Bar */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Job Description <span className="text-[#f9571c]">*</span>
              </label>

              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#f9571c] focus-within:ring-2 focus-within:ring-[#f9571c]/20 transition-all bg-gray-50/30">
                {/* Rich Formatting Toolbar */}
                <div className="flex items-center gap-1.5 p-2 bg-gray-50 border-b border-gray-200 text-gray-600">
                  <button
                    type="button"
                    onClick={() => handleFormatText('bold')}
                    className="p-1.5 hover:bg-white rounded-lg hover:text-gray-900 transition-colors font-bold"
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('italic')}
                    className="p-1.5 hover:bg-white rounded-lg hover:text-gray-900 transition-colors"
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('underline')}
                    className="p-1.5 hover:bg-white rounded-lg hover:text-gray-900 transition-colors"
                    title="Underline"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-gray-200 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => handleFormatText('bullet')}
                    className="p-1.5 hover:bg-white rounded-lg hover:text-gray-900 transition-colors"
                    title="Bullet list"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('number')}
                    className="p-1.5 hover:bg-white rounded-lg hover:text-gray-900 transition-colors"
                    title="Numbered list"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormatText('link')}
                    className="p-1.5 hover:bg-white rounded-lg hover:text-gray-900 transition-colors"
                    title="Insert link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  name="description"
                  required
                  rows={5}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 text-xs bg-transparent focus:outline-none resize-y placeholder:text-gray-400"
                />

                <div className="flex justify-end p-2 bg-white text-[11px] text-gray-400 border-t border-gray-100 font-medium">
                  {formData.description.length}/5000
                </div>
              </div>
            </div>

            {/* Key Responsibilities & Requirements side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Key Responsibilities <span className="text-[#f9571c]">*</span>
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#f9571c] focus-within:ring-2 focus-within:ring-[#f9571c]/20 transition-all bg-gray-50/30">
                  <textarea
                    name="responsibilities"
                    rows={4}
                    placeholder="• Add key responsibilities&#10;• e.g. Develop and maintain web applications"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="w-full p-3 text-xs bg-transparent focus:outline-none resize-y placeholder:text-gray-400"
                  />
                  <div className="flex justify-end p-2 bg-white text-[11px] text-gray-400 border-t border-gray-100 font-medium">
                    {formData.responsibilities.length}/1000
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Requirements <span className="text-[#f9571c]">*</span>
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#f9571c] focus-within:ring-2 focus-within:ring-[#f9571c]/20 transition-all bg-gray-50/30">
                  <textarea
                    name="requirements"
                    rows={4}
                    placeholder="• Add required skills and qualifications&#10;• e.g. 2+ years of experience in React"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full p-3 text-xs bg-transparent focus:outline-none resize-y placeholder:text-gray-400"
                  />
                  <div className="flex justify-end p-2 bg-white text-[11px] text-gray-400 border-t border-gray-100 font-medium">
                    {formData.requirements.length}/1000
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Additional Information */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#f9571c] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug">Additional Information</h3>
                <p className="text-xs text-gray-500">Add extra details to stand out.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Salary Range */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Salary Range (Optional)</label>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:border-[#f9571c] focus-within:ring-2 focus-within:ring-[#f9571c]/20 bg-gray-50/50">
                  <input
                    type="text"
                    name="salaryRange"
                    placeholder="e.g. ₹10,000,000 - ₹15,000,000"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-transparent focus:outline-none placeholder:text-gray-400"
                  />
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="bg-gray-100 text-xs font-bold text-gray-700 px-2.5 py-2.5 border-l border-gray-200 focus:outline-none cursor-pointer"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Application Deadline (Optional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all text-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Skills (Optional)</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React, Node.js, MongoDB"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] focus:bg-white transition-all placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400 mt-1 font-medium">Press Enter to add multiple skills</p>
              </div>
            </div>
          </div>

          {/* Form Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border-2 border-[#f9571c] text-[#f9571c] bg-white hover:bg-orange-50 font-bold text-xs transition-colors shadow-2xs"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#f9571c] hover:bg-[#e04810] text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                'Saving...'
              ) : isEditMode ? (
                'Update Job'
              ) : (
                'Publish Job'
              )}
            </button>
          </div>
        </form>

        {/* Right Sidebar Widgets Column (Span 4) */}
        <div className="lg:col-span-4 space-y-6 sticky top-[80px]">
          
          {/* Widget 1: Tips for a Great Job Posting */}
          <div className="bg-[#fffbf0] rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-amber-900">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 fill-white" />
              </div>
              <h4 className="font-extrabold text-sm tracking-tight">Tips for a Great Job Posting</h4>
            </div>

            <ol className="space-y-2.5">
              {[
                'Write a clear and specific job title.',
                'Add a detailed job description.',
                'Mention key skills and requirements.',
                'Be transparent about salary and location.',
                'Keep the information up to date.',
                'Use a professional and engaging tone.',
              ].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-amber-950 font-medium leading-tight">
                  <span className="w-4 h-4 rounded-full bg-[#f9571c] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Widget 2: Preview Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <Eye className="w-4 h-4 text-[#f9571c]" />
              <h4 className="font-extrabold text-sm">Preview</h4>
            </div>
            <p className="text-xs text-gray-500 leading-snug">This is how your job will appear to candidates.</p>

            {/* Inner Job Card Preview */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs hover:border-orange-200 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-900 text-[#f9571c] font-black text-xl rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                  {selectedCompanyName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-sm leading-snug">
                    {formData.title || 'Software Engineer'}
                  </h5>
                  <p className="text-xs font-semibold text-gray-600">{selectedCompanyName}</p>
                </div>
              </div>

              {/* Meta items */}
              <div className="space-y-1 text-xs text-gray-500 font-medium pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {formData.city
                      ? `${formData.city}, ${formData.country}`
                      : 'Bangalore, India'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {formData.jobType !== 'Select job type' ? formData.jobType : 'Full-time'} •{' '}
                    {formData.workMode !== 'Select work mode' ? formData.workMode : 'On-site'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Posted just now</span>
                </div>
              </div>

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skillBadges.slice(0, 4).map((sk, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#eef2f6] text-[#334155]"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Snippet text */}
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed pt-1">
                {formData.description
                  ? formData.description
                  : 'We are looking for a talented Software Engineer to join our team and build scalable web applications...'}
              </p>

              <button
                type="button"
                className="w-full py-2 border border-[#f9571c] text-[#f9571c] hover:bg-orange-50 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
              >
                <span>View Full Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Widget 3: Graphic Illustration Banner */}
          <div className="bg-[#fff5ee] rounded-2xl p-6 border border-orange-100 text-center relative overflow-hidden flex flex-col items-center justify-center space-y-4 shadow-2xs">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Target / Dartboard SVG Graphic matching mockup */}
              <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
                {/* Outer dashed ring */}
                <circle cx="45" cy="55" r="32" stroke="#f9571c" strokeWidth="4" strokeDasharray="4 4" opacity="0.4" />
                {/* Middle ring */}
                <circle cx="45" cy="55" r="22" stroke="#f9571c" strokeWidth="4" />
                {/* Bullseye */}
                <circle cx="45" cy="55" r="10" fill="#f9571c" />
                {/* Dart Arrow */}
                <path d="M78 22 L49 51" stroke="#f9571c" strokeWidth="4" strokeLinecap="round" />
                <polygon points="78,22 88,12 80,10 74,16" fill="#f9571c" />
                <polygon points="78,22 88,32 90,26 84,20" fill="#f9571c" />
              </svg>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-gray-900 text-lg tracking-tight leading-tight">
                Great people <br /> build great products.
              </h4>
              {/* Hand-drawn orange stroke underline */}
              <div className="flex justify-center pt-1">
                <svg className="w-28 h-3 text-[#f9571c]" viewBox="0 0 100 12" fill="none">
                  <path d="M3 8 Q 50 1 97 7" stroke="#f9571c" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobForm;
