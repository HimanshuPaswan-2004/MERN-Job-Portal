import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Linkedin, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

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
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-8 gap-8">
          
          {/* Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center space-x-2 mb-2">
              <Briefcase className="h-6 w-6 text-brand-600" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">JobPortal</span>
            </Link>
            <p className="text-gray-500 text-sm mb-4">Your career starts here.</p>
            <p className="text-gray-400 text-xs hidden md:block">
              &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-brand-600 transition-colors">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Mobile Copyright & Made with love */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100">
          <p className="text-gray-400 text-xs md:hidden mb-4">
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs flex items-center justify-center md:justify-end w-full">
            Made with <Heart className="h-3 w-3 text-red-500 mx-1 fill-current" /> for a better future
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
