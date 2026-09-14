import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Building,
  Upload,
  Globe,
  Calendar,
  MapPin,
  FileText,
  Lightbulb,
  Eye,
  ExternalLink,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Loader2,
  X,
  Briefcase,
  Users,
  Building2,
  Sparkles,
  Pencil,
  ChevronRight,
  Trash2,
  Home
} from 'lucide-react';

const CompanyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: isEditMode ? 'TechNova Solutions' : '',
    website: isEditMode ? 'https://www.technova.com' : '',
    industry: isEditMode ? 'Information Technology' : '',
    companySize: isEditMode ? '201 – 500 employees' : '',
    foundedYear: isEditMode ? '2018' : '',
    companyType: isEditMode ? 'Private Limited' : '',
    country: 'India',
    city: isEditMode ? 'Bangalore' : '',
    state: isEditMode ? 'Karnataka' : '',
    address: isEditMode ? '123 Innovation Drive, Koramangala, Bangalore - 560034' : '',
    shortDescription: isEditMode
      ? 'TechNova Solutions is a leading IT services and consulting company focused on building innovative software solutions for global clients.'
      : '',
    fullDescription: isEditMode
      ? 'TechNova Solutions is a forward-thinking technology company that helps businesses accelerate their digital transformation. We specialize in web and mobile application development, cloud solutions, AI/ML, and enterprise software. Our mission is to build innovative solutions that create real impact and empower businesses worldwide.'
      : '',
    linkedin: isEditMode ? 'https://linkedin.com/company/technova' : '',
    twitter: isEditMode ? 'https://twitter.com/technova' : '',
    socialWebsite: isEditMode ? 'https://www.technova.com' : '',
    status: 'Active',
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCompany = async () => {
        setFetching(true);
        try {
          const token = localStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const { data } = await axios.get(`/api/companies/${id}`, { headers });
          if (data && data.data) {
            const comp = data.data;
            setFormData({
              name: comp.name || 'TechNova Solutions',
              website: comp.website || 'https://www.technova.com',
              industry: comp.industry || 'Information Technology',
              companySize: comp.companySize || '201 – 500 employees',
              foundedYear: comp.foundedYear || '2018',
              companyType: comp.companyType || 'Private Limited',
              country: comp.country || 'India',
              city: comp.city || 'Bangalore',
              state: comp.state || 'Karnataka',
              address: comp.address || '123 Innovation Drive, Koramangala, Bangalore - 560034',
              shortDescription:
                comp.shortDescription ||
                comp.description ||
                'TechNova Solutions is a leading IT services and consulting company focused on building innovative software solutions for global clients.',
              fullDescription:
                comp.fullDescription ||
                comp.description ||
                'TechNova Solutions is a forward-thinking technology company that helps businesses accelerate their digital transformation. We specialize in web and mobile application development, cloud solutions, AI/ML, and enterprise software. Our mission is to build innovative solutions that create real impact and empower businesses worldwide.',
              linkedin: comp.linkedin || comp.socialLinks?.linkedin || 'https://linkedin.com/company/technova',
              twitter: comp.twitter || comp.socialLinks?.twitter || 'https://twitter.com/technova',
              socialWebsite: comp.socialLinks?.website || comp.website || 'https://www.technova.com',
              status: comp.status || 'Active',
            });
            if (comp.logo) {
              setLogoPreview(comp.logo);
            }
          }
        } catch (err) {
          console.error('Error fetching company details:', err);
        } finally {
          setFetching(false);
        }
      };
      fetchCompany();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'shortDescription' && value.length > 200) return;
    if (name === 'fullDescription' && value.length > 1000) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const handleFormatText = (command) => {
    const textarea = document.getElementById('fullDescriptionTextarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.fullDescription.substring(start, end);
    let replacement = '';

    switch (command) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        replacement = `<u>${selectedText || 'underlined text'}</u>`;
        break;
      case 'bullet':
        replacement = `\n- ${selectedText || 'list item'}`;
        break;
      case 'number':
        replacement = `\n1. ${selectedText || 'list item'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      default:
        return;
    }

    const newText =
      formData.fullDescription.substring(0, start) +
      replacement +
      formData.fullDescription.substring(end);
    
    if (newText.length <= 1000) {
      setFormData((prev) => ({ ...prev, fullDescription: newText }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Company Name is required.');
      return;
    }
    if (!formData.industry) {
      setError('Please select an Industry.');
      return;
    }

    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });
    if (logo) {
      submitData.append('logo', logo);
    }

    try {
      if (isEditMode) {
        await axios.put(`/api/companies/${id}`, submitData, { headers });
      } else {
        await axios.post('/api/companies', submitData, { headers });
      }
      navigate('/recruiter/companies');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`/api/companies/${id}`, { headers });
      navigate('/recruiter/companies');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete company');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#f9571c] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* Top Breadcrumb Navigation */}
      <nav className="flex items-center text-xs font-medium text-gray-500 space-x-2">
        <Link to="/recruiter/companies" className="hover:text-[#f9571c] transition-colors flex items-center gap-1 text-gray-500">
          <Home className="w-3.5 h-3.5" />
          <span>My Companies</span>
        </Link>
        <span>&gt;</span>
        <span className="text-gray-600">{formData.name || 'TechNova Solutions'}</span>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">{isEditMode ? 'Edit Company' : 'Create Company'}</span>
      </nav>

      {/* Title Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {isEditMode ? 'Edit Company' : 'Create Company'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
          Update your company details. Keep your information up to date for better visibility.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-2xs">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Card 1: Basic Information */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs space-y-6">
              <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f9571c] flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Basic Information</h2>
                  <p className="text-xs text-gray-500">Update the basic details about your company.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Company Logo Dropzone / Container (Left side of Basic Info) */}
                <div className="md:col-span-4 flex flex-col items-center sm:items-start space-y-3">
                  <label className="block text-xs font-bold text-gray-700">Company Logo</label>
                  
                  {/* Square Logo Box with Edit Badge */}
                  <div className="relative group w-36 h-36 bg-[#1a1514] rounded-2xl flex items-center justify-center p-3 border border-gray-800 shadow-md">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company Logo"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-[#241d1b] flex items-center justify-center text-amber-500 font-extrabold text-5xl tracking-wider select-none">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : 'T'}
                      </div>
                    )}

                    {/* Pencil Edit Icon Badge on bottom right corner */}
                    <label
                      htmlFor="company-logo-input"
                      className="absolute -bottom-2 -right-2 w-9 h-9 bg-[#f9571c] hover:bg-[#e04810] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer transition-transform hover:scale-105"
                      title="Edit Logo"
                    >
                      <Pencil className="w-4 h-4 stroke-[2.5]" />
                    </label>

                    <input
                      id="company-logo-input"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Change Logo Button & Specs */}
                  <div className="flex flex-col items-center sm:items-start pt-1 space-y-1">
                    <label
                      htmlFor="company-logo-input"
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-[#f9571c] hover:border-orange-200 rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-gray-500" />
                      <span>Change Logo</span>
                    </label>
                    <span className="text-[11px] text-gray-400 font-medium">PNG, JPG (Max 2MB)</span>
                  </div>
                </div>

                {/* Form Fields (Right side of Basic Info) */}
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Company Name <span className="text-[#f9571c]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="TechNova Solutions"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 font-medium text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Website</label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          name="website"
                          placeholder="https://www.technova.com"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Industry <span className="text-[#f9571c]">*</span>
                      </label>
                      <select
                        name="industry"
                        required
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-900 font-medium"
                      >
                        <option value="">Select industry</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Software & SaaS">Software & SaaS</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                        <option value="E-commerce & Retail">E-commerce & Retail</option>
                        <option value="Education & EdTech">Education & EdTech</option>
                        <option value="Consulting & Professional Services">Consulting & Professional Services</option>
                        <option value="Media & Entertainment">Media & Entertainment</option>
                        <option value="Real Estate & Construction">Real Estate & Construction</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Company Size <span className="text-[#f9571c]">*</span>
                      </label>
                      <select
                        name="companySize"
                        required
                        value={formData.companySize}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-900 font-medium"
                      >
                        <option value="">Select company size</option>
                        <option value="1 – 10 employees">1 – 10 employees</option>
                        <option value="11 – 50 employees">11 – 50 employees</option>
                        <option value="51 – 200 employees">51 – 200 employees</option>
                        <option value="201 – 500 employees">201 – 500 employees</option>
                        <option value="501 – 1,000 employees">501 – 1,000 employees</option>
                        <option value="1,000+ employees">1,000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Founded Year</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="foundedYear"
                          placeholder="2018"
                          value={formData.foundedYear}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Company Type</label>
                      <select
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-900 font-medium"
                      >
                        <option value="">Select company type</option>
                        <option value="Private Limited">Private Limited</option>
                        <option value="Public Limited">Public Limited</option>
                        <option value="Startup">Startup</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Non-Profit">Non-Profit</option>
                        <option value="Government">Government</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Card 2: Location */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs space-y-5">
              <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f9571c] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Location</h2>
                  <p className="text-xs text-gray-500">Update your company's location details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Country <span className="text-[#f9571c]">*</span>
                  </label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-900 font-medium"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Germany">Germany</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    City <span className="text-[#f9571c]">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Bangalore"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Karnataka"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="address"
                    placeholder="123 Innovation Drive, Koramangala, Bangalore - 560034"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: About Company */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs space-y-5">
              <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f9571c] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">About Company</h2>
                  <p className="text-xs text-gray-500">Update your company description.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Short Description <span className="text-[#f9571c]">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="shortDescription"
                    rows="3"
                    required
                    placeholder="TechNova Solutions is a leading IT services and consulting company..."
                    value={formData.shortDescription}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 pb-7 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-800 leading-relaxed font-medium"
                  ></textarea>
                  <span className="absolute bottom-2.5 right-3 text-[11px] font-medium text-gray-400 select-none">
                    {formData.shortDescription.length}/200
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Full Description <span className="text-[#f9571c]">*</span>
                </label>
                
                {/* Formatting Toolbar + Textarea */}
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f9571c]/20 focus-within:border-[#f9571c] transition-all">
                  <div className="bg-gray-50/90 border-b border-gray-200 px-3 py-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleFormatText('bold')}
                      title="Bold"
                      className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded-md transition-colors font-bold text-xs"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('italic')}
                      title="Italic"
                      className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded-md transition-colors"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('underline')}
                      title="Underline"
                      className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded-md transition-colors"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => handleFormatText('bullet')}
                      title="Bullet List"
                      className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded-md transition-colors"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('number')}
                      title="Numbered List"
                      className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded-md transition-colors"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => handleFormatText('link')}
                      title="Insert Link"
                      className="p-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 rounded-md transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="relative">
                    <textarea
                      id="fullDescriptionTextarea"
                      name="fullDescription"
                      rows="6"
                      required
                      placeholder="TechNova Solutions is a forward-thinking technology company that helps businesses accelerate their digital transformation..."
                      value={formData.fullDescription}
                      onChange={handleChange}
                      className="w-full p-3.5 pb-7 bg-white border-0 text-sm focus:outline-hidden text-gray-800 leading-relaxed font-medium placeholder:text-gray-400 resize-y"
                    ></textarea>
                    <span className="absolute bottom-2.5 right-3 text-[11px] font-medium text-gray-400 select-none">
                      {formData.fullDescription.length}/1000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Social Links */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-2xs space-y-5">
              <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f9571c] flex items-center justify-center shrink-0">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">Social Links</h2>
                  <p className="text-xs text-gray-500">Update your social media links.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* LinkedIn Link */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">
                    in
                  </div>
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/company/technova"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                  />
                </div>

                {/* Twitter Link */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-gray-100 text-gray-800 flex items-center justify-center font-bold text-xs">
                    X
                  </div>
                  <input
                    type="url"
                    name="twitter"
                    placeholder="https://twitter.com/technova"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                  />
                </div>

                {/* Social Website Link */}
                <div className="relative">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    name="socialWebsite"
                    placeholder="https://www.technova.com"
                    value={formData.socialWebsite}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Form Bottom Action Buttons */}
            <div className="flex items-center justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/recruiter/companies')}
                className="px-7 py-2.5 bg-white border border-[#f9571c] text-[#f9571c] font-bold text-sm rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-[#f9571c] hover:bg-[#e04810] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Column Sidebar Widgets (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Widget 1: Company Preview Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
            {/* Header Title */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Company Preview</h3>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
                title="Open Preview Modal"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Modern Banner Header Image */}
            <div className="h-32 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative overflow-hidden flex items-center justify-end pr-4">
              <div className="absolute inset-0 bg-black/20"></div>
              {/* Graphic background line art */}
              <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 blur-xl"></div>
              <div className="absolute top-2 left-6 w-32 h-20 bg-blue-500/10 rounded-full blur-md"></div>
              
              {/* Overlay graphic text badge */}
              <div className="relative z-10 text-right transform rotate-[-3deg]">
                <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white shadow-lg">
                  <span className="font-serif italic text-sm tracking-wide text-amber-300 font-bold block">
                    Innovate
                  </span>
                  <span className="font-extrabold text-xs tracking-wider uppercase text-white block">
                    Build Grow Together
                  </span>
                </div>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-5 pt-0 relative space-y-4">
              
              {/* Overlapping Company Logo */}
              <div className="relative -mt-10 mb-2">
                <div className="w-16 h-16 bg-[#1a1514] rounded-2xl border-4 border-white shadow-md flex items-center justify-center p-1 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-amber-500 font-extrabold text-2xl">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'T'}
                    </span>
                  )}
                </div>
              </div>

              {/* Company Title & Subtitle */}
              <div>
                <h4 className="text-lg font-extrabold text-gray-900 leading-snug">
                  {formData.name || 'TechNova Solutions'}
                </h4>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                  {formData.industry ? `${formData.industry} & Consulting` : 'IT Services & Consulting'}
                </p>
              </div>

              {/* Metadata Details List */}
              <div className="space-y-2 text-xs text-gray-600 font-medium border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>
                    {[formData.city, formData.country].filter(Boolean).join(', ') || 'Bangalore, India'}
                  </span>
                </div>

                {formData.companySize && (
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{formData.companySize}</span>
                  </div>
                )}

                {formData.industry && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{formData.industry}</span>
                  </div>
                )}

                {(formData.website || formData.socialWebsite) && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <a
                      href={formData.website || formData.socialWebsite}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-600 hover:text-[#f9571c] truncate"
                    >
                      {formData.website || formData.socialWebsite}
                    </a>
                  </div>
                )}
              </div>

              {/* Short Bio Description */}
              <p className="text-xs text-gray-500 leading-relaxed pt-1 border-t border-gray-100">
                {formData.shortDescription ||
                  'TechNova Solutions is a leading IT services and consulting company focused on building innovative software solutions for global clients.'}
              </p>

              {/* View Public Profile Button */}
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="w-full mt-2 bg-white hover:bg-orange-50 text-[#f9571c] font-bold py-2.5 px-4 rounded-xl border border-[#f9571c] text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Public Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Widget 2: Pro Tip Card */}
          <div className="bg-[#fffcf6] rounded-2xl p-5 border border-amber-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-[#f9571c]">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                <Lightbulb className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm">Pro Tip</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              A complete and up-to-date company profile attracts better candidates and builds trust.
            </p>
          </div>

          {/* Widget 3: Quick Actions Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs space-y-3">
            <h4 className="font-bold text-gray-900 text-sm mb-2">Quick Actions</h4>

            <div className="space-y-2">
              {/* View Company */}
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50/60 border border-gray-100 hover:border-orange-200 transition-colors text-xs font-bold text-gray-800 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#f9571c] flex items-center justify-center">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                  <span>View Company</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#f9571c] group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Manage Jobs */}
              <button
                type="button"
                onClick={() => navigate('/recruiter/jobs')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50/60 border border-gray-100 hover:border-orange-200 transition-colors text-xs font-bold text-gray-800 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#f9571c] flex items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <span>Manage Jobs</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#f9571c] group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Delete Company */}
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-red-50/60 border border-gray-100 hover:border-red-200 transition-colors text-xs font-bold text-gray-800 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-red-600">Delete Company</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* View Public Profile Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f9571c]" />
                <h3 className="text-lg font-black text-gray-900">Live Public Profile Preview</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden bg-gray-900 p-1 shadow-2xs">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-amber-500 font-extrabold text-2xl">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'T'}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xl font-extrabold text-gray-900">
                      {formData.name || 'TechNova Solutions'}
                    </h4>
                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {formData.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#f9571c]">
                    {formData.industry || 'Information Technology'} {formData.companyType ? `• ${formData.companyType}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap border-y border-gray-100 py-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {[formData.city, formData.state, formData.country].filter(Boolean).join(', ') || 'Bangalore, Karnataka, India'}
                  </span>
                </div>
                {formData.companySize && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>{formData.companySize}</span>
                  </div>
                )}
                {formData.foundedYear && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Founded {formData.foundedYear}</span>
                  </div>
                )}
                {(formData.website || formData.socialWebsite) && (
                  <a
                    href={formData.website || formData.socialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#f9571c] hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </a>
                )}
              </div>

              <div>
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">About Company</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {formData.shortDescription || 'Company short description preview.'}
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Description</h5>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {formData.fullDescription || 'Company full description preview.'}
                </p>
              </div>

              {(formData.linkedin || formData.twitter || formData.socialWebsite) && (
                <div className="pt-2 border-t border-gray-100 flex items-center gap-3 text-xs">
                  <span className="font-bold text-gray-700">Connect:</span>
                  {formData.linkedin && (
                    <a href={formData.linkedin} target="_blank" rel="noreferrer" className="text-sky-600 font-semibold hover:underline">
                      LinkedIn
                    </a>
                  )}
                  {formData.twitter && (
                    <a href={formData.twitter} target="_blank" rel="noreferrer" className="text-gray-800 font-semibold hover:underline">
                      Twitter/X
                    </a>
                  )}
                  {formData.socialWebsite && (
                    <a href={formData.socialWebsite} target="_blank" rel="noreferrer" className="text-[#f9571c] font-semibold hover:underline">
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-[#f9571c] text-white font-bold text-xs rounded-xl hover:bg-[#e04810] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Company Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-extrabold text-gray-900">Delete Company?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-gray-800">{formData.name || 'this company'}</span>? This action cannot be undone and will affect associated jobs.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Company</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyForm;
