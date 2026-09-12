import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Building, Upload, ArrowLeft, Check, Loader2 } from 'lucide-react';

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    companySize: '',
    location: '',
    status: 'Active',
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
            setFormData({
              name: data.data.name || '',
              description: data.data.description || '',
              website: data.data.website || '',
              industry: data.data.industry || '',
              companySize: data.data.companySize || '',
              location: data.data.location || '',
              status: data.data.status || 'Active',
            });
          }
        } catch (err) {
          setError('Error fetching company details');
        }
      };
      fetchCompany();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs text-gray-500 font-medium space-x-2">
        <Link to="/recruiter/companies" className="hover:text-gray-900 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Companies</span>
        </Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">{isEditMode ? 'Edit Company' : 'Create Company'}</span>
      </nav>

      {/* Main Form Card */}
      <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-200/80">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-orange-50 text-[#f9571c] rounded-xl flex items-center justify-center font-bold">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {isEditMode ? 'Edit Company Details' : 'Create New Company Profile'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Fill in the company details to post jobs and showcase your brand to top talent.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Company Name <span className="text-[#f9571c]">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. TechNova Solutions"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Company Overview & Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Tell candidates about your company mission, values, and workplace culture..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Website URL
              </label>
              <input
                type="url"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Headquarters / Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Bangalore, India"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Industry & Category
              </label>
              <input
                type="text"
                name="industry"
                placeholder="e.g. IT Services & Consulting"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Company Size
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all"
              >
                <option value="">Select size range...</option>
                <option value="1 - 10 employees">1 - 10 employees</option>
                <option value="11 - 50 employees">11 - 50 employees</option>
                <option value="51 - 200 employees">51 - 200 employees</option>
                <option value="201 - 500 employees">201 - 500 employees</option>
                <option value="501 - 1,000 employees">501 - 1,000 employees</option>
                <option value="10,001+ employees">10,001+ employees</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Company Logo
              </label>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center bg-gray-50 hover:bg-white transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-700">
                  {logo ? logo.name : 'Click to select logo file'}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG or SVG up to 5MB</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] transition-all"
              >
                <option value="Active">Active (Visible for posting jobs)</option>
                <option value="Inactive">Inactive (Hidden/Paused)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/recruiter/companies')}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#f9571c] hover:bg-[#e04810] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isEditMode ? 'Update Company' : 'Save Company'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
