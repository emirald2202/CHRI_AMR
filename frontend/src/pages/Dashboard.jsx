import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const [showTutorial, setShowTutorial] = useState(true);

  const dismissTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <DashboardLayout>
      {/* Full Width Tutorial Box */}
      {showTutorial && (
        <div className="lg:col-span-12 mb-2 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-lg border-l-4 border-l-green-500 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center gap-2">
                {t('didYouKnow')}
              </h3>
              <p className="text-gray-600 text-[0.85rem] leading-relaxed max-w-4xl font-medium">
                {t('tutorialBody')}<br/><br/>
                {t('tutorialClick')} <span className="text-green-600 font-bold">{t('tutorialButton')}</span> {t('tutorialEnd')}
              </p>
            </div>
            <button 
              onClick={dismissTutorial}
              className="shrink-0 text-green-600 font-bold border border-green-600 rounded-lg px-5 py-2 hover:bg-green-50 transition-colors shadow-sm"
            >
              {t('gotIt')}
            </button>
          </div>
        </div>
      )}

      {/* Left Column (70%) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Placeholder: Google Maps Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-96 flex flex-col items-center justify-center text-center">
            <h3 className="text-gray-800 font-bold mb-2">{t('mapsTitle')}</h3>
            <p className="text-sm text-gray-500">{t('mapsSub')}</p>
        </div>
        
        {/* Placeholder: Disposal Status Tracker */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-56 flex flex-col items-center justify-center text-center">
            <h3 className="text-gray-800 font-bold mb-2">{t('trackerTitle')}</h3>
            <p className="text-sm text-gray-500">{t('trackerSub')}</p>
        </div>

      </div>

      {/* Right Column (30%) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Placeholder: Risk Calculator */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-80 flex flex-col items-center justify-center text-center">
            <h3 className="text-gray-800 font-bold mb-2">{t('riskTitle')}</h3>
            <p className="text-sm text-gray-500">{t('riskSub')}</p>
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
