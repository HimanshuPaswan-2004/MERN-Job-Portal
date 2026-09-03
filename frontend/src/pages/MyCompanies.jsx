import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const MyCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axios.get('/api/companies/my');
        setCompanies(data.data);
      } catch (error) {
        console.error('Error fetching companies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`/api/companies/${id}`);
        setCompanies(companies.filter(company => company._id !== id));
      } catch (error) {
        console.error('Error deleting company', error);
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading companies...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Companies</h1>
        <Link to="/recruiter/companies/new" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700">
          <Plus className="w-5 h-5 mr-2" />
          Add Company
        </Link>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <p className="text-gray-500 mb-4">You haven't added any companies yet.</p>
          <Link to="/recruiter/companies/new" className="text-blue-600 hover:underline">Create your first company</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map(company => (
            <div key={company._id} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain rounded border p-1" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-gray-400 font-bold text-xl">
                      {company.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Link to={`/recruiter/companies/${company._id}/edit`} className="text-gray-500 hover:text-blue-600 p-1">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(company._id)} className="text-gray-500 hover:text-red-600 p-1">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p><span className="font-medium">Industry:</span> {company.industry}</p>
                  <p><span className="font-medium">Location:</span> {company.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCompanies;
