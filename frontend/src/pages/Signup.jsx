import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  UserCheck,
  Building2,
  ShieldCheck,
  Zap,
  Check,
  TrendingUp
} from 'lucide-react';

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleQuickFill = (role) => {
    if (role === 'candidate') {
      setFormData({
        firstName: 'Alex',
        lastName: 'Morgan',
        email: `alex.${Math.floor(Math.random() * 1000)}@example.com`,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'candidate',
        agreeTerms: true
      });
    } else {
      setFormData({
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: `sarah.${Math.floor(Math.random() * 1000)}@techcorp.com`,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'recruiter',
        agreeTerms: true
      });
    }
    setError('');
  };

  // Simple password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (score <= 4) return { score: 66, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(formData.password);

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
      const name = `${formData.firstName} ${formData.lastName}`.trim();

      await register({
        name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      navigate(formData.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      {/* Left Promotional Hero Side */}
      <div className="hidden lg:flex w-[48%] bg-gradient-to-br from-amber-500 via-brand-600 to-brand-700 relative flex-col justify-between p-12 overflow-hidden select-none">
        {/* Glow Blobs */}
        <div className="absolute top-[-15%] left-[-15%] w-[130%] h-[130%] bg-radial from-orange-400/30 to-transparent blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[90%] h-[90%] bg-amber-400/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        {/* Header Logo & Main Copy */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:scale-105 transition-transform duration-300">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Job<span className="text-amber-200">Portal</span>
            </span>
          </Link>

          <div className="mt-10 space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Join 50,000+ Career Pioneers 🚀</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
              Create Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-100 to-white">
                Free Account
              </span>
            </h1>

            <p className="text-orange-50/90 text-base leading-relaxed max-w-md font-normal">
              Take the first step towards a brighter career. Connect with hiring managers or find top-tier talent in minutes.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-3.5 pt-2">
              {[
                { icon: Zap, text: "Quick & easy 1-minute account setup" },
                { icon: UserCheck, text: "Personalized recommendations for candidates & recruiters" },
                { icon: ShieldCheck, text: "Verified employer profiles & anti-spam job protection" },
                { icon: TrendingUp, text: "Track applications and career milestones seamlessly" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-white/90">
                  <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/15 text-amber-200">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Social Proof Glass Card */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/15">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border-2 border-brand-600 object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="text-white text-xs font-bold">2,500+ New Members</p>
                <p className="text-orange-100/80 text-[11px]">Joined our portal this week</p>
              </div>
            </div>

            <div className="px-3 py-1 bg-amber-400/20 rounded-full border border-amber-300/30 text-amber-200 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              <span>100% Free Signup</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Registration Form Container */}
      <div className="w-full lg:w-[52%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative bg-white overflow-y-auto">
        {/* Top Navigation Row */}
        <div className="flex justify-between items-center w-full mb-6">
          <Link to="/" className="lg:hidden flex items-center space-x-2">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">JobPortal</span>
          </Link>
          <div className="hidden lg:block"></div>
          <div className="text-sm font-medium">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 hover:underline transition-colors">
              Log In
            </Link>
          </div>
        </div>

        {/* Form Body */}
        <div className="max-w-lg w-full mx-auto my-auto py-2">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
              Create Your Account ✨
            </h2>
            <p className="text-slate-500 text-sm">
              Join thousands of job seekers and hiring recruiters today.
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              ⚡ Quick Demo Auto-Fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('candidate')}
                className="px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" /> Demo Jobseeker
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('recruiter')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-600" /> Demo Recruiter
              </button>
            </div>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Registration Notice</p>
                <p className="text-xs text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Role Selection Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => handleRoleSelect('candidate')}
                  className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between relative ${
                    formData.role === 'candidate'
                      ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-2 rounded-lg ${formData.role === 'candidate' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <UserCheck className="w-4 h-4" />
                    </div>
                    {formData.role === 'candidate' && (
                      <span className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${formData.role === 'candidate' ? 'text-brand-900' : 'text-slate-800'}`}>
                      Job Seeker
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Apply for jobs & grow career
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => handleRoleSelect('recruiter')}
                  className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between relative ${
                    formData.role === 'recruiter'
                      ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`p-2 rounded-lg ${formData.role === 'recruiter' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    {formData.role === 'recruiter' && (
                      <span className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${formData.role === 'recruiter' ? 'text-brand-900' : 'text-slate-800'}`}>
                      Employer
                    </p>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Post jobs & hire candidates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Name Input Fields (First & Last) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    className={`block w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                      formData.confirmPassword && formData.confirmPassword !== formData.password
                        ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                        : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                    }`}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Progress Indicator */}
            {formData.password && (
              <div className="space-y-1 pt-0.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Password strength:</span>
                  <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strength.color} transition-all duration-300`} 
                    style={{ width: `${strength.score}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Password Mismatch Warning */}
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-rose-500 font-medium pt-0.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
              </p>
            )}

            {/* Terms & Conditions Checkbox */}
            <div className="pt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 rounded text-brand-600 border-slate-300 focus:ring-brand-500 focus:ring-offset-0 cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-brand-600 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-semibold text-brand-600 hover:underline">
                    Privacy Policy
                  </a>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white rounded-xl py-3.5 px-4 text-sm font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:scale-[0.99] transition-all duration-200 flex justify-center items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 4.3 1.9 6.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-slate-400 pt-4">
          &copy; {new Date().getFullYear()} JobPortal Inc. All rights reserved. &bull; <a href="#" className="hover:underline">Privacy Policy</a> &bull; <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;

