'use client';

import Link from 'next/link';
// Placeholder for icons - replace with actual icons from a library like react-icons or heroicons
const PlaceholderIcon = ({ className = 'w-5 h-5' }) => <div className={`bg-gray-300 rounded ${className}`}></div>;

export default function Sidebar({ isOpen }) { // Remove toggle prop
  // TODO: Replace with actual user/team data
  const currentTeam = 'Personal';
  const userName = 'Denys Matsuiev';

  // TODO: Implement dynamic active state based on current route
  const navItems = [
    { name: 'Overview', href: '/dashboards', icon: PlaceholderIcon },
    { name: 'API Playground', href: '/playground', icon: PlaceholderIcon }, // Updated href
    // { name: 'Use Cases', href: '/use-cases', icon: PlaceholderIcon },       // Adjust href if needed
    // { name: 'My Account', href: '/account', icon: PlaceholderIcon },         // Adjust href if needed
    { name: 'Documentation', href: 'https://docs.tavily.com', icon: PlaceholderIcon, external: true }, // Example external link
  ];

  return (
    // Use fixed positioning and transform for smooth transition
    <div className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-30 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      {/* Added wrapper for padding that disappears when closed */}
      <div className={`p-4 space-y-6 flex flex-col flex-1 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 delay-100`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-2 h-10">
          <div className="flex items-center space-x-2">
             {/* Replace with actual Logo SVG or Image component */}
             <div className="w-8 h-8 bg-blue-500 rounded"></div>
             <span className="font-bold text-lg text-gray-800">Dmats AI</span>
          </div>
          {/* Toggle Button Removed from here */}
        </div>

        {/* Team/Personal Selector */}
        <div className="px-2">
          <button className="w-full flex items-center justify-between p-2 bg-gray-100 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200">
            <span>{currentTeam}</span>
            {/* Placeholder for dropdown icon */}
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 group"
              // Add active class logic here: e.g., `bg-gray-100 text-gray-900`
            >
              <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
              <span>{item.name}</span>
              {item.external && (
                // Placeholder for external link icon
                <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info Bottom */}
        <div className="border-t border-gray-200 pt-4 px-2">
          <button className="w-full flex items-center justify-between p-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
            <div className="flex items-center space-x-2">
              {/* Placeholder for User Avatar */}
              <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center font-semibold text-xs text-gray-600">
                {userName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="truncate">{userName}</span>
            </div>
            {/* Placeholder for logout/settings icon */}
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </div> {/* End of padded wrapper */}
    </div>
  );
} 