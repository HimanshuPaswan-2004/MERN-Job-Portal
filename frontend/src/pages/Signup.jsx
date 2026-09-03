import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input type="password" name="confirmPassword" required minLength="6" value={formData.confirmPassword} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300" />
              <span className="ml-2 text-sm text-gray-700">Candidate</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="role" value="recruiter" checked={formData.role === 'recruiter'} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300" />
              <span className="ml-2 text-sm text-gray-700">Recruiter</span>
            </label>
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
      </div>
    </div>
  );
};

export default Signup;
