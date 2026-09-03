import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const JobForm = () => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    jobType: 'full-time',
    experienceLevel: 'fresher',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    responsibilities: '',
    requirements: '',
    vacancies: 1,
    remote: false,
    status: 'active',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get('/api/companies/my');
        setCompanies(data.data);
        if (!isEditMode && data.data.length > 0) {
          setFormData(prev => ({ ...prev, company: data.data[0]._id }));
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
            jobType: job.jobType || 'full-time',
            experienceLevel: job.experienceLevel || 'fresher',
            salaryMin: job.salary?.min || '',
            salaryMax: job.salary?.max || '',
            skills: job.skills ? job.skills.join(', ') : '',
            responsibilities: job.responsibilities ? job.responsibilities.join('\n') : '',
            requirements: job.requirements ? job.requirements.join('\n') : '',
            vacancies: job.vacancies || 1,
            remote: job.remote || false,
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.company) {
      setError('Please select a company. If you do not have one, create a company first.');
      setLoading(false);
      return;
    }

    const submitData = {
      ...formData,
      salary: {
        min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
      },
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      responsibilities: formData.responsibilities.split('\n').map(s => s.trim()).filter(s => s),
      requirements: formData.requirements.split('\n').map(s => s.trim()).filter(s => s),
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

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border">
      <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Job' : 'Post New Job'}</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company *</label>
            <select name="company" required value={formData.company} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select a company...</option>
              {companies.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job Description *</label>
          <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location *</label>
            <input type="text" name="location" required value={formData.location} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="remote" checked={formData.remote} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
              <span className="text-sm font-medium text-gray-700">This is a remote position</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Type *</label>
            <select name="jobType" required value={formData.jobType} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote (Type)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience Level *</label>
            <select name="experienceLevel" required value={formData.experienceLevel} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
              <option value="fresher">Fresher</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2-4 years">2-4 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Salary</label>
            <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Salary</label>
            <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Skills Required * (comma separated)</label>
          <input type="text" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Responsibilities (one per line)</label>
          <textarea name="responsibilities" rows="3" value={formData.responsibilities} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements (one per line)</label>
          <textarea name="requirements" rows="3" value={formData.requirements} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vacancies</label>
            <input type="number" name="vacancies" min="1" value={formData.vacancies} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3 border-t">
          <button type="button" onClick={() => navigate('/recruiter/jobs')} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : (isEditMode ? 'Update Job' : 'Post Job')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
