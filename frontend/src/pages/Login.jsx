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
      <div className="hidden lg:flex w-1/2 bg-brand-50 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-orange-100/40 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-orange-200/30 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2 mb-12">
            <Briefcase className="h-8 w-8 text-brand-600" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">JobPortal</span>
          </Link>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-600 mb-6 shadow-sm">
            Welcome Back 👋
          </div>
          
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-8">
            Continue <br /> Your <br />
            <span className="text-brand-600">Career Journey</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-md">
            Login to your account and explore thousands of job opportunities.
          </p>

          <div className="space-y-6 max-w-md">
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

        <div className="relative z-10 mt-12 flex justify-between items-end">
          <div className="relative">
             <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
              alt="Professional" 
              className="rounded-t-full w-64 h-80 object-cover shadow-2xl relative z-10 border-4 border-white"
            />
            <div className="absolute top-10 -left-12 rotate-[-10deg] bg-white p-3 rounded-lg shadow-lg z-20">
              <p className="text-gray-900 font-bold text-sm">Good Jobs</p>
              <p className="text-brand-600 font-bold text-sm">Brighter Futures</p>
            </div>
          </div>
          
          <div className="pb-8">
            <p className="italic text-gray-700 text-lg font-medium mb-4 max-w-xs">
              "A better career is just a login away."
            </p>
            {/* Small stats box */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white">
              <div className="flex -space-x-2 mb-2">
                {[1,2,3].map(i => (
                  <img key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white" src={`https://i.pravatar.cc/100?img=${i+10}`} alt=""/>
                ))}
                <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-brand-500 text-white text-[10px] font-bold">50K+</div>
              </div>
              <p className="text-xs text-gray-600 leading-tight">Join thousands of job seekers<br/>who trust JobPortal</p>
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

        <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Login to JobPortal</h2>
          <p className="text-gray-500 text-sm mb-6">Welcome back! Please enter your details to access your account.</p>
          
          {error && <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="block w-full pl-12 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm"
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
                  className="block w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 text-sm"
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
              className="w-full bg-brand-600 text-white rounded-lg py-2.5 font-medium hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors flex justify-center items-center mt-4"
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          {/* Social Sign up */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button type="button" className="flex-1 inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </button>
              <button type="button" className="flex-1 inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </button>
              <button type="button" className="flex-1 inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </button>
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-500 lg:hidden">
              Don't have an account? <Link to="/signup" className="font-medium text-brand-600 hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
