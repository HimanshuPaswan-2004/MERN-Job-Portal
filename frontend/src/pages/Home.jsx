import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, FileText, Bell, TrendingUp, Code, Database, Palette, LayoutDashboard, Megaphone, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

// --- HeroSection ---
const HeroSection = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() || location.trim()) {
      navigate(`/jobs?search=${keyword}&location=${location}`);
    }
  };

  const [stats, setStats] = useState({ jobs: '50K+', companies: '10K+', hires: '1M+' });

  React.useEffect(() => {
    // Optionally fetch real stats if backend is running
    fetch('http://localhost:8000/api/jobs/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats({
            jobs: data.data.totalJobs > 0 ? data.data.totalJobs : '50K+',
            companies: data.data.totalCompanies > 0 ? data.data.totalCompanies : '4',
            hires: '1M+' // keep static for now
          });
        }
      })
      .catch(err => console.log('Stats fetch error', err));
  }, []);

  return (
    <section className="relative bg-[#fcf9f2] pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Content */}
          <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col justify-center relative z-20">
            <div className="mb-6">
              <span className="inline-block py-1.5 px-4 rounded-full bg-orange-100/70 text-orange-600 text-sm font-semibold">
                #1 Job Platform for Your Career
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-[4.5rem] font-extrabold text-[#111827] leading-[1.1] mb-6 tracking-tight">
              Find Your <br />
              <span className="text-brand-600">Dream Job</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              Discover thousands of job opportunities, connect with top companies, and take the next step in your career.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white p-2.5 rounded-full shadow-lg shadow-gray-200/50 flex flex-col md:flex-row items-center mb-6 w-full max-w-2xl border border-gray-100">
              <div className="flex-1 flex items-center pl-4 w-full border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
                <Search className="h-5 w-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, skills or keywords"
                  className="w-full px-3 py-2 text-gray-700 outline-none text-sm bg-transparent placeholder-gray-400"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center pl-4 w-full py-2 md:py-0">
                <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full px-3 py-2 text-gray-700 outline-none text-sm bg-transparent placeholder-gray-400"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-3.5 rounded-full font-medium transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Search Jobs <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            
            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 mb-16 lg:mb-24">
              <span className="text-sm text-gray-500 mr-1">Popular searches:</span>
              {['Frontend', 'Backend', 'Data Scientist', 'Remote', 'Internship'].map((tag) => (
                <span key={tag} className="text-[13px] bg-blue-50 text-blue-600 px-3.5 py-1 rounded-full font-medium cursor-pointer hover:bg-blue-100 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-12 sm:gap-20">
              <div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.jobs}</h3>
                <p className="text-sm text-gray-500 font-medium">Jobs Posted</p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.companies}</h3>
                <p className="text-sm text-gray-500 font-medium">Companies</p>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stats.hires}</h3>
                <p className="text-sm text-gray-500 font-medium">Successful Hires</p>
              </div>
            </div>
          </div>
          
          {/* Right UI Illustration Area */}
          <div className="hidden lg:flex w-[45%] xl:w-1/2 relative h-[550px] xl:h-[650px] z-10 items-center justify-center">
            
            {/* Glowing Abstract Background Blobs */}
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-brand-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
            
            {/* Main Floating Job Card */}
            <div className="relative bg-white/90 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/60 max-w-[400px] w-full z-20 hover:-translate-y-2 transition-transform duration-500">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex gap-4 items-center">
                     <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-orange-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                       <Palette size={28} />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold text-gray-900 tracking-tight">Senior Product Designer</h3>
                       <p className="text-brand-600 font-medium text-sm mt-1">InnovateTech Inc.</p>
                     </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold shadow-sm">New</span>
               </div>
               
               <div className="flex flex-wrap gap-2 mb-8">
                 <span className="bg-gray-50 border border-gray-100 text-gray-600 text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5"><MapPin size={14}/> Remote</span>
                 <span className="bg-gray-50 border border-gray-100 text-gray-600 text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5"><Briefcase size={14}/> Full-time</span>
                 <span className="bg-gray-50 border border-gray-100 text-gray-600 text-xs px-4 py-2 rounded-xl font-semibold">$120k - $150k</span>
               </div>
               
               <div className="space-y-4 mb-8 opacity-70">
                 <div className="h-2.5 bg-gray-100 rounded-full w-full"></div>
                 <div className="h-2.5 bg-gray-100 rounded-full w-5/6"></div>
                 <div className="h-2.5 bg-gray-100 rounded-full w-4/6"></div>
               </div>
               
               <button className="w-full bg-[#111827] text-white py-4 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-md flex justify-center items-center gap-2">
                 Quick Apply <ArrowRight size={18} />
               </button>
            </div>

            {/* Smaller Floating Element - Notifications */}
            <div className="absolute top-[15%] right-0 bg-white p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-4 z-30 animate-bounce" style={{animationDuration: '4s'}}>
               <div className="bg-brand-50 p-3 rounded-full text-brand-600 relative">
                 <Bell size={20} />
                 <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
               </div>
               <div>
                 <p className="font-bold text-sm text-gray-900">Job Alert Match</p>
                 <p className="text-xs text-gray-500">2 mins ago</p>
               </div>
            </div>

            {/* Smaller Floating Element - Analytics */}
            <div className="absolute bottom-[20%] -left-8 bg-white p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center gap-4 z-30 animate-bounce" style={{animationDuration: '5s', animationDelay: '1s'}}>
               <div className="bg-orange-50 p-3 rounded-full text-brand-600">
                 <TrendingUp size={20} />
               </div>
               <div>
                 <p className="font-bold text-sm text-gray-900">Profile Views</p>
                 <p className="text-xs text-brand-600 font-bold">+24% this week</p>
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
  const logos = [
    { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Adobe', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_logo_and_wordmark.svg' },
  ];
  return (
    <section className="py-10 border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 font-medium mb-6">Trusted by 1,000+ leading companies</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          {logos.map((logo, idx) => (
            <img key={idx} src={logo.url} alt={logo.name} className="h-6 md:h-8 object-contain transition-all hover:scale-110" />
          ))}
          <a href="/companies" className="text-brand-600 font-medium text-sm flex items-center gap-1 hover:underline">View All <ArrowRight size={16}/></a>
        </div>
      </div>
    </section>
  );
}

// --- Features Section ---
const FeaturesSection = () => {
  const features = [
    { icon: <Search className="text-brand-500" size={32}/>, title: 'Wide Opportunities', desc: 'Explore thousands of jobs across top companies.' },
    { icon: <FileText className="text-brand-500" size={32}/>, title: 'Easy Applications', desc: 'Apply to multiple jobs with a single profile.' },
    { icon: <Bell className="text-brand-500" size={32}/>, title: 'Job Alerts', desc: 'Get notified about the latest opportunities.' },
    { icon: <TrendingUp className="text-brand-500" size={32}/>, title: 'Career Growth', desc: 'Learn, upskill, and grow with the right resources.' },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-semibold tracking-wider text-sm uppercase">Why Choose JobPortal</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Everything You Need to <span className="text-brand-600">Build Your Future</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-shadow duration-300 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-50 mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Categories Section ---
const CategoriesSection = () => {
  const categories = [
    { icon: <Code />, title: 'Software Development', jobs: '12,340 jobs' },
    { icon: <Database />, title: 'Data Science', jobs: '8,420 jobs' },
    { icon: <Palette />, title: 'Design & UX', jobs: '5,230 jobs' },
    { icon: <LayoutDashboard />, title: 'Product Management', jobs: '4,120 jobs' },
    { icon: <Megaphone />, title: 'Marketing', jobs: '3,860 jobs' },
    { icon: <Users />, title: 'Human Resources', jobs: '2,940 jobs' },
  ];
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-brand-600 font-semibold tracking-wider text-sm uppercase">Explore by Category</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Popular Job Categories</h2>
          </div>
          <a href="/jobs" className="hidden md:flex items-center gap-1 text-brand-600 font-medium hover:underline">View All <ArrowRight size={16}/></a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c, idx) => (
            <a href={`/jobs?category=${c.title}`} key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                {c.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.jobs}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- How It Works Section ---
const HowItWorksSection = () => {
  const steps = [
    { num: 1, title: 'Create Your Profile', desc: 'Sign up and build your professional profile in minutes.', icon: <Users className="text-brand-500"/> },
    { num: 2, title: 'Find & Apply', desc: 'Browse jobs and apply with a single click.', icon: <Search className="text-brand-500"/> },
    { num: 3, title: 'Get Hired', desc: 'Connect with companies and start your dream career.', icon: <Briefcase className="text-brand-500"/> },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-semibold tracking-wider text-sm uppercase">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Get Hired in 3 Simple Steps</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center relative gap-8 md:gap-0">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gray-100 -translate-y-1/2 -z-10"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center max-w-xs bg-white px-4">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-brand-50 flex items-center justify-center shadow-lg mb-6 relative">
                {step.icon}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {step.num}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Testimonials Section ---
const TestimonialsSection = () => {
  const reviews = [
    { name: 'Riya Sharma', role: 'Software Engineer at Google', text: '"JobPortal helped me land my dream job at Google. The process was so smooth and easy!"', img: 'https://i.pravatar.cc/150?img=1', company: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' },
    { name: 'Amit Kumar', role: 'Product Designer at Microsoft', text: '"I found amazing opportunities and connected with top companies. Highly recommended!"', img: 'https://i.pravatar.cc/150?img=11', company: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { name: 'Sneha Patel', role: 'Data Scientist at Amazon', text: '"The job alerts and easy application process saved me so much time. Great platform!"', img: 'https://i.pravatar.cc/150?img=5', company: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  ];
  return (
    <section className="py-20 bg-brand-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-600 font-semibold tracking-wider text-sm uppercase">Success Stories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">What Our Users Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 text-orange-400 mb-4">
                  {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                </div>
                <p className="text-gray-700 italic mb-6 text-lg">{r.text}</p>
              </div>
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{r.name}</h4>
                  <p className="text-xs text-gray-500">{r.role}</p>
                </div>
                <img src={r.company} alt="company" className="h-6 object-contain w-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CTA Section ---
const CtaSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-brand-600 to-orange-500 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-black opacity-10 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Take the Next Step?</h2>
            <p className="text-lg text-brand-50 mb-10">Join thousands of job seekers and find the right opportunity today.</p>
            <a href="/signup" className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-600 font-bold rounded-full hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <CategoriesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
};

export default Home;
