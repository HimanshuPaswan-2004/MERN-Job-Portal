import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Globe, Mail, MessageCircle, Heart } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Companies', path: '/companies' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
  ];

  return (
    <footer className="bg-brand-600 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 gap-8 text-white">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Briefcase className="h-6 w-6 text-brand-600" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">JobPortal</span>
            </Link>
            <p className="text-brand-100 text-sm max-w-xs text-center md:text-left leading-relaxed">
              Discover your dream job, connect with top employers, and accelerate your career growth with us.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 max-w-lg">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-brand-50 hover:text-white hover:underline transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Social Icons (Inside the orange section) */}
        <div className="flex justify-center md:justify-start space-x-4 mb-12">
          <a href="#" className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white hover:bg-white hover:text-brand-600 transition-colors shadow-sm">
            <Globe className="h-5 w-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white hover:bg-white hover:text-brand-600 transition-colors shadow-sm">
            <Mail className="h-5 w-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white hover:bg-white hover:text-brand-600 transition-colors shadow-sm">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Bottom White Section */}
      <div className="bg-white py-6 rounded-t-[2rem] md:rounded-t-[3rem] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs md:text-sm font-medium">
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs md:text-sm flex items-center font-medium">
            Made with <Heart className="h-4 w-4 text-brand-500 mx-1.5 fill-current animate-pulse" /> for a better future
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
