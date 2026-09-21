import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, FileText, Bell, TrendingUp, Code, Database, 
  Palette, LayoutDashboard, Megaphone, Users, ArrowRight, CheckCircle2, 
  Sparkles, Building2, Zap, Star, ShieldCheck, DollarSign, Clock, Layers
} from 'lucide-react';

// --- Hero Section ---
const HeroSection = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() || location.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
    } else {
      navigate('/jobs');
    }
  };

  const [stats, setStats] = useState({ jobs: '50K+', companies: '10K+', hires: '1M+' });

  useEffect(() => {
    fetch('http://localhost:8000/api/jobs/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setStats({
            jobs: data.data.totalJobs > 0 ? `${data.data.totalJobs}+` : '50K+',
            companies: data.data.totalCompanies > 0 ? `${data.data.totalCompanies}+` : '10K+',
            hires: '1M+'
          });
        }
      })
      .catch((err) => console.log('Stats fetch note:', err));
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-orange-50/60 via-white to-orange-50/30 pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
      
      {/* Background Decorative Glowing Elements */}
      <div className="absolute top-12 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="w-full lg:w-[58%] flex flex-col justify-center">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/80 border border-orange-200/60 text-orange-700 text-xs sm:text-sm font-bold w-fit mb-6 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-ping"></span>
              <Sparkles size={16} className="text-brand-600" />
              #1 AI-Powered Career Network
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.12] mb-6 tracking-tight">
              Discover Your <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Dream Career
              </span> Opportunity
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl leading-relaxed font-normal">
              Explore thousands of verified jobs, connect directly with hiring managers at world-class companies, and fast-track your career growth.
            </p>
            
            {/* Enhanced Search Form */}
            <form 
              onSubmit={handleSearch} 
              className="bg-white p-3 sm:p-3.5 rounded-3xl sm:rounded-full shadow-xl shadow-orange-950/5 flex flex-col sm:flex-row items-center mb-6 w-full max-w-2xl border border-gray-100/90 gap-2 sm:gap-0"
            >
              <div className="flex-1 flex items-center pl-4 w-full border-b sm:border-b-0 sm:border-r border-gray-100 py-2 sm:py-0">
                <Search className="h-5 w-5 text-brand-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, tech stack or keyword"
                  className="w-full px-3 py-2 text-gray-800 outline-none text-sm bg-transparent placeholder-gray-400 font-medium"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="flex-1 flex items-center pl-4 w-full py-2 sm:py-0">
                <MapPin className="h-5 w-5 text-brand-500 shrink-0" />
                <input
                  type="text"
                  placeholder="City, country or Remote"
                  className="w-full px-3 py-2 text-gray-800 outline-none text-sm bg-transparent placeholder-gray-400 font-medium"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-700 hover:to-orange-600 text-white px-8 py-3.5 rounded-full font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 shrink-0"
              >
                Search <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            
            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 mb-10 text-xs sm:text-sm">
              <span className="text-gray-500 font-semibold mr-1">Popular:</span>
              {['Frontend', 'Full Stack', 'Data Scientist', 'Remote', 'DevOps'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/jobs?search=${tag}`)}
                  className="bg-white hover:bg-brand-50 text-gray-700 hover:text-brand-600 px-3.5 py-1.5 rounded-full font-medium border border-gray-200/80 transition-all shadow-2xs hover:border-brand-300"
                >
                  {tag}
                </button>
              ))}
            </div>
            
            {/* Metric Statistics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200/60 max-w-lg">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{stats.jobs}</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">Active Jobs</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{stats.companies}</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">Hiring Companies</p>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">{stats.hires}</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">Successful Hires</p>
              </div>
            </div>

          </div>
          
          {/* Right Visual Interactive Component */}
          <div className="w-full lg:w-[42%] relative flex items-center justify-center pt-6 lg:pt-0">
            
            {/* Background Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-orange-300/30 rounded-full blur-2xl -z-10"></div>

            {/* Main Featured Glass Card */}
            <div className="relative bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/80 w-full max-w-md transform hover:-translate-y-1 transition-all duration-300">
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 bg-gradient-to-tr from-brand-600 to-orange-400 rounded-2xl flex items-center justify-center text-white shadow-md shadow-brand-500/30">
                    <Code size={26} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Lead Full Stack Engineer</h3>
                    <p className="text-brand-600 font-semibold text-xs sm:text-sm">InnovateTech Labs</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold border border-emerald-200">
                  Verified
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-50 border border-gray-200/70 text-gray-600 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1">
                  <MapPin size={13}/> Remote / SF
                </span>
                <span className="bg-gray-50 border border-gray-200/70 text-gray-600 text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1">
                  <Briefcase size={13}/> Full-time
                </span>
                <span className="bg-brand-50 border border-brand-200/80 text-brand-700 text-xs px-3 py-1.5 rounded-xl font-bold">
                  $140k - $175k
                </span>
              </div>
              
              {/* Progress / Skills Bar */}
              <div className="space-y-2 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>Match compatibility</span>
                  <span className="text-brand-600 font-bold">96% Match</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-500 to-orange-500 w-[96%] rounded-full"></div>
                </div>
              </div>
              
              <Link 
                to="/jobs" 
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-md flex justify-center items-center gap-2 text-sm"
              >
                Apply Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Floating Floating Indicator 1 */}
            <div className="absolute -top-4 -right-2 sm:right-2 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900">Application Status</p>
                <p className="text-[11px] text-emerald-600 font-semibold">Shortlisted for Interview</p>
              </div>
            </div>

            {/* Floating Indicator 2 */}
            <div className="absolute -bottom-6 -left-2 sm:left-2 bg-white p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
              <div className="bg-orange-100 p-2.5 rounded-xl text-brand-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-900">Salary Insights</p>
                <p className="text-[11px] text-gray-500 font-medium">+18% higher than average</p>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
};

// --- Trusted By Section ---
const TrustedBySection = () => {
  const companyLogos = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_logo_and_wordmark.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' }
  ];

  return (
    <section className="py-12 border-y border-gray-100 bg-white">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-widest font-extrabold text-gray-400 mb-8">
          Trusted by top hiring teams worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
          {companyLogos.map((item, idx) => (
            <img 
              key={idx} 
              src={item.logo} 
              alt={item.name} 
              className="h-6 sm:h-7 object-contain transition-all hover:scale-110" 
            />
          ))}
          <Link to="/companies" className="text-brand-600 font-bold text-xs sm:text-sm flex items-center gap-1 hover:underline ml-2">
            View All Companies <ArrowRight size={15}/>
          </Link>
        </div>
      </div>
    </section>
  );
};

// --- Featured Jobs Showcase ---
const FeaturedJobsSection = () => {
  const showcaseJobs = [
    {
      title: 'Senior Frontend Engineer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      salary: '$130,000 - $160,000',
      category: 'Software Development',
      posted: '2 hours ago',
      badge: 'Urgent Hire'
    },
    {
      title: 'AI & Data Scientist',
      company: 'DataMind Systems',
      location: 'New York, NY / Hybrid',
      type: 'Full-time',
      salary: '$145,000 - $185,000',
      category: 'Data Science',
      posted: '5 hours ago',
      badge: 'Featured'
    },
    {
      title: 'Senior UX/UI Designer',
      company: 'CreativePulse Studio',
      location: 'Austin, TX / Remote',
      type: 'Full-time',
      salary: '$110,000 - $140,000',
      category: 'Design & UX',
      posted: '1 day ago',
      badge: 'Remote'
    },
    {
      title: 'Lead Product Manager',
      company: 'NextGen Scale',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$150,000 - $190,000',
      category: 'Product Management',
      posted: 'Just now',
      badge: 'Hot Job'
    }
  ];

  return (
    <section className="py-20 bg-slate-50/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-brand-600 font-extrabold tracking-widest text-xs uppercase flex items-center gap-1.5 mb-2">
              <Zap size={15} /> Live Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Featured Job Openings
            </h2>
          </div>
          <Link 
            to="/jobs" 
            className="inline-flex items-center gap-2 font-bold text-brand-600 hover:text-brand-700 hover:underline text-sm"
          >
            Browse All Open Jobs <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showcaseJobs.map((job, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/70 shadow-xs hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
                      {job.badge}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 font-medium text-sm mt-0.5">{job.company}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-600 font-bold text-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Building2 size={22} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-gray-500 mb-6">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-brand-500" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} className="text-brand-500" /> {job.type}</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">
                    <DollarSign size={14} /> {job.salary}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  <Clock size={13} /> {job.posted}
                </span>
                <Link 
                  to="/jobs" 
                  className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Quick Apply
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// --- Categories Section ---
const CategoriesSection = () => {
  const categories = [
    { icon: <Code size={26} />, title: 'Software Development', jobs: '12,450+ jobs', color: 'from-blue-500 to-indigo-600' },
    { icon: <Database size={26} />, title: 'Data Science & AI', jobs: '8,210+ jobs', color: 'from-purple-500 to-indigo-600' },
    { icon: <Palette size={26} />, title: 'Design & Creative', jobs: '5,630+ jobs', color: 'from-pink-500 to-rose-600' },
    { icon: <LayoutDashboard size={26} />, title: 'Product & Project', jobs: '4,180+ jobs', color: 'from-brand-500 to-orange-600' },
    { icon: <Megaphone size={26} />, title: 'Marketing & Sales', jobs: '3,920+ jobs', color: 'from-amber-500 to-orange-600' },
    { icon: <Users size={26} />, title: 'Human Resources', jobs: '2,840+ jobs', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-600 font-extrabold tracking-widest text-xs uppercase mb-2 block">
            Browse Opportunities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Popular Job Categories
          </h2>
          <p className="text-gray-500 text-sm mt-3">
            Find active listings grouped by industry and domain expertise.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c, idx) => (
            <Link 
              to={`/jobs?category=${encodeURIComponent(c.title)}`} 
              key={idx} 
              className="bg-white p-7 rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-brand-300 transition-all duration-300 group flex items-start justify-between"
            >
              <div className="flex flex-col">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs font-semibold text-gray-400 mt-1">{c.jobs}</p>
              </div>

              <div className="w-9 h-9 rounded-full bg-gray-50 text-gray-400 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

// --- Platform Features / Why Choose Us ---
const FeaturesSection = () => {
  const features = [
    { 
      icon: <Search className="text-brand-500" size={28}/>, 
      title: 'Smart Job Matching', 
      desc: 'Our intelligent algorithms surface opportunities aligned directly with your tech stack and salary goals.' 
    },
    { 
      icon: <FileText className="text-brand-500" size={28}/>, 
      title: 'One-Click Instant Apply', 
      desc: 'Create your unified profile once and apply to hundreds of top tech companies effortlessly.' 
    },
    { 
      icon: <Bell className="text-brand-500" size={28}/>, 
      title: 'Real-Time Job Notifications', 
      desc: 'Be the first to apply with personalized alerts delivered straight to your inbox.' 
    },
    { 
      icon: <ShieldCheck className="text-brand-500" size={28}/>, 
      title: '100% Verified Employers', 
      desc: 'Say goodbye to ghost jobs. Every single company profile is thoroughly vetted by our team.' 
    },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-400 font-extrabold tracking-widest text-xs uppercase mb-2 block">
            Why JobPortal Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built to Accelerate Your Career Success
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div 
              key={idx} 
              className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 text-left shadow-lg hover:border-brand-500 hover:bg-slate-800 transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-700/60 text-brand-400 mb-6 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// --- How It Works Section ---
const HowItWorksSection = () => {
  const steps = [
    { 
      num: '01', 
      title: 'Create Profile', 
      desc: 'Sign up in seconds, upload your resume, and showcase your top skills.' 
    },
    { 
      num: '02', 
      title: 'Discover & Apply', 
      desc: 'Filter jobs by salary, location, or tech stack and apply with one click.' 
    },
    { 
      num: '03', 
      title: 'Get Hired Fast', 
      desc: 'Connect directly with hiring managers and land your dream job offer.' 
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-600 font-extrabold tracking-widest text-xs uppercase mb-2 block">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative bg-orange-50/50 border border-orange-100 rounded-3xl p-8 text-center flex flex-col items-center hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-orange-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md mb-6">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// --- Testimonials Section ---
const TestimonialsSection = () => {
  const reviews = [
    { 
      name: 'Riya Sharma', 
      role: 'Frontend Developer', 
      company: 'TechCorp', 
      text: 'JobPortal made job hunting effortless. I applied to 5 companies and received 3 interview calls within a week!', 
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' 
    },
    { 
      name: 'Amit Kumar', 
      role: 'Full Stack Engineer', 
      company: 'ScaleUp AI', 
      text: 'The AI salary insights and instant apply feature saved me so much time. Highly recommend to any dev!', 
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' 
    },
    { 
      name: 'Sneha Patel', 
      role: 'Product Designer', 
      company: 'Innovate Design', 
      text: 'Clean interface, zero spam jobs, and direct connections to hiring managers. Best career platform.', 
      img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' 
    },
  ];

  return (
    <section className="py-20 bg-orange-50/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-600 font-extrabold tracking-widest text-xs uppercase mb-2 block">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Loved by Developers & Professionals
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-3xl shadow-xs border border-gray-200/80 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic text-sm sm:text-base leading-relaxed mb-6">
                  "{r.text}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100">
                <img 
                  src={r.img} 
                  alt={r.name} 
                  className="w-11 h-11 rounded-full object-cover border-2 border-brand-500" 
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{r.name}</h4>
                  <p className="text-xs text-gray-500">{r.role} at <span className="font-semibold text-brand-600">{r.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

// --- High Converting Call to Action Section ---
const CtaSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="bg-white/20 text-white text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-4">
              Take Control of Your Future
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-base sm:text-lg text-orange-50 mb-10 max-w-xl mx-auto">
              Join thousands of job seekers and hiring managers on JobPortal. Create your free account today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-brand-600 font-extrabold rounded-full hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
              >
                Sign Up as Candidate <ArrowRight size={16} />
              </Link>
              <Link 
                to="/recruiter/dashboard" 
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 font-extrabold rounded-full hover:bg-white/20 transition-all text-sm flex items-center justify-center gap-2"
              >
                For Employers: Post a Job
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-500 selection:text-white">
      <HeroSection />
      <TrustedBySection />
      <FeaturedJobsSection />
      <CategoriesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};

export default Home;
