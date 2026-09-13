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
  Check,
  Loader2,
  X,
  Briefcase,
  Users,
  Building2,
  Sparkles
} from 'lucide-react';

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    companyType: '',
    country: 'India',
    city: '',
    state: '',
    address: '',
    shortDescription: '',
    fullDescription: '',
    status: 'Active',
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchCompany = async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const { data } = await axios.get(`/api/companies/${id}`, { headers });
          if (data && data.data) {
            const comp = data.data;
            setFormData({
              name: comp.name || '',
              website: comp.website || '',
              industry: comp.industry || '',
              companySize: comp.companySize || '',
              foundedYear: comp.foundedYear || '',
              companyType: comp.companyType || '',
              country: comp.country || 'India',
              city: comp.city || '',
              state: comp.state || '',
              address: comp.address || '',
              shortDescription: comp.shortDescription || comp.description || '',
              fullDescription: comp.fullDescription || comp.description || '',
              status: comp.status || 'Active',
            });
            if (comp.logo) {
              setLogoPreview(comp.logo);
            }
          }
        } catch (err) {
          setError('Error fetching company details');
        }
      };
      fetchCompany();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'shortDescription' && value.length > 200) return;
    setFormData({ ...formData, [name]: value });
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
    setFormData({ ...formData, fullDescription: newText });
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
    if (!formData.companySize) {
      setError('Please select a Company Size.');
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs text-gray-500 font-medium space-x-2">
        <Link to="/recruiter/companies" className="hover:text-[#f9571c] transition-colors flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" />
          <span>My Companies</span>
        </Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">{isEditMode ? 'Edit Company' : 'Create Company'}</span>
      </nav>

      {/* Main Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          {isEditMode ? 'Edit Company Details' : 'Create a New Company'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Add your company details to start posting jobs and attract top talent.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2 Column Layout: Left Form (8 cols), Right Sidebar Widgets (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column Form */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Card 1: Basic Information */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
              <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f9571c] flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">Basic Information</h2>
                  <p className="text-xs text-gray-500">Provide the basic details about your company.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Logo Dropzone (Left col inside Basic Info) */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2">Company Logo</label>
                  <div className="relative border-2 border-dashed border-gray-200 hover:border-[#f9571c]/50 rounded-2xl p-4 text-center bg-gray-50/60 hover:bg-orange-50/20 transition-all flex flex-col items-center justify-center min-h-[160px] cursor-pointer group">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {logoPreview ? (
                      <div className="relative w-full flex flex-col items-center">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-20 h-20 object-contain rounded-xl border border-gray-200 bg-white p-1 mb-2 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLogo();
                          }}
                          className="text-[11px] font-bold text-red-600 hover:underline z-20 flex items-center gap-1 mt-1"
                        >
                          <X className="w-3 h-3" /> Remove Logo
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-gray-400 group-hover:text-[#f9571c] group-hover:border-orange-200 mb-2 transition-colors">
                          <Upload className="w-5 h-5 stroke-[2]" />
                        </div>
                        <p className="text-xs font-bold text-gray-800">Click to upload logo</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG (Max 2MB)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Form Fields (Right cols inside Basic Info) */}
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
                        placeholder="Enter company name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Website</label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          name="website"
                          placeholder="https://www.yourcompany.com"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400"
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
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-700"
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
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-700"
                      >
                        <option value="">Select company size</option>
                        <option value="1 - 10 employees">1 - 10 employees</option>
                        <option value="11 - 50 employees">11 - 50 employees</option>
                        <option value="51 - 200 employees">51 - 200 employees</option>
                        <option value="201 - 500 employees">201 - 500 employees</option>
                        <option value="501 - 1,000 employees">501 - 1,000 employees</option>
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
                          placeholder="e.g. 2020"
                          value={formData.foundedYear}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Company Type</label>
                      <select
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-700"
                      >
                        <option value="">Select company type</option>
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
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
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-xs space-y-5">
              <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f9571c] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">Location</h2>
                  <p className="text-xs text-gray-500">Add your company's location details.</p>
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
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all text-gray-700"
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
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400"
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
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: About Company */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-xs space-y-5">
              <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f9571c] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-tight">About Company</h2>
                  <p className="text-xs text-gray-500">Tell candidates more about your company.</p>
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
                    placeholder="A short description about your company..."
                    value={formData.shortDescription}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all placeholder:text-gray-400"
                  ></textarea>
                  <span className="absolute bottom-2.5 right-3 text-[11px] font-semibold text-gray-400">
                    {formData.shortDescription.length}/200
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Full Description <span className="text-[#f9571c]">*</span>
                </label>
                
                {/* Rich Formatting Toolbar */}
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f9571c]/20 focus-within:border-[#f9571c] transition-all">
                  <div className="bg-gray-50/80 border-b border-gray-200 px-3 py-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleFormatText('bold')}
                      title="Bold"
                      className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 rounded-md transition-colors"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('italic')}
                      title="Italic"
                      className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 rounded-md transition-colors"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('underline')}
                      title="Underline"
                      className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 rounded-md transition-colors"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => handleFormatText('bullet')}
                      title="Bullet List"
                      className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 rounded-md transition-colors"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormatText('number')}
                      title="Numbered List"
                      className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 rounded-md transition-colors"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => handleFormatText('link')}
                      title="Insert Link"
                      className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 rounded-md transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    id="fullDescriptionTextarea"
                    name="fullDescription"
                    rows="6"
                    required
                    placeholder="Write a detailed description about your company, mission, culture, products, etc..."
                    value={formData.fullDescription}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-white border-0 text-sm focus:outline-hidden placeholder:text-gray-400"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-start gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/recruiter/companies')}
                className="px-6 py-2.5 bg-white border border-[#f9571c] text-[#f9571c] font-bold text-sm rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-2.5 bg-[#f9571c] hover:bg-[#e04810] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{isEditMode ? 'Update Company' : 'Create Company'}</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar Widgets (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Widget 1: Graphic Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center relative overflow-hidden">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-50 rounded-2xl border border-orange-100">
              <div className="relative">
                <div className="flex items-end gap-1">
                  <div className="w-5 h-12 bg-gray-800 rounded-t-xs"></div>
                  <div className="w-7 h-16 bg-[#f9571c] rounded-t-xs flex items-center justify-center text-white">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="w-5 h-10 bg-gray-700 rounded-t-xs"></div>
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-amber-400 rounded-full border-2 border-white shadow-xs"></div>
              </div>
            </div>

            <h3 className="font-extrabold text-gray-900 text-lg mb-1.5">Create Your Company</h3>
            <p className="text-xs text-gray-500 leading-relaxed px-1">
              A detailed company profile helps you attract the right talent and build a strong employer brand.
            </p>
          </div>

          {/* Widget 2: Tips for a Great Company Profile */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-amber-50 rounded-lg text-amber-500">
                <Lightbulb className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-sm text-[#f9571c]">Tips for a Great Company Profile</h3>
            </div>

            <div className="space-y-3">
              {[
                'Use a clear and professional company name.',
                'Upload a high-quality company logo.',
                'Write a compelling company description.',
                'Add your website and social links.',
                'Mention company size and industry.',
                'Keep the information up to date.'
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#f9571c] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs font-medium text-gray-600 leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 3: Live Preview on Job Portal */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 text-[#f9571c] rounded-xl">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Preview on Job Portal</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Your company profile will be visible to job seekers on the platform.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="w-full bg-white hover:bg-orange-50 text-[#f9571c] font-bold py-2.5 px-4 rounded-xl border border-[#f9571c] text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Widget 4: Stylized Quote Card */}
          <div className="bg-[#fef3eb] border border-orange-100 rounded-2xl p-6 relative overflow-hidden">
            <div className="text-5xl font-serif text-orange-200 leading-none absolute top-1 left-2 select-none opacity-60">
              “
            </div>
            
            <div className="relative z-10 pt-3 pb-1">
              <h4 className="text-2xl font-black text-gray-900 tracking-tight leading-snug italic font-serif">
                Great teams build great companies.
              </h4>
              <div className="w-20 h-1 bg-[#f9571c] rounded-full mt-3"></div>
            </div>
          </div>

        </div>

      </div>

      {/* Live Company Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#f9571c]" />
                <h3 className="text-lg font-black text-gray-900">Job Portal Company Card Preview</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live Company Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden bg-gray-50 p-1 shadow-2xs">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-gray-900 text-white font-extrabold text-2xl flex items-center justify-center rounded-lg">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xl font-extrabold text-gray-900">
                      {formData.name || 'Your Company Name'}
                    </h4>
                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">
                      {formData.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#f9571c]">
                    {formData.industry || 'Selected Industry'} {formData.companyType ? `• ${formData.companyType}` : ''}
                  </p>
                </div>
              </div>

              {/* Badges line */}
              <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap border-y border-gray-100 py-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {[formData.city, formData.state, formData.country].filter(Boolean).join(', ') || 'Location details'}
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
                {formData.website && (
                  <a
                    href={formData.website}
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
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">About Us</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {formData.shortDescription || formData.fullDescription || 'Company description will appear here...'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-gray-800 transition-colors"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyForm;
