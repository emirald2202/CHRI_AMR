import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, AlertCircle, ArrowLeft, Search, CheckCircle2, PackagePlus, ShieldCheck } from 'lucide-react';
import axios from '../api/axios';
import { searchMedicineAPI } from '../api/medicineAPI';

const PharmacyAuditModal = ({ isOpen, onClose, onSuccess, request }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [autofilled, setAutofilled] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  const [medicineData, setMedicineData] = useState({
    medicineName: '',
    genericName: '',
    medicineType: 'tablet',
    doseWeight: '',
    manufacturer: '',
    isAntibiotic: false,
    remainingQty: '',
    totalQty: '',
    fullMRP: '',
    reason: 'Verified by Pharmacy'
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCart([]);
      clearMedicineForm();
    }
  }, [isOpen]);

  const clearMedicineForm = () => {
    setMedicineData({
      medicineName: '', genericName: '', medicineType: 'tablet',
      doseWeight: '', manufacturer: '', isAntibiotic: false, remainingQty: '',
      totalQty: '', fullMRP: '', reason: 'Verified by Pharmacy'
    });
    setAutofilled(false);
    setManualOverride(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (medicineData.medicineName.length >= 3 && !autofilled) {
        setIsSearching(true);
        searchMedicineAPI(medicineData.medicineName).then(results => {
          setSuggestions(results || []);
          setShowSuggestions(true);
          setIsSearching(false);
        });
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [medicineData.medicineName, autofilled]);

  const selectMedicine = (med) => {
    setMedicineData(prev => ({
      ...prev,
      medicineName: med.brandName || '',
      genericName: med.genericName || '',
      medicineType: med.medicineType || '',
      doseWeight: med.doseWeight || '',
      manufacturer: med.manufacturer || '',
      isAntibiotic: med.isAntibiotic || false,
      fullMRP: med.fullMRP !== undefined ? med.fullMRP : '',
      totalQty: med.stripSize !== undefined ? med.stripSize.toString() : prev.totalQty
    }));
    
    if (med.source === 'local') {
      setAutofilled(true);
      setManualOverride(false);
    } else {
      setAutofilled(false);
      setManualOverride(true);
    }
    setShowSuggestions(false);
  };

  const remainingPercent = (medicineData.remainingQty && medicineData.totalQty && Number(medicineData.totalQty) > 0) 
    ? Math.min(100, (Number(medicineData.remainingQty) / Number(medicineData.totalQty)) * 100) 
    : 0;

  const remainingMRP = (medicineData.fullMRP && medicineData.remainingQty && medicineData.totalQty) 
    ? Math.floor(Number(medicineData.fullMRP) * (Number(medicineData.remainingQty) / Number(medicineData.totalQty)))
    : 0;

  const handleAddToCart = () => {
    if (!medicineData.medicineName || !medicineData.remainingQty || !medicineData.totalQty) {
      alert("Please fill all required medicine fields before adding to physical audit package.");
      return false;
    }
    if (Number(medicineData.remainingQty) > Number(medicineData.totalQty)) {
      alert("Remaining quantity cannot be greater than total strip size!");
      return false;
    }

    const newItem = {
      ...medicineData,
      remainingQty: Number(medicineData.remainingQty),
      totalQty: Number(medicineData.totalQty),
      remainingPercent,
      remainingMRP,
      quantity: `${medicineData.remainingQty}/${medicineData.totalQty}`
    };

    setCart(prev => [...prev, newItem]);
    clearMedicineForm();
    return true;
  };

  const handleReviewProceed = (e) => {
    e.preventDefault();
    
    let finalCart = [...cart];
    
    if (medicineData.medicineName) {
      if (!medicineData.remainingQty || !medicineData.totalQty) {
        return alert("Please fill all required medicine fields before augmenting physical audit.");
      }
      if (Number(medicineData.remainingQty) > Number(medicineData.totalQty)) {
        return alert("Remaining quantity cannot be greater than total strip size!");
      }
      const newItem = {
        ...medicineData,
        remainingQty: Number(medicineData.remainingQty),
        totalQty: Number(medicineData.totalQty),
        remainingPercent,
        remainingMRP,
        quantity: `${medicineData.remainingQty}/${medicineData.totalQty}`
      };
      finalCart.push(newItem);
      setCart(finalCart);
      clearMedicineForm();
    } else if (finalCart.length === 0) {
      return alert("Please catalog at least one physically received medicine to complete verification.");
    }

    // --- STRICT CROSSCHECK (FRONTEND) ---
    const userMeds = request?.userMedicines || [];
    if (userMeds.length !== finalCart.length) {
       return alert(`Audit Discrepancy: The logged package does not identically match the expected inventory. Please inspect the package again.`);
    }

    for (let i = 0; i < userMeds.length; i++) {
        const expected = userMeds[i];
        const logged = finalCart.find(m => m.medicineName.toLowerCase() === expected.medicineName.toLowerCase());
        
        if (!logged || Number(logged.remainingQty) !== Number(expected.remainingQty)) {
           return alert(`Audit Discrepancy: The logged package does not identically match the expected inventory. Please inspect the package again.`);
        }
    }

    setStep(2);
  };

  const submitVerification = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/disposals/${request._id}/status`, { 
         status: 'completed',
         verifiedMedicines: cart
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error finalizing verification');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-end sm:items-center sm:p-4">
      <div className="bg-white dark:bg-slate-800 w-full sm:max-w-[600px] rounded-t-3xl sm:rounded-3xl relative shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden border-[6px] border-blue-500">
        
        <div className="sticky top-0 bg-white dark:bg-slate-800 z-20 px-8 py-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && (
               <button type="button" onClick={() => setStep(step - 1)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
               </button>
            )}
            <div className="flex items-center gap-2 text-blue-800">
               <ShieldCheck className="w-6 h-6"/>
               <h2 className="text-xl font-extrabold">
                 {step === 1 ? 'Double-Blind Physical Audit' : 'Confirm Verified Inventory'}
               </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-slate-900 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              
              <div className="bg-blue-50 text-blue-800 text-[0.85rem] p-4 rounded-xl border border-blue-100 font-medium">
                 <strong className="block mb-1">Strict Independent Audit Rules:</strong>
                 You must independently list every medicine actually received in the physical package without knowing what the user claimed. This secures the ledger against point-fraud.
              </div>

              {/* Medicine Details Group */}
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl relative shadow-inner">
                <div className="flex items-center justify-between mb-3">
                   <label className="block text-[0.8rem] font-bold text-gray-600 uppercase tracking-wider">Catalogue Item</label>
                   {cart.length > 0 && (
                      <button type="button" onClick={() => setShowCartPreview(!showCartPreview)} className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-200 transition-colors flex items-center gap-1 shadow-sm">
                         <PackagePlus className="w-3.5 h-3.5"/> {showCartPreview ? 'Hide Active Audit' : `View Active Audit (${cart.length})`}
                      </button>
                   )}
                </div>

                {showCartPreview && cart.length > 0 && (
                    <div className="mb-4 bg-white dark:bg-slate-800 border border-blue-200 rounded-xl p-3 shadow-inner">
                       <h5 className="font-bold text-gray-700 dark:text-gray-300 text-[0.7rem] uppercase mb-2">Physically Logged Items</h5>
                       <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                         {cart.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-slate-900 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700">
                               <div>
                                 <p className="text-[0.8rem] font-bold text-gray-800 dark:text-slate-200">{item.medicineName}</p>
                                 <p className="text-[0.65rem] text-gray-500 font-medium">Qty: {item.remainingQty}/{item.totalQty}</p>
                               </div>
                               <button type="button" onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition-colors">
                                 <X className="w-4 h-4"/>
                               </button>
                            </div>
                         ))}
                       </div>
                    </div>
                )}
                
                <div className="relative z-10">
                  <div className="relative">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                    <input 
                      type="text" 
                      placeholder="Scan/Type physical medicine name..." 
                      value={medicineData.medicineName} 
                      onChange={(e) => {
                        setMedicineData({...medicineData, medicineName: e.target.value});
                        if (autofilled) setAutofilled(false);
                      }} 
                      onFocus={() => {if (suggestions.length > 0) setShowSuggestions(true)}}
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold" 
                    />
                  </div>

                  {showSuggestions && !autofilled && (
                    <div className="absolute w-full mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden">
                      {suggestions.length > 0 ? suggestions.map((med, i) => (
                        <button type="button" key={i} onClick={() => selectMedicine(med)} className="w-full text-left px-5 py-3 hover:bg-blue-50 border-b border-gray-50 transition-colors flex flex-col last:border-0">
                          <span className="font-bold text-gray-800 dark:text-slate-200 text-sm">{med.brandName}</span>
                          <span className="text-xs text-gray-500 font-medium truncate w-full">{med.genericName} • {med.doseWeight || med.dose}</span>
                        </button>
                      )) : (
                        medicineData.medicineName.length >= 3 && !isSearching && (
                          <div className="px-5 py-4 text-center">
                            <p className="text-[0.8rem] text-gray-600 font-medium mb-2">Not in static DB. Log manually.</p>
                            <button type="button" onClick={() => {setAutofilled(false); setManualOverride(true); setShowSuggestions(false);}} className="text-xs font-bold text-blue-600 bg-blue-50 py-1.5 px-3 rounded text-center w-full">Input Manually</button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {autofilled && (
                  <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl shadow-sm relative overflow-hidden">
                     <div className="flex items-center gap-2 mb-3">
                       <CheckCircle2 className="w-5 h-5 text-blue-500" />
                       <h4 className="font-bold text-blue-900 text-sm">{medicineData.medicineName}</h4>
                     </div>
                     <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                       <div className="flex flex-col gap-1">
                          <span className="text-[0.65rem] uppercase font-bold text-gray-400 tracking-wider">Type</span>
                          <span className="bg-white dark:bg-slate-800 text-blue-800 text-xs font-semibold rounded px-2.5 py-1 w-max border border-blue-100">{medicineData.medicineType}</span>
                       </div>
                       {medicineData.isAntibiotic && (
                         <div className="flex flex-col gap-1">
                            <span className="text-[0.65rem] uppercase font-bold text-gray-400 tracking-wider">Warning</span>
                            <span className="bg-red-50 text-red-600 text-xs font-bold rounded px-2.5 py-1 w-max border border-red-100 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Antibiotic</span>
                         </div>
                       )}
                     </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {manualOverride && (
                    <>
                      <input required type="text" placeholder="Type (e.g. Tablet)" value={medicineData.medicineType} onChange={(e) => setMedicineData({...medicineData, medicineType: e.target.value})} className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 rounded-lg text-sm outline-none" />
                      <input required type="text" placeholder="Manufacturer (e.g. GSK)" value={medicineData.manufacturer} onChange={(e) => setMedicineData({...medicineData, manufacturer: e.target.value})} className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 rounded-lg text-sm outline-none" />
                      <div className="col-span-2 flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-gray-300 rounded-lg mb-1">
                         <div className="flex items-center gap-2">
                           <ShieldAlert className={`w-4 h-4 ${medicineData.isAntibiotic ? 'text-red-500' : 'text-gray-400'}`} />
                           <label htmlFor="antiType" className="text-sm font-bold text-gray-700 dark:text-gray-300">Antibiotic Specimen?</label>
                         </div>
                         <input type="checkbox" id="antiType" checked={medicineData.isAntibiotic} onChange={(e) => setMedicineData({...medicineData, isAntibiotic: e.target.checked})} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                      </div>
                    </>
                  )}
                  <input required type="text" placeholder="Verify Dose (e.g. 500mg)" value={medicineData.doseWeight} onChange={(e) => setMedicineData({...medicineData, doseWeight: e.target.value})} className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 rounded-lg text-sm outline-none ${!manualOverride ? 'col-span-2' : 'col-span-2'}`} />
                  <div className="col-span-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">₹</span>
                    <input type="number" required min="0" placeholder="Full Pack MRP on Label" value={medicineData.fullMRP} onChange={(e) => setMedicineData({...medicineData, fullMRP: e.target.value})} className="w-full pl-8 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 rounded-lg text-sm outline-none" />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-[0.75rem] font-bold text-gray-600 mb-2 uppercase tracking-wide">Physically Logged Quantity *</label>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 flex-1">
                        <input required type="number" min="0" placeholder="Remaining" value={medicineData.remainingQty} onChange={(e) => setMedicineData({...medicineData, remainingQty: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 rounded-xl text-center font-bold text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm" />
                        <span className="text-gray-400 font-light text-2xl">/</span>
                        <input required disabled={autofilled} type="number" min="1" placeholder="Total" value={medicineData.totalQty} onChange={(e) => setMedicineData({...medicineData, totalQty: e.target.value})} className={`w-full px-4 py-3 border border-gray-300 rounded-xl text-center font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm ${autofilled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300'}`} />
                     </div>
                     <div className="w-16 text-xs font-bold text-gray-500 text-right uppercase tracking-wider mt-1">
                        Units
                     </div>
                  </div>
                  {medicineData.remainingQty && medicineData.totalQty && medicineData.fullMRP && (
                    <div className="text-[0.75rem] text-gray-500 mt-4 font-medium bg-white dark:bg-slate-800 p-2 rounded-lg inline-block border border-gray-200 dark:border-gray-700">
                      Calculated recovery value: <strong className="text-blue-700">₹{remainingMRP}</strong>
                    </div>
                  )}
                </div>

              </div>
              
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={handleAddToCart} className="w-1/2 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 font-bold py-4 rounded-xl hover:bg-blue-100 transition-all shadow-sm">
                  <PackagePlus className="w-5 h-5"/> + Add Another Medicine
                </button>
                <button type="button" onClick={handleReviewProceed} className="w-1/2 flex items-center justify-center bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg">
                  {cart.length > 0 || medicineData.medicineName ? `Review Entire Package Audit →` : 'Review Audit →'}
                </button>
              </div>

            </div>
          )}

          {step === 2 && (
             <div className="space-y-4">
               <div className="bg-blue-50/80 border border-blue-100 p-5 rounded-xl flex items-center justify-between mb-2">
                 <div>
                   <h4 className="font-extrabold text-blue-900 text-lg">Final Verification</h4>
                   <p className="text-[0.8rem] text-blue-700/80 mt-1 font-semibold">Ready to overwrite system ledger with physical audit.</p>
                 </div>
                 <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-blue-200 shadow-sm font-black text-blue-800 text-base">
                   {cart.length} Meds Logged
                 </div>
               </div>

               <div className="max-h-[45vh] overflow-y-auto space-y-3 pr-2">
                 {cart.map((item, idx) => (
                   <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-start justify-between group">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-800 dark:text-slate-200 text-base">{item.medicineName}</h4>
                            {item.isAntibiotic && <span className="bg-red-50 text-red-600 text-[0.65rem] px-2 py-0.5 rounded font-bold uppercase border border-red-100 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Warn</span>}
                         </div>
                         <p className="text-[0.75rem] text-gray-500 font-medium">{item.genericName || 'Manual Entry'} • {item.doseWeight}</p>
                         <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-[0.7rem] bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 font-bold border border-gray-200 dark:border-gray-700">Qty: {item.remainingQty} / {item.totalQty}</span>
                            {item.remainingMRP > 0 && <span className="text-[0.7rem] bg-blue-50 px-2.5 py-1 rounded-md text-blue-700 font-bold border border-blue-100">₹{item.remainingMRP} Logged</span>}
                         </div>
                      </div>
                      <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                         <X className="w-5 h-5" />
                      </button>
                   </div>
                 ))}
               </div>

               <div className="pt-6">
                 {cart.length > 0 && (
                   <button onClick={submitVerification} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl disabled:opacity-70 flex justify-center items-center gap-2">
                     {loading ? 'Processing Ledger...' : 'Complete Physical Verification'}
                   </button>
                 )}
                 <button onClick={() => setStep(1)} className="w-full block text-center mt-3 text-sm text-blue-600 font-bold hover:underline">
                    Oops, back to logging Mode
                 </button>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PharmacyAuditModal;
