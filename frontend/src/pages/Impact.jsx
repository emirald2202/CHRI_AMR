import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ShieldAlert, MapPin, AlertCircle, Database, Leaf, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Impact = () => {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <div className="lg:col-span-12 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
        
        {/* Hero Header */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 font-extrabold text-[0.65rem] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-red-100 mb-5">
                <AlertTriangle className="w-4 h-4" /> {t('impact.priorityWarning')}
              </div>
              <h2 className="text-[2rem] font-black text-gray-800 mb-3 tracking-tight leading-tight md:max-w-3xl">
                {t('impact.headingMain')} <span className="text-red-600">{t('impact.maha')}</span>
              </h2>
              <p className="text-[1.05rem] font-medium text-gray-500 leading-relaxed md:max-w-3xl">
                {t('impact.heroDesc')}
              </p>
            </div>
            <div className="hidden lg:flex w-24 h-24 bg-red-50 rounded-full items-center justify-center shrink-0 border border-red-100">
               <ShieldAlert className="w-10 h-10 text-red-600" />
            </div>
        </div>

        {/* The Crisis */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">
           <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <MapPin className="w-6 h-6 text-[#f15700]" />
              <h3 className="text-xl font-bold text-gray-800">{t('impact.crisisHeading')}</h3>
           </div>
           
           <div className="bg-[#f15700]/5 border border-[#f15700]/20 rounded-2xl p-6 mb-6">
              <h4 className="font-black text-[#f15700] text-lg">{t('impact.crisisHighlight')}</h4>
           </div>

           <ul className="space-y-4 text-[0.95rem] text-gray-600 font-medium">
              <li className="flex items-start gap-4">
                 <div className="mt-1 w-2 h-2 rounded-full bg-gray-400 shrink-0"></div>
                 <div>
                    {t('impact.crisisBullet1')}
                    <div className="text-[0.7rem] font-bold text-gray-400 mt-1 uppercase tracking-wider block">{t('impact.sourceNcdc')}</div>
                 </div>
              </li>
              <li className="flex items-start gap-4">
                 <div className="mt-1 w-2 h-2 rounded-full bg-gray-400 shrink-0"></div>
                 <div>
                    {t('impact.crisisBullet2')}
                    <div className="text-[0.7rem] font-bold text-gray-400 mt-1 uppercase tracking-wider block">{t('impact.sourceIcmrAmrsn')}</div>
                 </div>
              </li>
           </ul>
        </div>
        
        {/* Hospital Data */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10">
           <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">{t('impact.dataHeading')}</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                 <div className="text-xs font-black text-blue-600 mb-2 uppercase tracking-widest">{t('impact.klebTitle')}</div>
                 <p className="text-sm text-gray-700 font-medium mb-3">{t('impact.klebDesc')}</p>
                 <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest block">{t('impact.sourceIcmr2021')}</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                 <div className="text-xs font-black text-blue-600 mb-2 uppercase tracking-widest">{t('impact.ecoliTitle')}</div>
                 <p className="text-sm text-gray-700 font-medium mb-3">{t('impact.ecoliDesc')}</p>
                 <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest block">{t('impact.sourceIcmr2021')}</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                 <div className="text-xs font-black text-blue-600 mb-2 uppercase tracking-widest">{t('impact.vectorTitle')}</div>
                 <p className="text-sm text-gray-700 font-medium mb-3">{t('impact.vectorDesc')}</p>
                 <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest block">{t('impact.sourceLancet')}</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                 <div className="text-xs font-black text-blue-600 mb-2 uppercase tracking-widest">{t('impact.advRes')}</div>
                 <p className="text-sm text-gray-700 font-medium mb-3">{t('impact.advResDesc')}</p>
                 <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest block">{t('impact.sourceBioSpectrum')}</span>
              </div>
           </div>
        </div>

        {/* Vulnerability factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Vulnerability */}
           <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                 <AlertCircle className="w-6 h-6 text-amber-500" />
                 <h3 className="text-xl font-bold text-gray-800">{t('impact.whyVul')}</h3>
              </div>
              <ul className="space-y-5 text-[0.95rem] text-gray-600 font-medium flex-1">
                 <li className="flex gap-4">
                    <span className="font-bold text-amber-500">•</span>
                    <span>{t('impact.vul1')}</span>
                 </li>
                 <li className="flex gap-4">
                    <span className="font-bold text-amber-500">•</span>
                    <div>
                       <p className="mb-1">{t('impact.vul2')}</p>
                       <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">{t('impact.sourceJac')}</span>
                    </div>
                 </li>
                 <li className="flex gap-4">
                    <span className="font-bold text-amber-500">•</span>
                    <div>
                       <p className="mb-1">{t('impact.vul3')}</p>
                       <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">{t('impact.sourceScienceDirect')}</span>
                    </div>
                 </li>
              </ul>
           </div>
           
           {/* Disposal */}
           <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 flex flex-col">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                 <Leaf className="w-6 h-6 text-green-600" />
                 <h3 className="text-xl font-bold text-gray-800">{t('impact.dispProb')}</h3>
              </div>
              <div className="bg-green-50/50 rounded-2xl p-5 mb-5 border border-green-100">
                 <p className="text-sm text-green-800 font-semibold leading-relaxed">
                    {t('impact.dispDesc')}
                 </p>
              </div>
              <ul className="space-y-4 text-[0.95rem] text-gray-600 font-medium flex-1">
                 <li className="flex gap-4">
                    <span className="font-bold text-green-600">1.</span>
                    <div>
                       <p className="mb-1">{t('impact.disp1')}</p>
                       <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">{t('impact.sourceFrontiers')}</span>
                    </div>
                 </li>
                 <li className="flex gap-4">
                    <span className="font-bold text-green-600">2.</span>
                    <div>
                       <p className="mb-1">{t('impact.disp2')}</p>
                       <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider">{t('impact.sourceIcmr2022')}</span>
                    </div>
                 </li>
              </ul>
           </div>
        </div>

        {/* Conclusion / CTA */}
        <div className="bg-[#059669] rounded-3xl shadow-[0_8px_30px_rgb(5,150,105,0.3)] p-8 md:p-12 text-center text-white flex flex-col items-center">
           <h3 className="text-3xl font-black mb-4">{t('impact.whatMeans')}</h3>
           <p className="text-green-100 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-6">
              {t('impact.means1')}
           </p>
           <div className="bg-white/10 border border-white/20 p-6 rounded-2xl max-w-3xl">
              <p className="font-bold text-sm md:text-base leading-relaxed">
                 {t('impact.means2')}
              </p>
           </div>
        </div>

        {/* References */}
        <div className="mt-8 mb-4 px-4 md:px-8">
           <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4"><LinkIcon className="w-4 h-4"/> Certified Sources & Indices</h4>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-500 font-medium">
              <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                 <strong className="text-gray-800 block mb-0.5">NCDC India</strong>
                 NARS-Net Annual Report 2022
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                 <strong className="text-gray-800 block mb-0.5">ICMR AMRSN</strong>
                 Surveillance Network Registry
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                 <strong className="text-gray-800 block mb-0.5">ICMR Annual Report</strong>
                 AMR Annual Report 2021
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                 <strong className="text-gray-800 block mb-0.5">The Lancet Regional Health</strong>
                 Southeast Asia (May 2024)
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                 <strong className="text-gray-800 block mb-0.5">Oxford Academic</strong>
                 Journal of Antimicrobial Chemotherapy
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                 <strong className="text-gray-800 block mb-0.5">PMC</strong>
                 Clinical Infectious Diseases (2019)
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                 <strong className="text-gray-800 block mb-0.5">Frontiers in Antibiotics</strong>
                 January 2026 Publication
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                 <strong className="text-gray-800 block mb-0.5">BioSpectrum India</strong>
                 ICMR SBI-CREP-01 Study Focus
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Impact;
