'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Adjust path if needed

// Simple Icons for toggle button (replace with better icons if available)
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

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative"> {/* Added relative positioning */}
      <Sidebar isOpen={isSidebarOpen} /> {/* Removed toggle prop */}

      {/* Toggle Button positioned absolutely */}
      <button
        onClick={toggleSidebar}
        // Adjust left position based on sidebar state for visual consistency
        className={`fixed top-4 p-1 rounded-md text-gray-600 bg-white shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'left-[236px]' : 'left-4'}`}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </button>

      {/* Adjust left margin of main content based on sidebar state */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Add padding-top to main content to prevent overlap with fixed toggle button */}
        <div className="pt-16 px-4 sm:px-8"> {/* Adjust pt as needed */}
           {/* Optional: Add a header here if needed inside the main content area */}
           {children}
        </div>
      </main>
    </div>
  );
} 