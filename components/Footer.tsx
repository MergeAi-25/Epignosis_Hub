
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, ROUTES } from '../constants';
import { BookOpenIcon, FacebookIcon, TwitterIcon, GitHubIcon } from './icons'; // Assuming these icons are added/exist

const Footer: React.FC = () => {
  const quickLinks = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Bible Quizzes', path: ROUTES.QUIZZES },
    { label: 'Bible Topics', path: ROUTES.STUDY_TOPICS },
    { label: 'Bible Chat', path: ROUTES.CHATBOT },
  ];

  const resourcesLinks = [
    { label: 'Bible Study Guide', path: '#' }, // Placeholder paths
    { label: 'Devotionals', path: '#' },
    { label: 'Prayer Journal', path: '#' },
    { label: 'Recommended Books', path: '#' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: '#' }, // Placeholder paths
    { label: 'Terms of Service', path: '#' },
    { label: 'Cookie Policy', path: '#' },
  ];

  return (
    <footer className="bg-ep-blue text-slate-200 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* App Info & Social */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center mb-4 text-white hover:opacity-80 transition-opacity">
              <BookOpenIcon className="h-8 w-8 mr-2 text-ep-primary" />
              <span className="font-bold text-xl">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Deepening your understanding of Scripture through study, quizzes, and AI-assisted learning.
            </p>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors"><span className="sr-only">Facebook</span><FacebookIcon className="w-6 h-6" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors"><span className="sr-only">Twitter</span><TwitterIcon className="w-6 h-6" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors"><span className="sr-only">GitHub</span><GitHubIcon className="w-6 h-6" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-md font-semibold text-white mb-4">Quick Links</h5>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-slate-300 hover:text-white hover:underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-md font-semibold text-white mb-4">Resources</h5>
            <ul className="space-y-2">
              {resourcesLinks.map(link => (
                <li key={link.label}>
                  <a href={link.path} className="text-sm text-slate-300 hover:text-white hover:underline transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-md font-semibold text-white mb-4">Legal</h5>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.label}>
                  <a href={link.path} className="text-sm text-slate-300 hover:text-white hover:underline transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-ep-blue-light pt-8 mt-8 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {APP_NAME}. Developed by Phronesis Intelligence.
            <br /> Dedicated to the youth of Rise Up Bible Church. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
