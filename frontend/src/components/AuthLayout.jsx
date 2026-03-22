import React from 'react';
import { ShieldCheck, MapPin, Award, TrendingUp, Users, Activity, Droplets, Store } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

const AuthLayout = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans relative">
      
      {/* Universal Language Selector for Auth Pages */}
      <div className="absolute top-6 right-6 z-[1001]">
         <LanguageSelector variant="light" />
      </div>

      {/* Left Info Panel */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-[#f0fdf4] p-12 flex-col justify-between border-r border-green-100 relative overflow-hidden" 
        style={{ 
          backgroundImage: 'radial-gradient(#dcfce7 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px' 
        }}
      >
        
        {/* Soft green glow effect behind text */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

        <div className="max-w-xl relative z-10">
          <div className="flex items-center gap-2 text-green-700 font-black text-2xl mb-6 tracking-tight">
            <img src="/favicon.svg" alt="AMRit Logo" className="w-8 h-8 drop-shadow-sm" />
            AMRit
          </div>
          
          <div className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-6 shadow-sm shadow-green-200">
            <ShieldCheck className="w-4 h-4" />
            {t('fightingAmr')}
          </div>
          
          <h1 className="text-[2.75rem] font-extrabold text-[#065f46] mb-4 leading-tight">
            {t('authTitle1')}<br/>{t('authTitle2')}
          </h1>
          
          <p className="text-gray-600 text-sm mb-10 leading-relaxed pr-8">
            {t('authDesc')}
          </p>

          <div className="space-y-4">
            {/* Feature Cards */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-green-50 flex gap-4 items-start">
              <div className="text-green-500 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">{t('whySafe')}</h3>
                <ul className="text-[0.8rem] text-gray-600 space-y-1.5">
                  <li className="flex gap-2 items-start"><span className="text-red-400 font-bold">•</span> {t('whySafe1')}</li>
                  <li className="flex gap-2 items-start"><span className="text-red-400 font-bold">•</span> {t('whySafe2')}</li>
                  <li className="flex gap-2 items-start"><span className="text-red-400 font-bold">•</span> {t('whySafe3')}</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-green-50 flex gap-4 items-center">
              <div className="bg-green-50 p-2.5 rounded-full text-green-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{t('findPharmaciesLoc')}</h3>
                <p className="text-[0.75rem] text-gray-500 mt-0.5">{t('findPharmLocations')}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-green-50 flex gap-4 items-center">
              <div className="bg-green-50 p-2.5 rounded-full text-green-500">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{t('earnRewards')}</h3>
                <p className="text-[0.75rem] text-gray-500 mt-0.5">{t('earnDesc')}</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-green-50 flex gap-4 items-center">
              <div className="bg-green-50 p-2.5 rounded-full text-green-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{t('trackImpact')}</h3>
                <p className="text-[0.75rem] text-gray-500 mt-0.5">{t('trackDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid at Bottom */}
        <div className="grid grid-cols-2 gap-4 mt-8 relative z-10 max-w-xl">
          <div className="bg-white/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <ShieldCheck className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 text-lg">12,000+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('stats1S')}</div>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <Store className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 text-lg">300+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('stats2S')}</div>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <Droplets className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 text-lg">50,000+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('stats3S')}</div>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <Users className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 text-lg">8,500+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('stats4S')}</div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
