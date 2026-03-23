import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronDown, LogOut, Settings, Clock, Award, Globe, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 md:h-28">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link to="/dashboard" className="flex items-center gap-3 md:gap-4 text-green-700 font-extrabold text-4xl md:text-5xl cursor-pointer tracking-tight">
              <img src="/favicon.svg" alt="AMRit Logo" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
              <span className="hidden sm:block leading-none mt-1">AMRit</span>
            </Link>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/dashboard" className="text-green-600 font-semibold border-b-2 border-green-600 px-4 py-5 transition-colors">
              {t('nav.dashboard')}
            </Link>
            <Link to="/leaderboard" className="text-gray-500 hover:text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-all">
              {t('nav.leaderboard')}
            </Link>
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="text-green-600 border border-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> {t('nav.findPharmacies')}
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            
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
                  <div className="text-[0.8rem] font-bold text-gray-800 leading-tight">{user?.name || 'Guest User'}</div>
                  <div className="text-[0.7rem] font-bold text-green-600 flex justify-end items-center gap-1 mt-0.5">
                    <Award className="w-[10px] h-[10px]" /> {user?.points || 0} {t('common.pts')}
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
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Guest User'}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5 font-medium">{user?.role || 'User'}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                      <Settings className="w-4 h-4 mr-3 text-gray-400" /> {t('nav.settings')}
                    </Link>
                    <Link to="/history" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                      <Clock className="w-4 h-4 mr-3 text-gray-400" /> {t('nav.history')}
                    </Link>
                    <Link to="/leaderboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium transition-colors">
                      <Award className="w-4 h-4 mr-3 text-gray-400" /> {t('nav.points')}
                    </Link>
                  </div>
                  <div className="border-t border-gray-50 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors">
                    <LogOut className="w-4 h-4 mr-3" /> {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sliding Search Bar */}
      {showSearch && (
        <div className="border-t border-gray-100 bg-white shadow-[inset_0_-4px_6px_-6px_rgba(0,0,0,0.1)] pb-4 pt-3 px-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-gray-800 font-semibold text-base">{t('nav.findPharmacies')}</h3>
                <p className="text-xs text-gray-500">Find nearby pharmacies on Google Maps</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border">
              <iframe
                src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=pharmacy&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Find Nearby Pharmacies on Google Maps"
                className="rounded-lg"
              ></iframe>
              <p className="text-xs text-gray-500 mt-1 text-center">
                Search for "pharmacy" or "medical store" in the map
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop */}
          <div 
             className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200" 
             onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="relative w-64 bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="font-extrabold text-green-700 tracking-tight">Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-2 py-3 space-y-1 flex-1 overflow-y-auto">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-[0.95rem] text-gray-700 hover:bg-green-50 hover:text-green-700 font-bold transition-colors">
                {t('nav.dashboard')}
              </Link>
              <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-[0.95rem] text-gray-700 hover:bg-green-50 hover:text-green-700 font-bold transition-colors">
                {t('nav.leaderboard')}
              </Link>
              <button 
                onClick={() => { setShowSearch(!showSearch); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-[0.95rem] text-gray-700 hover:bg-green-50 hover:text-green-700 font-bold flex items-center gap-2 transition-colors"
              >
                <Search className="w-[18px] h-[18px] text-green-600" /> {t('nav.findPharmacies')}
              </button>
              <div className="block sm:hidden px-4 pt-3 pb-2 border-t border-gray-100 mt-2">
                  <LanguageSelector variant="light" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
