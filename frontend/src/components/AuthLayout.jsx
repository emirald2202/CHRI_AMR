import React from 'react';
import { ShieldCheck, MapPin, Award, TrendingUp, Users, Droplets, Store, Gift } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const AuthLayout = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 font-sans relative">

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-[1001]">
        <LanguageSelector variant="light" />
      </div>

      {/* ── Left Info Panel ── */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-[#f0fdf4] p-12 flex-col justify-between border-r border-green-100 relative overflow-hidden"
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
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-emerald-900/300 text-white px-3 py-1 rounded-full text-xs font-semibold mb-5 shadow-sm shadow-green-200">
            <ShieldCheck className="w-4 h-4" />
            {t('fightingAmr')}
          </div>

          {/* Hero headline */}
          <h1 className="text-[2.6rem] font-extrabold text-[#065f46] mb-3 leading-tight">
            {t('authTitle1')}<br />{t('authTitle2')}
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 text-sm mb-2 leading-relaxed pr-6">
            {t('authDesc')}
          </p>

          {/* Value prop */}
          <p className="text-[0.78rem] text-gray-500 mb-8 leading-relaxed pr-6 italic">
            Safely dispose at verified pharmacies near you — earn points, unlock discounts, and contribute to a healthier future.
          </p>

          {/* How it works — numbered steps */}
          <div className="space-y-3 mb-6">

            {/* Impact bullets */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-green-50 flex gap-4 items-start">
              <div className="text-green-500 mt-0.5 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-slate-200 text-sm mb-2">{t('whySafe')}</h3>
                <ul className="text-[0.78rem] text-gray-600 space-y-1.5">
                  <li className="flex gap-2 items-start"><span className="text-red-400 font-bold mt-0.5">•</span> {t('whySafe1')}</li>
                  <li className="flex gap-2 items-start"><span className="text-red-400 font-bold mt-0.5">•</span> {t('whySafe2')}</li>
                  <li className="flex gap-2 items-start"><span className="text-red-400 font-bold mt-0.5">•</span> {t('whySafe3')}</li>
                  <li className="flex gap-2 items-start"><span className="text-green-500 font-bold mt-0.5">•</span> Earn rewards for doing the right thing</li>
                </ul>
              </div>
            </div>

            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-green-50 flex gap-4 items-center">
              <div className="bg-green-50 dark:bg-emerald-900/30 p-2.5 rounded-full text-green-500 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-slate-200 text-sm">{t('findPharmaciesLoc')}</h3>
                <p className="text-[0.73rem] text-gray-500 mt-0.5">{t('findPharmLocations')}</p>
              </div>
            </div>

            {/* Step 2 — Rewards with badge */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-green-50 flex gap-4 items-center relative overflow-hidden">
              <div className="bg-amber-50 p-2.5 rounded-full text-amber-500 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 dark:text-slate-200 text-sm">{t('earnRewards')}</h3>
                <p className="text-[0.73rem] text-gray-500 mt-0.5">{t('earnDesc')}</p>
              </div>
              {/* Badge */}
              <div className="shrink-0 bg-amber-400 text-white text-[0.65rem] font-black px-2 py-1 rounded-lg shadow-sm leading-tight text-center">
                Up to<br />20% OFF
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-green-50 flex gap-4 items-center">
              <div className="bg-green-50 dark:bg-emerald-900/30 p-2.5 rounded-full text-green-500 shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-slate-200 text-sm">{t('trackImpact')}</h3>
                <p className="text-[0.73rem] text-gray-500 mt-0.5">{t('trackDesc')}</p>
              </div>
            </div>

          </div>

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
