import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronDown, LogOut, Settings, Clock, Award, Globe, Search } from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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
              {t('dashboard')}
            </Link>
            <Link to="/leaderboard" className="text-gray-500 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all">
              {t('leaderboard')}
            </Link>
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="text-green-600 border border-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> {t('findPharmacies')}
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-5">
            
            {/* Real Language Selector Container */}
            <div className="hidden sm:block mt-1">
              <LanguageSelector variant="light" />
            </div>

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-[0.8rem] font-bold text-gray-800 leading-tight">{user?.name || t('guest')}</div>
                  <div className="text-[0.7rem] font-bold text-green-600 flex justify-end items-center gap-1 mt-0.5">
                    <Award className="w-[10px] h-[10px]" /> {user?.points || 0} {t('pts')}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200 shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 z-[1001]">
                  <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 rounded-t-xl">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || t('guest')}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5 font-medium">{user?.role || t('user')}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                      <Settings className="w-4 h-4 mr-3 text-gray-400" /> {t('accountSettings')}
                    </Link>
                    <Link to="/history" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                      <Clock className="w-4 h-4 mr-3 text-gray-400" /> {t('disposalHistory')}
                    </Link>
                    <Link to="/leaderboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                      <Award className="w-4 h-4 mr-3 text-gray-400" /> {t('pointsBadges')}
                    </Link>
                  </div>
                  <div className="border-t border-gray-50 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors">
                    <LogOut className="w-4 h-4 mr-3" /> {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Search Bar */}
      {showSearch && (
        <div className="border-t border-gray-100 bg-white shadow-[inset_0_-4px_6px_-6px_rgba(0,0,0,0.1)] pb-6 pt-4 px-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-2xl mx-auto text-center">
             <div className="flex gap-3 mb-2">
                <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')} 
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 shadow-sm transition-all font-medium text-gray-700"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2">
                  <Search className="w-5 h-5 pointer-events-none" /> {t('searchBtn')}
                </button>
             </div>
             <p className="text-[0.7rem] text-gray-500 font-semibold text-left ml-2">📍 {t('searchingLoc')}</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
