'use client';

import { useState } from 'react';
import Sidebar from './Sidebar'; // Assuming Sidebar is also in components

// Simple Icons for toggle button
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

// This component now encapsulates the shared layout structure and state
export default function AppLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <Sidebar isOpen={isSidebarOpen} />

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-1 rounded-md text-gray-600 bg-white shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'left-[236px]' : 'left-4'}`}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </button>

      {/* Main content area */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
         {/* Padding container */}
         <div className="pt-16 px-4 sm:px-8">
           {children} {/* Render the page-specific content passed in */}
         </div>
      </main>
    </div>
  );
} 