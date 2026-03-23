import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/Authcontext';
import axios from '../api/axios';
import { Calendar, Package, Clock, CheckCircle2, Navigation } from 'lucide-react';
import ScheduleModal from './ScheduleModal';
import Chatbot from './Chatbot';
import PharmacyMap from './PharmacyMap';

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user, syncUser } = useAuth();
  const [showTutorial, setShowTutorial] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedReqId, setExpandedReqId] = useState(null);
  
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedMapPharmacy, setSelectedMapPharmacy] = useState(null);
  const [mapFocusRegion, setMapFocusRegion] = useState(null);

  const fetchRequests = async () => {
    try {
      if (!user) return;
      const res = await axios.get('/disposals/user');
      // Only keep requests that are actively 'pending' or 'accepted'
      const activeRequests = res.data.filter(r => r.status !== 'completed');
      setRequests(activeRequests);
      if (syncUser) syncUser(); // Refresh the user's global Points counter
    } catch (err) {
      console.error('Error fetching disposal requests', err);
    }
  };

  const fetchPharmacies = async () => {
    try {
      const res = await axios.get('/users/pharmacies');
      
      const cityCoordinates = {
        "Mumbai": [19.0760, 72.8777], "Delhi": [28.7041, 77.1025], "Bengaluru": [12.9716, 77.5946],
        "Hyderabad": [17.3850, 78.4867], "Chennai": [13.0827, 80.2707], "Kolkata": [22.5726, 88.3639],
        "Pune": [18.5204, 73.8567], "Ahmedabad": [23.0225, 72.5714], "Jaipur": [26.9124, 75.7873]
      };

      // Dummy data mathematically randomized deterministically to securely lock coordinates
      const processed = res.data.map(p => {
         if (!p.coordinates || !p.coordinates.lat) {
            const nameStr = p.pharmacyName || p.name || 'Unknown';
            const latOffset = ((nameStr.charCodeAt(0) || 0) % 15 - 7) * 0.01;
            const lngOffset = ((nameStr.charCodeAt(1) || 0) % 15 - 7) * 0.01;
            
            const baseCoords = cityCoordinates[p.location] || [18.5204, 73.8567];
            return {
               ...p,
               coordinates: {
                  lat: baseCoords[0] + latOffset,
                  lng: baseCoords[1] + lngOffset
               }
            }
         }
         return p;
      });

      // Strictly isolate map markers to the User's current registered City
      const localPharmacies = processed.filter(p => {
         const pLoc = (p.location || p.address?.city || '').toLowerCase();
         // Handle legacy accounts that stored "Area, City"
         const uLocRaw = user?.location || '';
         const uLocParts = uLocRaw.split(',').map(s => s.trim());
         const uLoc = (uLocParts.length > 1 ? uLocParts[uLocParts.length - 1] : uLocRaw).toLowerCase();
         
         return pLoc === uLoc || uLoc === ''; 
      });

      setPharmacies(localPharmacies);
    } catch (err) { }
  };

  useEffect(() => {
    fetchRequests();
    fetchPharmacies();
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
                {t('landing.pharmacyTutorial.title')}
              </h3>
              <p className="text-gray-600 text-[0.85rem] leading-relaxed max-w-4xl font-medium">
                 {t('landing.pharmacyTutorial.description')}<br /><br />
                 {t('landing.pharmacyTutorial.tutorialClick', {defaultValue: 'Click the'})} <span className="text-green-600 font-bold">{t('landing.pharmacyTutorial.tutorialButton', {defaultValue: 'Find Pharmacies'})}</span> {t('landing.pharmacyTutorial.hint')}
              </p>
            </div>
            <button
              onClick={dismissTutorial}
              className="shrink-0 text-green-600 font-bold border border-green-200 bg-green-50 rounded-lg px-5 py-2 hover:bg-green-100 transition-colors shadow-sm"
            >
              {t('landing.pharmacyTutorial.gotIt')}
            </button>
          </div>
        </div>
      )}

      {/* Left Column (70%) */}
      <div className="lg:col-span-8 flex flex-col gap-6">

        {/* OpenStreetMap Integration */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 sm:p-6 md:p-8 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 md:mb-6 gap-2">
            <div>
              <h3 className="text-gray-800 font-bold text-lg">{t('dashboard.nearbyHubs')}</h3>
              <p className="text-sm text-gray-500">{t('dashboard.mapDescription')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {/* Map Container */}
            <div className="md:col-span-2 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 h-[260px] sm:h-[320px] md:h-[380px] relative z-10 shadow-inner">
               {user && (
                  <PharmacyMap 
                     pharmacies={pharmacies} 
                     userCity={user.location} 
                     focusRegion={mapFocusRegion}
                     onPharmacyClick={(p) => {
                       setSelectedMapPharmacy(p);
                       setIsModalOpen(true);
                     }} 
                  />
               )}
            </div>
            {/* Action List */}
            <div className="h-[280px] md:h-[380px] overflow-y-auto space-y-3 pr-2 border border-gray-100 p-3 rounded-2xl bg-gray-50/50 shadow-inner custom-scrollbar">
               {pharmacies.length > 0 ? pharmacies.map(p => (
                  <div 
                     key={p._id} 
                     onClick={() => setMapFocusRegion([p.coordinates.lat, p.coordinates.lng])}
                     className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-green-300 hover:shadow-md transition-all group cursor-pointer"
                  >
                     <h4 className="font-extrabold text-gray-800 text-sm group-hover:text-green-700 transition-colors">{p.pharmacyName || p.name}</h4>
                     <p className="text-[0.65rem] text-gray-500 mt-1 mb-3 leading-tight truncate">{p.address ? `${p.address.street || ''}, ${p.address.city || ''}` : p.location}</p>
                     <button onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMapPharmacy(p);
                        setIsModalOpen(true);
                     }} className="w-full text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                        <Navigation className="w-3.5 h-3.5" /> {t('dashboard.bookHere')}
                     </button>
                  </div>
               )) : (
                  <div className="text-center py-8 px-4 text-gray-500 text-[0.85rem] font-bold">
                     {t('dashboard.findPharmacies.noResults')} {
                       user?.location ? user.location.split(',').pop().trim() : t('dashboard.yourArea', {defaultValue: 'your area'})
                     }.
                  </div>
               )}
            </div>
          </div>
        </div>

         {/* Mobile Primary Call to Action */}
        <button onClick={() => setIsModalOpen(true)} className="lg:hidden bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-3xl shadow-[0_8px_30px_rgb(5,150,105,0.3)] hover:shadow-[0_8px_30px_rgb(5,150,105,0.5)] transition-all flex flex-col items-center justify-center gap-2 border border-green-500/50 group w-full">
          <div className="flex items-center gap-2 text-xl tracking-tight">
             <Package className="w-6 h-6 group-hover:scale-110 transition-transform" /> {t('dashboard.scheduleDisposal')}
          </div>
          <p className="text-green-100 text-xs font-semibold max-w-[80%] text-center opacity-90">{t('dashboard.scheduleDescription')}</p>
        </button>

        {/* Dynamic Disposal Status Tracker */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 sm:p-6 md:p-8 flex flex-col min-h-[22rem]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 md:mb-6 gap-4">
            <div>
              <h3 className="text-gray-800 font-bold text-lg">{t('dashboard.disposalTracker')}</h3>
              <p className="text-sm text-gray-500">{t('dashboard.trackerDescription')}</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            {requests.length === 0 ? (
              <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
                <Package className="w-12 h-12 mb-3 opacity-30" />
                <p>No active or pending requests found.</p>
              </div>
            ) : (
              requests.map(req => (
                <div key={req._id} className="border border-gray-100 bg-gray-50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex-1 w-full relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <h4 className="font-bold text-gray-800 text-[1.05rem] md:text-[1.1rem]">Disposal Package</h4>
                       <button onClick={() => setExpandedReqId(expandedReqId === req._id ? null : req._id)} className="w-fit text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-full transition-colors flex items-center justify-center gap-1.5">
                          <Package className="w-3.5 h-3.5" />
                          {expandedReqId === req._id ? 'Close Details' : `View Package (${req.userMedicines?.length || 0})`}
                       </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-[0.85rem] text-gray-500">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> {req.disposalType === 'pickup' ? 'Home Pick-up' : 'Center Drop-off'}</span>
                      {req.pharmacyId && (
                        <span className="font-medium text-green-800 bg-green-100/50 px-2.5 py-1 rounded-md border border-green-200/50">
                          To: {req.pharmacyId.pharmacyName || req.pharmacyId.name}
                        </span>
                      )}
                    </div>
                    {req.disposalType === 'pickup' && req.pickupAddress && <p className="text-[0.8rem] text-gray-500 mt-3 flex items-start gap-1 p-2.5 bg-white rounded-lg whitespace-pre-line leading-relaxed border border-gray-200 shadow-sm">📍 {req.pickupAddress}</p>}

                    {/* Expandable Package Details */}
                    {expandedReqId === req._id && (
                       <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-in fade-in zoom-in-95 duration-200 w-full">
                          <h5 className="font-bold text-gray-800 text-xs uppercase mb-3 border-b border-gray-100 pb-2">Sealed Request Contents</h5>
                          <div className="space-y-2">
                             {(req.userMedicines || []).map((med, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                   <div>
                                     <p className="text-[0.85rem] font-bold text-gray-800">{med.medicineName || 'Unknown Medicine'}</p>
                                     <p className="text-[0.7rem] text-gray-500 font-medium">{med.genericName || 'Manual Entry'} • {med.doseWeight || med.medicineType}</p>
                                   </div>
                                   <div className="text-right">
                                     <span className="text-[0.7rem] font-bold text-gray-600 bg-gray-200/50 px-2 py-1 rounded-md border border-gray-200">Qty: {med.remainingQty}/{med.totalQty}</span>
                                     {med.isAntibiotic && <span className="block text-[0.65rem] text-[#f15700] font-bold uppercase mt-1">Antibiotic</span>}
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-200">
                    <span className={`px-4 py-1.5 md:py-2 text-[0.7rem] md:text-[0.75rem] font-bold rounded-lg uppercase tracking-wide
                        ${req.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm' :
                        req.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm' :
                          'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm'}`}
                    >
                      {req.status}
                    </span>
                    {req.status === 'completed' && req.pointsAwarded && (
                       <span className="text-[0.65rem] font-black text-[#f15700] uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100 whitespace-nowrap">
                         +{req.awardedPoints} Points Issued
                       </span>
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
          onClose={() => { setIsModalOpen(false); setSelectedMapPharmacy(null); }}
          onSuccess={() => { fetchRequests(); setIsModalOpen(false); setSelectedMapPharmacy(null); }}
          preselectedPharmacy={selectedMapPharmacy}
        />

      </div>

      {/* Right Column (30%) */}
      <div className="lg:col-span-4 flex flex-col gap-6">

        {/* AMR Education Link Widget */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 flex flex-col items-start justify-between relative overflow-hidden group min-h-[16rem]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl group-hover:bg-green-100 transition-all duration-700"></div>
          
          <div className="relative z-10 w-full">
             <div className="bg-red-50 text-red-600 font-extrabold text-[0.65rem] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-red-100 w-max mb-4">
               {t('dashboard.amrCard.badge')}
             </div>
             <h3 className="text-green-700 font-black mb-3 text-2xl leading-tight text-balance">
                 <span dangerouslySetInnerHTML={{ __html: t('dashboard.amrCard.amrHeader', {defaultValue: "What is AMR <br/><span class='text-green-600 text-[1.05rem] opacity-90'>& Why is Maharashtra at Risk?</span>"}) }}></span>
             </h3>
             <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {t('dashboard.amrCard.description')}
             </p>
          </div>
          
          <a href="/impact" className="relative z-10 mt-6 w-full text-center bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-bold text-sm py-3.5 rounded-xl transition-all duration-300">
             {t('dashboard.amrCard.readReport')}
          </a>
        </div>

        {/* Primary Call to Action */}
        <button onClick={() => setIsModalOpen(true)} className="hidden lg:flex bg-green-600 hover:bg-green-700 text-white font-bold py-5 rounded-3xl shadow-[0_8px_30px_rgb(5,150,105,0.3)] hover:shadow-[0_8px_30px_rgb(5,150,105,0.5)] transition-all flex-col items-center justify-center gap-2 border border-green-500/50 group">
          <div className="flex items-center gap-2 text-xl tracking-tight">
             <Package className="w-6 h-6 group-hover:scale-110 transition-transform" /> {t('dashboard.scheduleDisposal')}
          </div>
          <p className="text-green-100 text-xs font-semibold max-w-[80%] text-center opacity-90">{t('dashboard.scheduleDescription')}</p>
        </button>

      </div>
      <Chatbot />
    </DashboardLayout>
  );
};

export default UserDashboard;
