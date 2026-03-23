import React from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans flex flex-col">
      <Navbar />
      
      {/* 
        Dashboard Shell:
        A Max-width container that uses CSS Grid. 
        lg:grid-cols-10 or lg:grid-cols-12 lets us split 70/30 cleanly!
        12 columns -> col-span-8 (66.6%) vs col-span-4 (33.3%)
      */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
