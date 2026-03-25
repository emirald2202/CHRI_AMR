import React from 'react';
import { ShieldCheck, MapPin, Award, TrendingUp, Users, Droplets, Store, Gift, Moon, Sun } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const AuthLayout = ({ children }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 font-sans relative">

      {/* Top-right controls */}
      <div className="absolute top-6 right-6 z-[1001] flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors shadow-sm"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <LanguageSelector variant="light" />
      </div>

      {/* ── Left Info Panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-[#f0fdf4] dark:bg-slate-800 p-12 flex-col justify-between border-r border-green-100 dark:border-slate-700 relative overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(#dcfce7 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
      >
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200 rounded-full blur-[120px] opacity-40 pointer-events-none" />

        <div className="max-w-xl relative z-10">

          {/* Brand */}
          <div className="flex items-center gap-2 text-green-700 font-black text-2xl mb-5 tracking-tight">
            <img src="/favicon.svg" alt="AMRit Logo" className="w-8 h-8 drop-shadow-sm" />
            AMRit
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-emerald-900/30 text-green-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-5 shadow-sm shadow-green-200 border border-green-100 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4" />
            {t('fightingAmr')}
          </div>

          {/* Hero headline */}
          <h1 className="text-[2.6rem] font-extrabold text-[#065f46] dark:text-emerald-300 mb-3 leading-tight">
            {t('authTitle1')}<br />{t('authTitle2')}
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 dark:text-slate-300 text-sm mb-2 leading-relaxed pr-6">
            {t('authDesc')}
          </p>

          {/* Value prop */}
          <p className="text-[0.78rem] text-gray-500 dark:text-slate-400 mb-8 leading-relaxed pr-6 italic">
            Safely dispose at verified pharmacies near you — earn points, unlock discounts, and contribute to a healthier future.
          </p>


          {/* Reward hook */}
          <div className="bg-green-600 text-white rounded-2xl p-4 flex gap-3 items-start">
            <Gift className="w-5 h-5 shrink-0 mt-0.5 opacity-90" />
            <div>
              <p className="text-sm font-bold mb-1">🎁 Your Actions = Real Savings</p>
              <p className="text-[0.73rem] text-green-100 leading-relaxed">
                💊 Discounts on medicines &nbsp;·&nbsp; 🏥 Offers at partner pharmacies &nbsp;·&nbsp; 🎉 Exclusive reward deals
              </p>
              <p className="text-[0.7rem] text-green-200 mt-1.5 font-semibold italic">The more you contribute, the more you save.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8 relative z-10 max-w-xl">
          <div className="bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <ShieldCheck className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 dark:text-slate-200 text-lg">12,000+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('stats1S')}</div>
          </div>
          <div className="bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <Store className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 dark:text-slate-200 text-lg">300+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('stats2S')}</div>
          </div>
          <div className="bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <Droplets className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 dark:text-slate-200 text-lg">50,000+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('stats3S')}</div>
          </div>
          <div className="bg-white dark:bg-slate-800/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <Users className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 dark:text-slate-200 text-lg">8,500+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('stats4S')}</div>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-900">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
