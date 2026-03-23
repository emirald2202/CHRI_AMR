import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/Authcontext';
import axios from '../api/axios';
import { Package, Clock, ShieldCheck, History, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DisposalHistory = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [expandedReqId, setExpandedReqId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!user) return;
        const endpoint = user?.role === 'pharmacy' ? '/disposals/pharmacy' : '/disposals/user';
        const res = await axios.get(endpoint);
        // Filter out only completed requests for the history ledger
        const historyData = res.data.filter(r => r.status === 'completed');
        setRequests(historyData);
      } catch (err) {
        console.error('Error fetching disposal history', err);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="lg:col-span-12 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
        
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-slate-700 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <h2 className="text-[1.6rem] font-extrabold text-gray-800 dark:text-slate-200 mb-1.5 flex items-center gap-3">
                <History className="w-8 h-8 text-green-600" /> {t('history.ledger', { defaultValue: 'Disposal History Ledger' })}
              </h2>
              <p className="text-[0.85rem] font-medium text-gray-500">{t('history.ledgerSub', { defaultValue: 'A permanent archive of all your successfully processed medicine packages.' })}</p>
            </div>
            <div className="bg-green-50 dark:bg-emerald-900/30 text-green-700 font-black px-6 py-3.5 rounded-xl text-lg whitespace-nowrap shadow-sm border border-green-100 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6" /> {requests.length} {t('history.safeDisposals', { defaultValue: 'Safe Disposals' })}
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-slate-700 p-6 md:p-8 min-h-[30rem]">
          <div className="flex flex-col gap-4">
            {requests.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20 mt-10">
                <Package className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-gray-500 mb-1">{t('history.noCompletedDisposals', { defaultValue: 'No Completed Disposals Yet' })}</h3>
                <p className="font-medium text-sm">{t('history.noCompletedSub', { defaultValue: 'Your verified drop-offs will appear here permanently.' })}</p>
              </div>
            ) : (
              requests.map(req => (
                <div key={req._id} className="border border-green-100 bg-green-50 dark:bg-emerald-900/30/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                  <div className="flex-1 w-full relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <h4 className="font-bold text-gray-800 dark:text-slate-200 text-[1.05rem] md:text-[1.1rem]">{t('history.verifiedPkg', { defaultValue: 'Verified Safe Package' })}</h4>
                       <button onClick={() => setExpandedReqId(expandedReqId === req._id ? null : req._id)} className="w-fit text-xs font-bold text-green-700 bg-white dark:bg-slate-800 hover:bg-green-100 border border-green-200 px-4 py-2 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                          <Package className="w-3.5 h-3.5" />
                          {expandedReqId === req._id ? t('history.closeAudit', { defaultValue: 'Close Audit' }) : `${t('history.viewAudit', { defaultValue: 'View Audit' })} (${req.verifiedMedicines?.length || req.userMedicines?.length || 0})`}
                       </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-[0.85rem] text-gray-600 font-medium">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-green-600" /> {t('history.finishedVia', { defaultValue: 'Finished via' })} {req.disposalType === 'pickup' ? t('disposal.homePickup') : t('disposal.dropOff')}</span>
                      
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-green-600" /> 
                        {req.updatedAt || req.createdAt ? new Date(req.updatedAt || req.createdAt).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        }) : t('history.dateNotAvailable', { defaultValue: 'Date not available' })}
                      </span>

                      {user?.role === 'pharmacy' ? (
                        req.userId && (
                          <span className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-500" /> {t('history.droppedBy', { defaultValue: 'Dropped off by' })}: {req.userId.name || 'Unknown User'}
                          </span>
                        )
                      ) : (
                        req.pharmacyId && (
                          <span className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-500" /> {t('history.processedBy', { defaultValue: 'Processed by' })}: {req.pharmacyId.pharmacyName || req.pharmacyId.name}
                          </span>
                        )
                      )}
                    </div>
                    
                    {/* Expandable Package Details */}
                    {expandedReqId === req._id && (
                       <div className="mt-5 bg-white dark:bg-slate-800 border border-green-200 rounded-2xl p-5 shadow-sm animate-in fade-in zoom-in-95 duration-200 w-full">
                          <h5 className="font-bold text-green-800 text-xs uppercase mb-4 border-b border-green-100 pb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> {t('history.destructionManifest', { defaultValue: 'Certified destruction manifest' })}</h5>
                          <div className="space-y-3">
                             {(req.verifiedMedicines && req.verifiedMedicines.length > 0 ? req.verifiedMedicines : req.userMedicines || []).map((med, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-slate-900/80 p-3.5 rounded-xl border border-gray-100 dark:border-slate-700">
                                   <div>
                                     <p className="text-[0.9rem] font-bold text-gray-800 dark:text-slate-200">{med.medicineName || 'Unknown Medicine'}</p>
                                     <p className="text-[0.7rem] text-gray-500 font-semibold mt-0.5">{med.genericName || 'Manual Entry'} • {med.doseWeight || med.medicineType}</p>
                                   </div>
                                   <div className="text-right">
                                     <span className="text-[0.7rem] font-bold text-gray-600 bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">{t('history.scannedQty', { defaultValue: 'Scanned Qty' })}: {med.remainingQty}/{med.totalQty}</span>
                                     {med.isAntibiotic && <span className="block text-[0.65rem] text-[#f15700] font-black uppercase mt-1.5">{t('history.abNeutralized', { defaultValue: 'Antibiotic Neutralized' })}</span>}
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200 dark:border-gray-700">
                    <span className="px-5 py-2 text-[0.75rem] font-black rounded-xl uppercase tracking-wider bg-green-50 dark:bg-emerald-900/300 text-white shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]">
                      {t('history.destroyedBadge', { defaultValue: 'Destroyed' })}
                    </span>
                    {req.pointsAwarded && (
                       <span className="text-[0.7rem] font-black text-[#f15700] tracking-wider bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-[#f15700]/30 shadow-sm mt-1 whitespace-nowrap">
                         +{req.awardedPoints} {t('history.pointsKept', { defaultValue: 'Points Kept' })}
                       </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DisposalHistory;
