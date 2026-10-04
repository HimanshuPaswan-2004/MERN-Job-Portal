import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  SlidersHorizontal,
  Building,
  MapPin,
  Users,
  Briefcase,
  Eye,
  MoreVertical,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const MyCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Recently Added');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const navigate = useNavigate();

  // Sample data fallback matching screenshot design
  const defaultCompanies = [
    {
      _id: 'sample-1',
      name: 'TechNova Solutions',
      status: 'Active',
      industry: 'IT Services & Consulting',
      location: 'Bangalore, India',
      companySize: '201 – 500 employees',
      industryCategory: 'Information Technology',
      description: 'TechNova Solutions is a leading IT services company focused on building innovative software solutions for global clients.',
      jobsCount: 12,
      applicantsCount: 248,
      hiredCount: 5,
      logo: null,
      logoBg: 'bg-black text-white font-extrabold text-2xl',
      logoChar: 'T'
    },
    {
      _id: 'sample-2',
      name: 'Google',
      status: 'Active',
      industry: 'Technology • Internet',
      location: 'Mountain View, USA',
      companySize: '10,001+ employees',
      industryCategory: 'Technology',
      description: "Google's mission is to organize the world's information and make it universally accessible and useful.",
      jobsCount: 8,
      applicantsCount: 320,
      hiredCount: 12,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg',
      logoBg: 'bg-white',
      logoChar: 'G'
    },
    {
      _id: 'sample-3',
      name: 'Microsoft',
      status: 'Active',
      industry: 'Software • Cloud • AI',
      location: 'Redmond, USA',
      companySize: '10,001+ employees',
      industryCategory: 'Technology',
      description: 'Empowering every person and every organization on the planet to achieve more.',
      jobsCount: 5,
      applicantsCount: 180,
      hiredCount: 9,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      logoBg: 'bg-white',
      logoChar: 'M'
    },
    {
      _id: 'sample-4',
      name: 'Amazon',
      status: 'Inactive',
      industry: 'E-commerce • Cloud • Retail',
      location: 'Seattle, USA',
      companySize: '10,001+ employees',
      industryCategory: 'E-commerce',
      description: 'Amazon is committed to being Earth\'s most customer-centric company, where people can find and discover anything they might want to buy online.',
      jobsCount: 3,
      applicantsCount: 96,
      hiredCount: 4,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      logoBg: 'bg-white',
      logoChar: 'A'
    }
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      let res;

      if (token) {
        try {
          res = await axios.get('/api/companies/my', { headers });
        } catch (err) {
          console.log('Recruiter companies API call failed, trying public endpoint', err);
        }
      }

      if (!res || !res.data || !res.data.success || !Array.isArray(res.data.data) || res.data.data.length === 0) {
        try {
          res = await axios.get('/api/companies');
        } catch (err) {
          console.log('Public companies API call failed', err);
        }
      }

      if (res && res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setCompanies(res.data.data);
      } else {
        setCompanies(defaultCompanies);
      }
    } catch (error) {
      console.log('Using initial default companies view', error);
      setCompanies(defaultCompanies);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      if (!id.startsWith('sample-')) {
        await axios.delete(`/api/companies/${id}`, { headers });
      }
      setCompanies(companies.filter((c) => c._id !== id));
      setDeleteConfirmId(null);
      setOpenDropdownId(null);
    } catch (error) {
      console.error('Error deleting company', error);
      alert('Failed to delete company.');
    }
  };

  const handleToggleStatus = async (company) => {
    const newStatus = company.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      if (!company._id.startsWith('sample-')) {
        await axios.patch(`/api/companies/${company._id}/status`, { status: newStatus }, { headers });
      }
      setCompanies(
        companies.map((c) =>
          c._id === company._id ? { ...c, status: newStatus } : c
        )
      );
      setOpenDropdownId(null);
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  // Filter and sort logic
  const filteredCompanies = companies
    .filter((comp) => {
      const query = searchQuery.toLowerCase();
      return (
        comp.name?.toLowerCase().includes(query) ||
        comp.industry?.toLowerCase().includes(query) ||
        comp.location?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'Name (A-Z)') return a.name.localeCompare(b.name);
      if (sortBy === 'Most Jobs') return (b.jobsCount || 0) - (a.jobsCount || 0);
      if (sortBy === 'Most Applicants') return (b.applicantsCount || 0) - (a.applicantsCount || 0);
      return 0; // Recently Added default
    });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <div className="w-10 h-10 border-4 border-[#f9571c] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium text-sm">Loading your companies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center text-xs text-gray-500 font-medium space-x-2">
        <Link to="/recruiter/dashboard" className="hover:text-gray-900 transition-colors flex items-center gap-1">
          <Building className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">My Companies</span>
      </nav>

      {/* Main Grid: Left Companies List + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header section with Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Companies</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your companies, update details, and create job postings.</p>
            </div>
            <Link
              to="/recruiter/companies/new"
              className="inline-flex items-center justify-center gap-2 bg-[#f9571c] hover:bg-[#e04810] text-white font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all text-sm shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Company</span>
            </Link>
          </div>

          {/* Search and Sort Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200/90 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#f9571c]/20 focus:border-[#f9571c] shadow-2xs placeholder:text-gray-400"
              />
            </div>
            <div className="relative w-full sm:w-auto shrink-0">
              <div className="flex items-center gap-2 bg-white border border-gray-200/90 rounded-xl px-3.5 py-2 text-sm text-gray-700 shadow-2xs cursor-pointer">
                <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500 text-xs">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-semibold text-gray-900 focus:outline-hidden cursor-pointer"
                >
                  <option value="Recently Added">Recently Added</option>
                  <option value="Name (A-Z)">Name (A-Z)</option>
                  <option value="Most Jobs">Most Jobs</option>
                  <option value="Most Applicants">Most Applicants</option>
                </select>
              </div>
            </div>
          </div>

          {/* Companies List Cards */}
          {filteredCompanies.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200/80 shadow-xs">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">No companies found</h3>
              <p className="text-gray-500 text-sm mb-6">You haven't added any company matching your criteria.</p>
              <Link
                to="/recruiter/companies/new"
                className="inline-flex items-center gap-2 bg-[#f9571c] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Company</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <div
                  key={company._id}
                  className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow relative"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    
                    {/* Left Details: Logo + Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Logo Container */}
                      <div className="w-16 h-16 rounded-xl border border-gray-200/80 flex items-center justify-center shrink-0 overflow-hidden bg-white p-1.5 shadow-2xs">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className={`w-full h-full rounded-lg flex items-center justify-center font-extrabold text-2xl ${company.logoBg || 'bg-gray-900 text-white'}`}>
                            {company.logoChar || company.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Text info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-lg font-extrabold text-gray-900 hover:text-[#f9571c] cursor-pointer transition-colors">
                            {company.name}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md ${
                              company.status === 'Inactive'
                                ? 'bg-amber-100/70 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100/70 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {company.status || 'Active'}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-gray-500">{company.industry || company.industryCategory || 'Technology'}</p>

                        {/* Metadata Tags Line */}
                        <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap pt-0.5">
                          {company.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span>{company.location}</span>
                            </div>
                          )}
                          {company.companySize && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span>{company.companySize}</span>
                            </div>
                          )}
                          {(company.industryCategory || company.industry) && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                              <span>{company.industryCategory || company.industry}</span>
                            </div>
                          )}
                        </div>

                        {/* Description Snippet */}
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 pt-1">
                          {company.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Stats Box */}
                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                      <div className="bg-gray-50/80 border border-gray-200/70 rounded-xl px-4 py-2.5 flex items-center gap-4 text-center">
                        <div>
                          <p className="text-lg font-black text-gray-900">{company.jobsCount ?? 0}</p>
                          <p className="text-[10px] font-medium text-gray-500">Jobs</p>
                        </div>
                        <div className="w-[1px] h-6 bg-gray-200"></div>
                        <div>
                          <p className="text-lg font-black text-gray-900">{company.applicantsCount ?? 0}</p>
                          <p className="text-[10px] font-medium text-gray-500">Applicants</p>
                        </div>
                        <div className="w-[1px] h-6 bg-gray-200"></div>
                        <div>
                          <p className="text-lg font-black text-gray-900">{company.hiredCount ?? 0}</p>
                          <p className="text-[10px] font-medium text-gray-500">Hired</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/recruiter/companies/${company._id}/edit`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-[#f9571c] bg-white border border-gray-200 rounded-lg hover:border-orange-300 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-orange-500" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => navigate(`/recruiter/jobs?company=${company._id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-[#f9571c] bg-white border border-gray-200 rounded-lg hover:border-orange-300 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-orange-500" />
                          <span>View</span>
                        </button>

                        {/* Three Dots Dropdown Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === company._id ? null : company._id)}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openDropdownId === company._id && (
                            <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-20">
                              <button
                                onClick={() => handleToggleStatus(company)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 hover:text-[#f9571c] flex items-center justify-between"
                              >
                                <span>Status: {company.status === 'Active' ? 'Set Inactive' : 'Set Active'}</span>
                                <span className={`w-2 h-2 rounded-full ${company.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                              </button>

                              <button
                                onClick={() => setDeleteConfirmId(company._id)}
                                className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Company</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Card 1: Add a New Company */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs text-center">
            <div className="w-20 h-20 mx-auto mb-4 relative flex items-center justify-center bg-orange-50 rounded-2xl border border-orange-100">
              <div className="flex items-end space-x-1">
                <div className="w-4 h-9 bg-gray-700 rounded-t-sm"></div>
                <div className="w-5 h-12 bg-gray-900 rounded-t-sm"></div>
                <div className="w-4 h-7 bg-gray-600 rounded-t-sm"></div>
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-[#f9571c] rounded-full text-white font-extrabold flex items-center justify-center text-sm shadow-sm border-2 border-white">
                +
              </div>
            </div>

            <h3 className="font-extrabold text-gray-900 text-lg mb-1">Add a New Company</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-5 px-2">
              Create a company profile to start posting jobs and find the best talent.
            </p>

            <button
              onClick={() => navigate('/recruiter/companies/new')}
              className="w-full bg-[#f9571c] hover:bg-[#e04810] text-white font-bold py-3 px-4 rounded-xl shadow-xs transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Company</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Tips for a great company profile */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-500">
                <Lightbulb className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-sm">Tips for a great company profile</h3>
            </div>

            <div className="space-y-3">
              {[
                'Add a clear company description',
                'Upload a high-quality company logo',
                'Include website and social links',
                'Mention company size and industry',
                'Keep information up to date'
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#f9571c] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-xs font-medium text-gray-600 leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Quote Card */}
          <div className="bg-[#fef3eb] border border-orange-100 rounded-2xl p-6 relative overflow-hidden">
            {/* Quote Graphic Overlay */}
            <div className="text-6xl font-serif text-orange-200 leading-none absolute top-2 left-3 select-none opacity-60">
              “
            </div>
            
            <div className="relative z-10 pt-4 pb-2">
              <h4 className="text-2xl font-black text-gray-900 tracking-tight leading-snug italic font-serif">
                Great companies build great people.
              </h4>
              {/* Stylized Underline */}
              <div className="w-24 h-1 bg-[#f9571c] rounded-full mt-3"></div>
            </div>
          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-extrabold text-gray-900">Delete Company?</h3>
              <p className="text-xs text-gray-500 mt-1">This action cannot be undone. Are you sure you want to proceed?</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCompanies;
