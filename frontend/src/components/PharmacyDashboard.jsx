import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../contexts/Authcontext';
import axios from '../api/axios';
import { Package, Clock, CheckCircle2, TrendingUp, Inbox, ShieldCheck, Loader2 } from 'lucide-react';
import PharmacyAuditModal from './PharmacyAuditModal';
import { useTranslation } from 'react-i18next';

const PharmacyDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'accepted', 'completed'
  const [activeAuditRequest, setActiveAuditRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      if (!user) return;
      const res = await axios.get('/disposals/pharmacy');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching pharmacy requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/disposals/${id}/status`, { status: newStatus });
      fetchRequests(); // refresh list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Compute Metrics intelligently
  const metrics = {
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    completed: requests.filter(r => r.status === 'completed').length,
    totalMeds: requests.filter(r => r.status === 'completed').reduce((sum, r) => sum + (r.verifiedMedicines?.length || 0), 0)
  };

  const filteredRequests = requests.filter(r => r.status === activeTab);

  return (
    <DashboardLayout>
      {/* Metrics Row (Full Width spanning 12 cols dynamically) */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-wide">{t('pharmacyDashboard.newReq', {defaultValue: 'New Requests'})}</p>
              <h3 className="text-3xl font-black text-gray-800">{metrics.pending}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-wide">{t('pharmacyDashboard.inProg', {defaultValue: 'In Progress'})}</p>
              <h3 className="text-3xl font-black text-gray-800">{metrics.accepted}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[0.8rem] font-bold text-gray-400 uppercase tracking-wide">{t('pharmacyDashboard.compDisp', {defaultValue: 'Completed'})}</p>
              <h3 className="text-3xl font-black text-gray-800">{metrics.completed}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 shadow-[0_8px_30px_rgb(5,150,105,0.2)] flex flex-col justify-center text-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[0.8rem] font-bold text-green-100 uppercase tracking-wide">{t('pharmacyDashboard.medsRe', {defaultValue: 'Medicine Units Recovered'})}</p>
              <h3 className="text-3xl font-black">{metrics.totalMeds} <span className="text-xl font-medium text-green-200">units</span></h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Inbox View (Full Width 12 cols) */}
      <div className="lg:col-span-12">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 min-h-[30rem] flex flex-col">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-800">{t('pharmacyDashboard.mgmtInbox', {defaultValue: 'Management Inbox'})}</h2>
              <p className="text-sm text-gray-500 font-medium">{t('pharmacyDashboard.mgmtSub', {defaultValue: 'Process and verify incoming disposal packages'})}</p>
            </div>
            
            {/* Custom Tab Switcher */}
            <div className="flex w-full overflow-x-auto custom-scrollbar md:w-auto bg-gray-100 p-1.5 rounded-xl self-start">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`flex-1 md:flex-none whitespace-nowrap px-4 md:px-5 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === 'pending' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t('pharmacyDashboard.pendTab', {defaultValue: 'Pending'})} ({metrics.pending})
              </button>
              <button 
                onClick={() => setActiveTab('accepted')}
                className={`flex-1 md:flex-none whitespace-nowrap px-4 md:px-5 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === 'accepted' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t('pharmacyDashboard.accTab', {defaultValue: 'Accepted'})} ({metrics.accepted})
              </button>
              <button 
                onClick={() => setActiveTab('completed')}
                className={`flex-1 md:flex-none whitespace-nowrap px-4 md:px-5 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === 'completed' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t('pharmacyDashboard.compTab', {defaultValue: 'Completed'})}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Inbox className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-medium text-lg text-gray-400">{t('pharmacyDashboard.noReqFound', {defaultValue: 'No requests found in this category'})}</p>
              </div>
            ) : (
              filteredRequests.map(req => (
                <div key={req._id} className="border border-gray-100 bg-gray-50 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white hover:shadow-lg transition-all hover:border-green-100 group">
                  
                  {/* Left: Package Details (Double-Blind) */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-gray-800 text-[1.1rem]">{t('history.verifiedPkg', {defaultValue: 'Disposal Package'})}</h4>
                      <span className="text-[0.7rem] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                         {req.userMedicines?.length || 0} {t('pharmacyDashboard.claimedItems', {defaultValue: 'claimed items'})}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 text-[0.85rem] text-gray-600 font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500" /> {req.disposalType === 'pickup' ? t('pharmacyDashboard.citizenReq', {defaultValue: 'Citizen Pickup Request'}) : t('pharmacyDashboard.citizenDrop', {defaultValue: 'Citizen Drop-off'})}</span>
                      {req.userId && (
                         <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md"><UserIcon className="w-3.5 h-3.5" /> {req.userId.name}</span>
                      )}
                    </div>
                    {req.disposalType === 'pickup' && req.pickupAddress && (
                        <p className="text-[0.8rem] text-gray-600 mt-4 flex items-start gap-2 p-3 bg-white rounded-xl whitespace-pre-line leading-relaxed border border-gray-200/60 shadow-sm"><span className="text-lg">🗺️</span> <span className="font-medium">{req.pickupAddress}</span></p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                    <span className={`px-4 py-1.5 text-[0.75rem] font-black rounded-lg uppercase tracking-wide w-full text-center
                        ${req.status === 'completed' ? 'bg-green-100 text-green-700' :
                        req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'}`}
                    >
                      {req.status}
                    </span>

                    {activeTab === 'pending' && (
                      <button onClick={() => updateStatus(req._id, 'accepted')} className="w-full text-[0.85rem] font-bold bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-md transition-colors">
                        {t('pharmacyDashboard.acceptReqBtn', {defaultValue: 'Accept Request'})}
                      </button>
                    )}
                    {activeTab === 'accepted' && (
                      <button onClick={() => setActiveAuditRequest(req)} className="w-full text-[0.85rem] font-bold bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] transition-colors flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> {t('pharmacyDashboard.collectResBtn', {defaultValue: 'Collect & Resolve'})}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {activeAuditRequest && (
         <PharmacyAuditModal
            isOpen={true}
            request={activeAuditRequest}
            onClose={() => setActiveAuditRequest(null)}
            onSuccess={() => {
               setActiveAuditRequest(null);
               fetchRequests();
            }}
         />
      )}
    </DashboardLayout>
  );
};

// Simple User icon locally since it wasn't imported from lucide
function UserIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default PharmacyDashboard;
