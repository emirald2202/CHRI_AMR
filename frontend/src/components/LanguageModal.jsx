import React from 'react';
import { Globe, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
];

const LanguageModal = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();

  if (!isOpen) return null;

  const handleLanguageSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200"
        style={{ animation: 'amrFadeIn 0.2s ease both' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-green-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-200 text-center mb-1">
          Choose Language
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-6">
          Select your preferred language for the app
        </p>

        <div className="grid grid-cols-1 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                i18n.language === lang.code
                  ? 'border-green-500 bg-green-50 dark:bg-emerald-900/40 text-green-700 dark:text-green-400'
                  : 'border-gray-100 dark:border-slate-700 hover:border-green-200 dark:hover:border-emerald-800'
              }`}
            >
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{lang.native}</span>
                <span className="text-xs text-gray-400">{lang.name}</span>
              </div>
              {i18n.language === lang.code && <Check className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
