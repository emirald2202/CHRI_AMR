import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/Authcontext';
import axios from '../api/axios';
import { Calendar, Package, Clock, CheckCircle2 } from 'lucide-react';
import ScheduleModal from '../components/ScheduleModal';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch requests on load
  const fetchRequests = async () => {
    try {
      if (!user) return;
      const endpoint = user.role === 'pharmacy' ? '/disposals/pharmacy' : '/disposals/user';
      const res = await axios.get(endpoint);
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching disposal requests', err);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, [user]);

  const dismissTutorial = () => {
    setShowTutorial(false);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/disposals/${id}/status`, { status: newStatus });
      fetchRequests(); // refresh list
    } catch (err) {
      alert("Failed to update status");
    }
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
                {t('tutorialBody')}<br /><br />
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

        {/* Dynamic Disposal Status Tracker */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col min-h-[22rem]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-gray-800 font-bold text-lg">{t('trackerTitle')}</h3>
              <p className="text-sm text-gray-500">{t('trackerSub')}</p>
            </div>
            {user?.role === 'user' && (
              <button onClick={() => setIsModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition-colors text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Schedule Drop-off
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            {requests.length === 0 ? (
              <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
                <Package className="w-12 h-12 mb-3 opacity-30" />
                <p>No active requests found.</p>
              </div>
            ) : (
              requests.map(req => (
                <div key={req._id} className="border border-gray-100 bg-gray-50 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-800 text-[0.95rem]">{req.medicineName} <span className="text-gray-400 font-medium text-[0.8rem] ml-1">({req.doseWeight || 'N/A'})</span></h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[0.8rem] text-gray-500">
                      <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Qty: {req.quantity}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {req.disposalType === 'pickup' ? 'Pick-up' : 'Drop-off'}</span>
                      {user?.role === 'user' && req.pharmacyId && (
                        <span className="font-medium text-green-700 bg-green-100/50 px-2 py-0.5 rounded-md">
                          {req.pharmacyId.pharmacyName || req.pharmacyId.name}
                        </span>
                      )}
                      {user?.role === 'pharmacy' && req.userId && (
                        <span className="font-medium text-blue-700 bg-blue-100/50 px-2 py-0.5 rounded-md">
                          From: {req.userId.name}
                        </span>
                      )}
                    </div>
                    {req.disposalType === 'pickup' && req.pickupAddress && <p className="text-[0.75rem] text-gray-400 mt-2 flex items-start gap-1 p-2 bg-gray-100/50 rounded-lg whitespace-pre-line leading-relaxed">📍 {req.pickupAddress}</p>}
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[0.75rem] font-bold rounded-lg uppercase tracking-wide
                        ${req.status === 'completed' ? 'bg-green-100 text-green-700' :
                        req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'}`}
                    >
                      {req.status}
                    </span>

                    {/* Pharmacy Action Buttons */}
                    {user?.role === 'pharmacy' && req.status === 'pending' && (
                      <button onClick={() => updateStatus(req._id, 'accepted')} className="text-sm font-semibold bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 shadow-sm">
                        Accept
                      </button>
                    )}
                    {user?.role === 'pharmacy' && req.status !== 'pending' && req.status !== 'completed' && (
                      <button onClick={() => updateStatus(req._id, 'completed')} className="text-sm font-semibold bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 shadow-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Complete
                      </button>
                    )}
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
