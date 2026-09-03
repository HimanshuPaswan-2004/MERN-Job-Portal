import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('/api/jobs/my');
        setJobs(data.data);
      } catch (error) {
        console.error('Error fetching jobs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`/api/jobs/${id}`);
        setJobs(jobs.filter(job => job._id !== id));
      } catch (error) {
        console.error('Error deleting job', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/jobs/${id}/status`, { status: newStatus });
      setJobs(jobs.map(job => job._id === id ? { ...job, status: newStatus } : job));
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading jobs...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <Link to="/recruiter/jobs/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
          <Link to="/recruiter/jobs/new" className="text-blue-600 hover:underline">Post your first job</Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map(job => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {job.company?.logo && <img className="h-8 w-8 rounded mr-2" src={job.company.logo} alt="" />}
                      <div className="text-sm text-gray-900">{job.company?.name || 'Unknown'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      className={`text-sm rounded-full px-2 py-1 font-semibold ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' :
                        job.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        job.status === 'closed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="closed">Closed</option>
                      <option value="expired">Expired</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/recruiter/jobs/${job._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
