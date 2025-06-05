
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-ep-light-bg text-ep-dark-text">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fadeIn">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
