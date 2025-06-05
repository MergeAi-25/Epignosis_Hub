

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, APP_NAME } from '../constants';
import { useUser } from '../contexts/UserContext';
import { HomeIcon, QuestionMarkCircleIcon, AcademicCapIcon, ChatBubbleLeftEllipsisIcon, UserCircleIcon, Bars3Icon, XMarkIcon, Cog6ToothIcon, LogoutIcon, BookOpenIcon } from './icons';

const NavLinkContent: React.FC<{ icon: React.ReactNode; label: string; isMobile?: boolean }> = ({ icon, label, isMobile }) => (
  <>
    {icon}
    <span className={isMobile ? "ml-3" : "ml-2"}>{label}</span>
  </>
);

const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: (name: string, email: string) => void; }> = ({ isOpen, onClose, onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onLogin(name, email);
      setName('');
      setEmail('');
      onClose();
    } else {
      alert("Please enter both name and email.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] transition-opacity duration-300 ease-in-out animate-fadeIn">
      <div ref={modalRef} className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md m-4 animate-modalEnter">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-ep-dark-text">Welcome to {APP_NAME}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 transition-colors duration-300 ease-in-out">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="text-slate-600 mb-6 text-sm sm:text-base">Please enter your name and email to continue and save your progress.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login-name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              id="login-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ep-primary focus:border-transparent transition-shadow duration-300 ease-in-out"
              placeholder="E.g., John Doe"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ep-primary focus:border-transparent transition-shadow duration-300 ease-in-out"
              placeholder="E.g., john.doe@example.com"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-ep-primary hover:bg-ep-primary-hover text-white font-semibold py-2.5 px-4 rounded-md shadow-md transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            Login / Register
          </button>
        </form>
      </div>
    </div>
  );
};


const Navbar: React.FC = () => {
  const { currentUser, logout, login } = useUser();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const handleLoginButtonClick = () => {
    setShowLoginModal(true);
    setMobileMenuOpen(false); 
  };

  const handleLoginSubmit = (name: string, email: string) => {
    login(name, email);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      // Close mobile menu if click is outside of it
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        // Check if the click was on the toggle button itself to prevent immediate re-closing
        const mobileMenuToggle = document.getElementById('mobile-menu-button');
        if (mobileMenuToggle && !mobileMenuToggle.contains(event.target as Node)) {
          setMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);
  
  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: ROUTES.HOME, label: 'Home', icon: <HomeIcon className="w-5 h-5" /> },
    { path: ROUTES.QUIZZES, label: 'Bible Quizzes', icon: <QuestionMarkCircleIcon className="w-5 h-5" /> },
    { path: ROUTES.STUDY_TOPICS, label: 'Bible Topics', icon: <AcademicCapIcon className="w-5 h-5" /> },
    { path: ROUTES.CHATBOT, label: 'Bible Chat', icon: <ChatBubbleLeftEllipsisIcon className="w-5 h-5" /> },
  ];
  
  const profileNavItems = [
     { path: ROUTES.PROFILE, label: 'Profile', icon: <UserCircleIcon className="w-5 h-5" /> },
  ];

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to={ROUTES.HOME} className="flex-shrink-0 flex items-center text-ep-blue hover:opacity-80 transition-opacity duration-300 ease-in-out">
                <BookOpenIcon className="h-7 w-7 sm:h-8 sm:w-8 mr-2 text-ep-primary" />
                <span className="font-bold text-lg sm:text-xl tracking-tight">{APP_NAME}</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                    ${location.pathname === item.path ? 'bg-sky-100 text-ep-primary' : 'text-slate-700 hover:bg-sky-50 hover:text-ep-primary'}`}
                >
                  <NavLinkContent icon={item.icon} label={item.label} />
                </Link>
              ))}
            </div>

            <div className="flex items-center">
              {/* Desktop Profile/Login Button */}
              <div className="hidden md:block relative ml-4" ref={profileMenuRef}>
                {currentUser ? (
                  <div>
                    <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ep-primary p-1 hover:bg-slate-100 transition-colors duration-300 ease-in-out">
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon className="h-8 w-8 text-slate-600" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleLoginButtonClick}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-ep-primary hover:bg-ep-primary-hover transition-colors duration-300 ease-in-out transform hover:scale-105"
                  >
                    Login / Register
                  </button>
                )}
                {profileMenuOpen && currentUser && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3 text-sm text-slate-700 border-b">
                      <p className="font-medium">Signed in as</p>
                      <p className="truncate">{currentUser.name}</p>
                    </div>
                    <Link to={ROUTES.PROFILE} onClick={() => setProfileMenuOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-300 ease-in-out">
                      <UserCircleIcon className="w-5 h-5 mr-2" /> Profile
                    </Link>
                    <Link to={`${ROUTES.PROFILE}?tab=settings`} onClick={() => setProfileMenuOpen(false)} className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-300 ease-in-out">
                       <Cog6ToothIcon className="w-5 h-5 mr-2" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-300 ease-in-out"
                    >
                      <LogoutIcon className="w-5 h-5 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <div className="md:hidden ml-2">
                <button
                  id="mobile-menu-button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-ep-primary hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ep-primary transition-colors duration-300 ease-in-out"
                  aria-controls="mobile-menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        <div 
            className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setMobileMenuOpen(false)} // Backdrop click to close
        >
            <div className="fixed inset-0 bg-black bg-opacity-25"></div>
        </div>
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`fixed top-0 right-0 h-full w-64 sm:w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0 animate-menuSlideInRight' : 'translate-x-full animate-menuSlideOutRight'}`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <Link to={ROUTES.HOME} className="flex items-center text-ep-blue" onClick={() => setMobileMenuOpen(false)}>
              <BookOpenIcon className="h-6 w-6 mr-2 text-ep-primary" />
              <span className="font-bold text-md">{APP_NAME}</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 hover:text-slate-700">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="py-4 px-2 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-3 rounded-md text-base font-medium
                  ${location.pathname === item.path ? 'bg-sky-100 text-ep-primary' : 'text-slate-700 hover:bg-sky-50 hover:text-ep-primary'}`}
              >
                <NavLinkContent icon={item.icon} label={item.label} isMobile />
              </Link>
            ))}
            {currentUser && profileNavItems.map(item => (
                 <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-md text-base font-medium
                    ${location.pathname === item.path || (location.pathname.startsWith(ROUTES.PROFILE) && item.path === ROUTES.PROFILE) ? 'bg-sky-100 text-ep-primary' : 'text-slate-700 hover:bg-sky-50 hover:text-ep-primary'}`}
                >
                    <NavLinkContent icon={item.icon} label={item.label} isMobile />
                </Link>
            ))}
             <div className="border-t border-slate-200 my-2"></div>
            {currentUser ? (
              <>
                <div className="px-3 py-2">
                    <div className="text-sm font-medium text-slate-800 truncate">{currentUser.name}</div>
                    <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                </div>
                <Link 
                    to={`${ROUTES.PROFILE}?tab=settings`} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-sky-50 hover:text-ep-primary ${location.search.includes("tab=settings") && location.pathname.startsWith(ROUTES.PROFILE) ? 'bg-sky-100 text-ep-primary' : '' } `}
                >
                     <Cog6ToothIcon className="w-5 h-5" /> <span className="ml-3">Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-3 text-slate-700 hover:bg-sky-50 hover:text-ep-primary rounded-md text-base font-medium"
                >
                  <LogoutIcon className="w-5 h-5" /> <span className="ml-3">Logout</span>
                </button>
              </>
            ) : (
              <button 
                onClick={handleLoginButtonClick}
                className="w-full mt-2 px-3 py-3 border border-transparent text-base font-medium rounded-md text-white bg-ep-primary hover:bg-ep-primary-hover"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </nav>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLoginSubmit} />
    </>
  );
};

export default Navbar;
