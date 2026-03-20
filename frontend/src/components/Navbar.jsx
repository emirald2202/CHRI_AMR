import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronDown, LogOut, Settings, Clock, Award, Globe } from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 text-green-700 font-bold text-lg cursor-pointer">
              <div className="bg-green-600 p-1.5 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline">SafeDispose</span>
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/dashboard" className="text-green-600 font-semibold border-b-2 border-green-600 px-4 py-5 transition-colors">
              Dashboard
            </Link>
            <Link to="/leaderboard" className="text-gray-500 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all">
              Leaderboard
            </Link>
            <Link to="/impact" className="text-gray-500 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all">
              Impact
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center text-sm font-semibold text-gray-500 cursor-pointer hover:text-gray-800 transition-colors">
              <Globe className="w-4 h-4 mr-1.5" />
              <span>EN</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </div>

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-[0.8rem] font-bold text-gray-800 leading-tight">{user?.name || 'Guest User'}</div>
                  <div className="text-[0.7rem] font-bold text-green-600 flex justify-end items-center gap-1 mt-0.5">
                    <Award className="w-[10px] h-[10px]" /> {user?.points || 0} pts
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200 shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 z-50">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 rounded-t-xl">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Guest User'}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5 font-medium">{user?.role || 'user'}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                      <Settings className="w-4 h-4 mr-3 text-gray-400" /> Account Settings
                    </Link>
                    <Link to="/history" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                      <Clock className="w-4 h-4 mr-3 text-gray-400" /> Disposal History
                    </Link>
                    <Link to="/leaderboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                      <Award className="w-4 h-4 mr-3 text-gray-400" /> Points & Badges
                    </Link>
                  </div>
                  <div className="border-t border-gray-50 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors">
                    <LogOut className="w-4 h-4 mr-3" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
