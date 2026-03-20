import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ variant = 'light' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'हिंदी', short: 'HI' },
    { code: 'mr', label: 'मराठी', short: 'MR' },
    { code: 'bn', label: 'বাংলা', short: 'BN' },        // Bengali
    { code: 'ta', label: 'தமிழ்', short: 'TA' },       // Tamil
    { code: 'te', label: 'తెలుగు', short: 'TE' },      // Telugu
    { code: 'ml', label: 'മലയാളം', short: 'ML' },     // Malayalam
    { code: 'gu', label: 'ગુજરાતી', short: 'GU' },       // Gujarati
    { code: 'pa', label: 'ਪੰਜਾਬੀ', short: 'PA' },      // Punjabi
    { code: 'kn', label: 'ಕನ್ನಡ', short: 'KN' }        // Kannada
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('appLanguage', code);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[999]" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center text-[0.85rem] font-bold transition-colors cursor-pointer rounded-lg px-2.5 py-1.5 ${
          variant === 'dark' 
            ? 'text-white hover:bg-white/10' 
            : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
        }`}
      >
        <Globe className="w-4 h-4 mr-1.5" />
        <span>{currentLang.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[1000] animate-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {languages.map((lng) => (
              <button
                key={lng.code}
                onClick={() => changeLanguage(lng.code)}
                className={`w-full text-left px-5 py-2.5 text-sm font-semibold transition-colors ${
                  i18n.language === lng.code 
                    ? 'bg-green-600 text-white shadow-inner' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {lng.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
