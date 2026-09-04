import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Mail, Lock, Eye, EyeOff, Bookmark, Bell } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
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
    
    try {
      setLoading(true);
      const user = await login(formData.email, formData.password);
      // Redirect based on role
      if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
            Welcome Back 👋
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Continue <br /> Your <br />
            <span className="text-brand-600">Career Journey</span>
          </h1>
          
          <p className="text-base text-gray-600 mb-6 max-w-md">
            Login to your account and explore thousands of job opportunities.
          </p>

          <div className="space-y-4 max-w-md">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg text-brand-600 shrink-0">
                <Briefcase size={20} />
              </div>
              <p className="text-gray-700 pt-1">Access personalized job recommendations</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg text-brand-600 shrink-0">
                <Bookmark size={20} />
              </div>
              <p className="text-gray-700 pt-1">Save jobs and track applications</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg text-brand-600 shrink-0">
                <Bell size={20} />
              </div>
              <p className="text-gray-700 pt-1">Get notified about new opportunities</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6 flex justify-between items-end">
          <div className="relative">
             <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Professional" 
              className="rounded-t-full w-48 h-48 lg:h-56 object-cover shadow-2xl relative z-10 border-4 border-white"
            />
            <div className="absolute top-6 -left-8 rotate-[-10deg] bg-white p-2 rounded-lg shadow-lg z-20">
              <p className="text-gray-900 font-bold text-xs">Good Jobs</p>
              <p className="text-brand-600 font-bold text-xs">Brighter Futures</p>
            </div>
          </div>
          
          <div className="pb-4">
            <p className="italic text-gray-700 text-base font-medium mb-3 max-w-xs">
              "A better career is just a login away."
            </p>
            {/* Small stats box */}
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white">
              <div className="flex -space-x-2 mb-2">
                {[1,2,3].map(i => (
                  <img key={i} className="inline-block h-5 w-5 rounded-full ring-2 ring-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt=""/>
                ))}
                <div className="flex items-center justify-center h-5 w-5 rounded-full ring-2 ring-white bg-brand-500 text-white text-[9px] font-bold">50K+</div>
              </div>
              <p className="text-[10px] text-gray-600 leading-tight">Join thousands of job seekers<br/>who trust JobPortal</p>
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
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/signup" className="text-brand-600 hover:underline">Sign Up</Link>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Login to JobPortal</h2>
          <p className="text-gray-500 mb-8">Welcome back! Please enter your details to access your account.</p>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  className="block w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-brand-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white rounded-lg py-3 font-medium hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors flex justify-center items-center mt-6"
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500 lg:hidden">
            Don't have an account? <Link to="/signup" className="font-medium text-brand-600 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
