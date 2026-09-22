import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Globe, Mail, MessageCircle, Heart, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Jobs', path: '/jobs' },
    { name: 'Top Companies', path: '/companies' },
    { name: 'Candidate Dashboard', path: '/candidate/dashboard' },
    { name: 'Recruiter Dashboard', path: '/recruiter/dashboard' },
  ];

  const popularCategories = [
    { name: 'Software Development', path: '/jobs?category=Software+Development' },
    { name: 'Data Science & AI', path: '/jobs?category=Data+Science' },
    { name: 'Design & UX', path: '/jobs?category=Design' },
    { name: 'Product Management', path: '/jobs?category=Product' },
    { name: 'Marketing & Sales', path: '/jobs?category=Marketing' },
  ];

  return (
    <footer className="bg-slate-900 pt-12 text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-orange-500 flex items-center justify-center text-white shadow-md">
                <Briefcase className="h-5.5 w-5.5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">JobPortal</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Discover thousands of verified career opportunities, connect with top companies, and accelerate your professional journey with our AI-powered job platform.
            </p>
            
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-all">
                <Globe size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-all">
                <Mail size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-brand-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight size={13} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Popular Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {popularCategories.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-brand-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowRight size={13} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Badges */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">Trust & Security</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <ShieldCheck size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-xs">Verified Companies</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">100% verified employer profiles & safe hiring processes.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <Zap size={20} className="text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-xs">Instant Apply</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">One-click job applications directly to hiring managers.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} JobPortal Network. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500 animate-pulse" /> for job seekers & recruiters worldwide.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
