import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, Lock, User, Eye, EyeOff, Zap, Bell, TrendingUp } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate', // Default to Job Seeker
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!formData.agreeTerms) {
      return setError('You must agree to the Terms of Service and Privacy Policy');
    }

    try {
      setLoading(true);
      // Combine first and last name for the backend
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      
      await register({
        name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      navigate(formData.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Promotional Side */}
      <div className="hidden lg:flex w-1/2 bg-brand-50 relative flex-col justify-between py-8 px-12 overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-orange-100/40 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-orange-200/30 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2 mb-6">
            <Briefcase className="h-8 w-8 text-brand-600" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">JobPortal</span>
          </Link>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 mb-4 shadow-sm">
            Join Our Community 🚀
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Create Your <br />
            <span className="text-brand-600">Account</span>
          </h1>
          
          <p className="text-base text-gray-600 mb-6 max-w-md">
            Take the first step towards a brighter career. Sign up now and explore thousands of opportunities.
          </p>

          <div className="space-y-4 max-w-md">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg text-brand-600 shrink-0">
                <Zap size={20} />
              </div>
              <p className="text-gray-700 pt-1">Quick and easy registration</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg text-brand-600 shrink-0">
                <Briefcase size={20} />
              </div>
              <p className="text-gray-700 pt-1">Apply to top companies</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg text-brand-600 shrink-0">
                <Bell size={20} />
              </div>
              <p className="text-gray-700 pt-1">Get personalized job alerts</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg text-brand-600 shrink-0">
                <TrendingUp size={20} />
              </div>
              <p className="text-gray-700 pt-1">Track your career growth</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <p className="italic text-gray-700 text-base font-medium mb-4 max-w-sm">
            "Create today, a brighter tomorrow."
          </p>
          
          <div className="relative inline-block">
             <img 
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Professional" 
              className="rounded-t-full w-48 h-48 lg:h-56 object-cover shadow-2xl relative z-10 border-4 border-white"
            />
            {/* Hand-drawn text element mockup */}
            <div className="absolute top-6 -right-20 rotate-12 bg-white p-2 rounded-lg shadow-lg z-20">
              <p className="text-brand-600 font-bold text-xs">Build Your</p>
              <p className="text-gray-900 font-bold text-xs">Dream Career</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:px-24 lg:pt-6 lg:pb-12 relative overflow-y-auto">
        <div className="flex justify-between items-center w-full mb-6">
          <Link to="/" className="lg:hidden flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-brand-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">JobPortal</span>
          </Link>
          <div className="hidden lg:block"></div>
          <div className="text-sm font-medium">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-brand-600 hover:underline">Login</Link>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your JobPortal Account</h2>
          <p className="text-gray-500 mb-8">Join thousands of job seekers and start your career journey today.</p>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={formData.role === 'candidate'}
                    onChange={handleChange}
                    className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Job Seeker</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={formData.role === 'recruiter'}
                    onChange={handleChange}
                    className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Recruiter / Employer</span>
                </label>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeTerms"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500"
              />
              <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-brand-600 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white rounded-lg py-3 font-medium hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors flex justify-center items-center mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 lg:hidden">
            Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
