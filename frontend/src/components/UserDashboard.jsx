import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/Authcontext';
import axios from '../api/axios';
import { Calendar, Package, Clock, CheckCircle2 } from 'lucide-react';
import ScheduleModal from './ScheduleModal';

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      if (!user) return;
      const res = await axios.get('/disposals/user');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching disposal requests', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const dismissTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <DashboardLayout>
      {/* Full Width Tutorial Box */}
      {showTutorial && (
        <div className="lg:col-span-12 mb-2 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center gap-2">
                {t('didYouKnow')}
              </h3>
              <p className="text-gray-600 text-[0.85rem] leading-relaxed max-w-4xl font-medium">
                 {t('tutorialBody')}<br /><br />
                 {t('tutorialClick')} <span className="text-green-600 font-bold">{t('tutorialButton')}</span> {t('tutorialEnd')}
              </p>
            </div>
            <button
              onClick={dismissTutorial}
              className="shrink-0 text-green-600 font-bold border border-green-200 bg-green-50 rounded-lg px-5 py-2 hover:bg-green-100 transition-colors shadow-sm"
            >
              {t('gotIt')}
            </button>
          </div>
        </div>
      )}

      {/* Left Column (70%) */}
      <div className="lg:col-span-8 flex flex-col gap-6">

        {/* Dynamic Disposal Status Tracker */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 flex flex-col min-h-[22rem]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-gray-800 font-bold text-lg">{t('trackerTitle')}</h3>
              <p className="text-sm text-gray-500">{t('trackerSub')}</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-xl shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] transition-all flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Schedule Drop-off
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            {requests.length === 0 ? (
              <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
                <Package className="w-12 h-12 mb-3 opacity-30" />
                <p>No active requests found.</p>
              </div>
            ) : (
              requests.map(req => (
                <div key={req._id} className="border border-gray-100 bg-gray-50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-gray-800 text-[1rem]">{req.medicineName} <span className="text-gray-400 font-medium text-[0.85rem] ml-1">({req.doseWeight || 'N/A'})</span></h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-[0.8rem] text-gray-500">
                      <span className="flex items-center gap-1.5"><Package className="w-4 h-4 text-gray-400" /> Qty: {req.quantity}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {req.disposalType === 'pickup' ? 'Pick-up' : 'Drop-off'}</span>
                      {req.pharmacyId && (
                        <span className="font-medium text-green-700 bg-green-100/50 px-2.5 py-1 rounded-md">
                          {req.pharmacyId.pharmacyName || req.pharmacyId.name}
                        </span>
                      )}
                    </div>
                    {req.disposalType === 'pickup' && req.pickupAddress && <p className="text-[0.8rem] text-gray-500 mt-3 flex items-start gap-1 p-2.5 bg-gray-100 rounded-lg whitespace-pre-line leading-relaxed border border-gray-200/60 shadow-inner">📍 {req.pickupAddress}</p>}
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 text-[0.75rem] font-bold rounded-lg uppercase tracking-wide
                        ${req.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                        req.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          'bg-blue-100 text-blue-700 border border-blue-200'}`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Schedule Modal */}
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { fetchRequests(); setIsModalOpen(false); }}
        />

        {/* Google Maps Integration */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-gray-800 font-bold text-lg">{t('googleMapsIntegration')}</h3>
              <p className="text-sm text-gray-500">Find nearby pharmacies on Google Maps</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-8 border flex items-center justify-center min-h-[200px]">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">Google Maps Integration</p>
              <p className="text-sm">Coming Soon</p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column (30%) */}
      <div className="lg:col-span-4 flex flex-col gap-6">

        {/* Placeholder: Risk Calculator */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 h-80 flex flex-col items-center justify-center text-center">
          <h3 className="text-gray-800 font-bold mb-2 text-lg">{t('riskTitle')}</h3>
          <p className="text-sm text-gray-500">{t('riskSub')}</p>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
