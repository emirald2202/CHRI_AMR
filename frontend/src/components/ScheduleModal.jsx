import React, { useState, useEffect } from 'react';
import { X, Pill, ShieldAlert, AlertCircle, MapPin, Building, Map, Navigation, ArrowLeft, Building2, Search, CheckCircle2, PackagePlus, ShoppingBag } from 'lucide-react';
import axios from '../api/axios';
import { searchMedicineAPI } from '../api/medicineAPI';

const ScheduleModal = ({ isOpen, onClose, onSuccess, preselectedPharmacy }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);
  
  const [pharmacySearchTerm, setPharmacySearchTerm] = useState('');
  const [showPharmacySuggestions, setShowPharmacySuggestions] = useState(false);
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [autofilled, setAutofilled] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  
  const [requestData, setRequestData] = useState({
    pharmacyId: '',
    disposalType: 'dropoff' // Defaults to dropoff per design
  });

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
    reason: ''
  });

  const [addressData, setAddressData] = useState({
    flat: '',
    area: '',
    landmark: '',
    pincode: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (pharmacies.length === 0) fetchPharmacies();
      
      if (preselectedPharmacy) {
         setRequestData(prev => ({ ...prev, pharmacyId: preselectedPharmacy._id }));
         setPharmacySearchTerm(`${preselectedPharmacy.pharmacyName || preselectedPharmacy.name} (${preselectedPharmacy.address?.city || ''})`);
      }

      // Ensure we always default back to the cart view or builder depending on the state
      if (step === 3 && requestData.disposalType !== 'pickup') setStep(1);
    }
  }, [isOpen, preselectedPharmacy, pharmacies.length]);

  const resetForm = () => {
    setRequestData(prev => ({ ...prev, pharmacyId: '' }));
    setPharmacySearchTerm('');
    clearMedicineForm();
    setAddressData({ flat: '', area: '', landmark: '', pincode: '' });
  };

  const clearMedicineForm = () => {
    setMedicineData({
      medicineName: '', genericName: '', medicineType: 'tablet',
      doseWeight: '', manufacturer: '', isAntibiotic: false, remainingQty: '',
      totalQty: '', fullMRP: '', reason: ''
    });
    setAutofilled(false);
    setManualOverride(false);
  };

  const fetchPharmacies = async () => {
    try {
      const res = await axios.get('/users/pharmacies');
      setPharmacies(res.data);
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
    }
  };

  // Debounced API Search
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
    if (!medicineData.medicineName || !medicineData.remainingQty || !medicineData.totalQty || !medicineData.reason) {
      alert("Please fill all required medicine fields before adding to package.");
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
    if (!requestData.pharmacyId) {
      alert("Please select an Assign Pharmacy first.");
      return;
    }

    if (medicineData.medicineName) {
      const added = handleAddToCart();
      if (!added) return;
    } else if (cart.length === 0) {
      alert("Please add at least one medicine to the package.");
      return;
    }
    setStep(2);
  };

  const submitForm = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      let finalAddress = undefined;
      if (requestData.disposalType === 'pickup') {
         finalAddress = `${addressData.flat}\n${addressData.area}\n${addressData.landmark ? `Landmark: ${addressData.landmark}\n` : ''}Pincode: ${addressData.pincode}`;
      }

      const payload = {
        pharmacyId: requestData.pharmacyId,
        disposalType: requestData.disposalType,
        userMedicines: cart,
        pickupAddress: finalAddress
      };

      await axios.post('/disposals', payload);
      setCart([]);
      resetForm();
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-end sm:items-center sm:p-4 transition-opacity">
      <div className="bg-white dark:bg-slate-800 w-full sm:max-w-[550px] rounded-t-3xl sm:rounded-3xl relative shadow-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        
        <div className="sticky top-0 bg-white dark:bg-slate-800 z-20 px-8 py-5 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step > 1 && (
               <button type="button" onClick={() => setStep(step - 1)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
               </button>
            )}
            <h2 className="text-xl font-extrabold text-gray-800 dark:text-slate-200">
              {step === 1 ? 'Build Package' : step === 2 ? 'Review Package' : 'Pickup Address'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 dark:bg-slate-900 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-8">
          {step === 1 && (
            <div className="space-y-6">

              {/* Disposal Type Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRequestData({...requestData, disposalType: 'dropoff'})} className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${requestData.disposalType === 'dropoff' ? 'border-green-500 bg-green-50 dark:bg-emerald-900/30 shadow-sm' : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-200 dark:border-gray-700'}`}>
                   {requestData.disposalType === 'dropoff' && <div className="absolute top-0 right-0 w-8 h-8 bg-green-50 dark:bg-emerald-900/300 rounded-bl-2xl flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                   <div className="flex items-center gap-2 text-green-700 font-extrabold text-sm mb-1"><MapPin className="w-4 h-4" /> Drop-off</div>
                   <p className="text-[0.65rem] text-gray-500 font-bold uppercase tracking-wider">Recommended</p>
                </button>
                <button type="button" onClick={() => setRequestData({...requestData, disposalType: 'pickup'})} className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${requestData.disposalType === 'pickup' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-200 dark:border-gray-700'}`}>
                   {requestData.disposalType === 'pickup' && <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500 rounded-bl-2xl flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-white" /></div>}
                   <div className="flex items-center gap-2 text-orange-700 font-extrabold text-sm mb-1"><Navigation className="w-4 h-4" /> Pick-up</div>
                   <p className="text-[0.65rem] text-gray-500 font-bold uppercase tracking-wider">Free Service</p>
                </button>
              </div>
              
              {/* Pharmacy Selection */}
              <div className="relative z-20">
                <label className="block text-[0.8rem] font-bold text-gray-600 uppercase tracking-wider mb-2">Assign Pharmacy *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    required={!requestData.pharmacyId}
                    placeholder="Search by name or area..." 
                    value={pharmacySearchTerm} 
                    onChange={(e) => {
                      setPharmacySearchTerm(e.target.value);
                      setRequestData({...requestData, pharmacyId: ''}); // clear ID if they type
                      setShowPharmacySuggestions(true);
                    }} 
                    onFocus={() => { if (pharmacies.length > 0) setShowPharmacySuggestions(true); }}
                    className="w-full pl-12 pr-10 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-semibold"
                  />
                  {requestData.pharmacyId && (
                     <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                     </div>
                  )}
                </div>

                {/* Pharmacy Autocomplete Dropdown */}
                {showPharmacySuggestions && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden max-h-48 overflow-y-auto">
                    {pharmacies.filter(p => {
                       const term = pharmacySearchTerm.toLowerCase();
                       const nameStr = (p.pharmacyName || p.name || '').toLowerCase();
                       const addrStr = p.address ? Object.values(p.address).join(' ').toLowerCase() : (p.location || '').toLowerCase();
                       return nameStr.includes(term) || addrStr.includes(term);
                    }).length > 0 ? pharmacies.filter(p => {
                       const term = pharmacySearchTerm.toLowerCase();
                       const nameStr = (p.pharmacyName || p.name || '').toLowerCase();
                       const addrStr = p.address ? Object.values(p.address).join(' ').toLowerCase() : (p.location || '').toLowerCase();
                       return nameStr.includes(term) || addrStr.includes(term);
                    }).map(p => (
                      <button 
                        type="button" 
                        key={p._id} 
                        onClick={() => {
                          setRequestData({...requestData, pharmacyId: p._id});
                          setPharmacySearchTerm(`${p.pharmacyName || p.name} (${p.address ? (p.address.city || '') : ''})`);
                          setShowPharmacySuggestions(false);
                        }} 
                        className="w-full text-left px-5 py-3 hover:bg-green-50 dark:bg-emerald-900/30 border-b border-gray-50 transition-colors flex flex-col last:border-0"
                      >
                        <span className="font-bold text-gray-800 dark:text-slate-200 text-sm">{p.pharmacyName || p.name}</span>
                        <span className="text-xs text-gray-500 font-medium truncate w-full">{p.address ? `${p.address.street || ''}, ${p.address.city || ''}` : p.location || 'No address provided'}</span>
                      </button>
                    )) : (
                      <div className="px-5 py-4 text-center">
                        <p className="text-[0.8rem] text-gray-600 font-medium font-bold px-4 py-2 bg-orange-50 text-orange-600 rounded-lg">No matching pharmacies found</p>
                        <button type="button" onClick={() => setShowPharmacySuggestions(false)} className="mt-3 text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-300 underline">Close Search</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Medicine Details Group */}
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 p-6 rounded-2xl relative">
                <div className="flex items-center justify-between mb-3">
                   <label className="block text-[0.8rem] font-bold text-gray-600 uppercase tracking-wider">Add Medicine To Package</label>
                   {cart.length > 0 && (
                      <button type="button" onClick={() => setShowCartPreview(!showCartPreview)} className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full border border-green-200 hover:bg-green-200 transition-colors flex items-center gap-1 shadow-sm">
                         <ShoppingBag className="w-3.5 h-3.5"/> {showCartPreview ? 'Hide Cart' : `View Cart (${cart.length})`}
                      </button>
                   )}
                </div>

                {showCartPreview && cart.length > 0 && (
                    <div className="mb-4 bg-white dark:bg-slate-800 border border-green-200 rounded-xl p-3 shadow-inner">
                       <h5 className="font-bold text-gray-700 dark:text-gray-300 text-[0.7rem] uppercase mb-2">Items Currently in Package</h5>
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
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isSearching ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                    <input 
                      type="text" 
                      placeholder="Search medicine name..." 
                      value={medicineData.medicineName} 
                      onChange={(e) => {
                        setMedicineData({...medicineData, medicineName: e.target.value});
                        if (autofilled) setAutofilled(false);
                      }} 
                      onFocus={() => {if (suggestions.length > 0) setShowSuggestions(true)}}
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-semibold" 
                    />
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showSuggestions && !autofilled && (
                    <div className="absolute w-full mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden z-20">
                      {suggestions.length > 0 ? (
                        <>
                          <div className="max-h-48 overflow-y-auto">
                            {suggestions.map((med, i) => (
                              <button type="button" key={i} onClick={() => selectMedicine(med)} className="w-full text-left px-5 py-3 hover:bg-green-50 dark:bg-emerald-900/30 border-b border-gray-50 transition-colors flex flex-col last:border-0">
                                <span className="font-bold text-gray-800 dark:text-slate-200 text-sm">{med.brandName}</span>
                                <span className="text-xs text-gray-500 font-medium truncate w-full">{med.genericName} • {med.doseWeight || med.dose}</span>
                              </button>
                            ))}
                          </div>
                          <div className="px-5 py-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 text-center">
                            <p className="text-xs text-gray-500 font-medium mb-2">Can't find exact match?</p>
                            <button type="button" onClick={() => {setAutofilled(false); setManualOverride(true); setShowSuggestions(false);}} className="text-xs font-bold text-green-600 bg-green-50/50 dark:bg-emerald-900/30 py-1.5 px-3 rounded w-full border border-green-100 dark:border-green-900">Fill Details Manually</button>
                          </div>
                        </>
                      ) : (
                        medicineData.medicineName.length >= 3 && !isSearching && (
                          <div className="px-5 py-4 text-center">
                            <p className="text-[0.8rem] text-gray-600 font-medium mb-2">Medicine not found in database. Please fill details manually.</p>
                            <button type="button" onClick={() => {setAutofilled(false); setManualOverride(true); setShowSuggestions(false);}} className="text-xs font-bold text-green-600 bg-green-50 dark:bg-emerald-900/30 py-1.5 px-3 rounded text-center w-full">Fill Manually</button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Autofilled Badges */}
                {autofilled && (
                  <div className="mt-4 p-4 bg-white dark:bg-slate-800 border border-green-100 rounded-xl shadow-sm relative overflow-hidden">
                     <div className="absolute -right-2 -top-2 w-12 h-12 bg-green-50 dark:bg-emerald-900/30 rounded-full blur-xl"></div>
                     <div className="flex items-center gap-2 mb-3">
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                       <h4 className="font-bold text-green-800 text-sm">{medicineData.medicineName}</h4>
                     </div>
                     <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                       <div className="flex flex-col gap-1">
                          <span className="text-[0.65rem] uppercase font-bold text-gray-400 tracking-wider">Type</span>
                          <span className="bg-green-50 dark:bg-emerald-900/30 text-green-700 text-xs font-semibold rounded px-2.5 py-1 w-max border border-green-100/50">{medicineData.medicineType} [auto]</span>
                       </div>
                       {medicineData.isAntibiotic && (
                         <div className="flex flex-col gap-1">
                            <span className="text-[0.65rem] uppercase font-bold text-gray-400 tracking-wider">Warning</span>
                            <span className="bg-red-50 text-red-600 text-xs font-bold rounded px-2.5 py-1 w-max border border-red-100 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Antibiotic Detected [auto]</span>
                         </div>
                       )}
                     </div>
                  </div>
                )}

                {/* Always-visible Editable Fields (Dose, Manufacturer, Type, MRP) */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {manualOverride && (
                    <>
                      <input required type="text" placeholder="Type (e.g. Tablet)" value={medicineData.medicineType} onChange={(e) => setMedicineData({...medicineData, medicineType: e.target.value})} className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none" />
                      <input required type="text" placeholder="Manufacturer (e.g. GSK)" value={medicineData.manufacturer} onChange={(e) => setMedicineData({...medicineData, manufacturer: e.target.value})} className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none" />
                      <div className="col-span-2 flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg mb-1">
                         <div className="flex items-center gap-2">
                           <ShieldAlert className={`w-4 h-4 ${medicineData.isAntibiotic ? 'text-red-500' : 'text-gray-400'}`} />
                           <label htmlFor="antiType" className="text-sm font-bold text-gray-700 dark:text-gray-300">Is this an Antibiotic?</label>
                         </div>
                         <input type="checkbox" id="antiType" checked={medicineData.isAntibiotic} onChange={(e) => setMedicineData({...medicineData, isAntibiotic: e.target.checked})} className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500" />
                      </div>
                    </>
                  )}
                  <input required type="text" placeholder="Verify Dose (e.g. 500mg)" value={medicineData.doseWeight} onChange={(e) => setMedicineData({...medicineData, doseWeight: e.target.value})} className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none ${!manualOverride ? 'col-span-2' : 'col-span-2'}`} />
                  <div className="col-span-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">₹</span>
                    <input type="number" required min="0" placeholder="Full Pack MRP (Total pack cost)" value={medicineData.fullMRP} onChange={(e) => setMedicineData({...medicineData, fullMRP: e.target.value})} className="w-full pl-8 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none" />
                  </div>
                </div>

                {/* Fractional Quantity */}
                <div className="mt-6">
                  <label className="block text-[0.75rem] font-bold text-gray-600 mb-2 uppercase tracking-wide">Remaining Quantity *</label>
                  <p className="text-[0.7rem] text-gray-400 font-medium mb-3">e.g. 8/10 means 8 out of 10 tablets remain in the strip.</p>
                  
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 flex-1">
                        <input required type="number" min="0" placeholder="0" value={medicineData.remainingQty} onChange={(e) => setMedicineData({...medicineData, remainingQty: e.target.value})} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-bold text-gray-700 dark:text-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-sm" />
                        <span className="text-gray-400 font-light text-2xl">/</span>
                        <input required disabled={autofilled} type="number" min="1" placeholder="0" value={medicineData.totalQty} onChange={(e) => setMedicineData({...medicineData, totalQty: e.target.value})} className={`w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-bold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 shadow-sm ${autofilled ? 'bg-gray-50 dark:bg-slate-900 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300'}`} />
                     </div>
                     <div className="w-16 text-xs font-bold text-gray-500 text-right uppercase tracking-wider mt-1">
                        Units
                     </div>
                  </div>

                  {/* Progress Indicator */}
                  {medicineData.remainingQty && medicineData.totalQty && (
                    <div className="mt-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                       <div className="flex justify-between items-center mb-1.5 px-0.5">
                         <span className="text-[0.7rem] font-bold text-gray-600">Fill Status</span>
                         <span className="text-[0.7rem] font-bold text-green-600">{Math.round(remainingPercent)}% remaining</span>
                       </div>
                       <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-green-50 dark:bg-emerald-900/300 transition-all duration-500 ease-out" style={{ width: `${Math.round(remainingPercent)}%` }}></div>
                       </div>
                       {medicineData.fullMRP && (
                         <div className="text-[0.75rem] text-gray-500 mt-3 font-medium bg-gray-50 dark:bg-slate-900 p-2 rounded-lg inline-block border border-gray-100 dark:border-slate-700">
                           Estimated value of remaining medicines: <strong className="text-green-700">₹{remainingMRP}</strong>
                         </div>
                       )}
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <label className="block text-[0.75rem] font-bold text-gray-600 mb-2 uppercase tracking-wide">Reason for Disposal *</label>
                  <div className="relative">
                    <AlertCircle className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
                    <textarea required placeholder="e.g. Expired, Course completed..." rows="2" value={medicineData.reason} onChange={(e) => setMedicineData({...medicineData, reason: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-none shadow-sm"></textarea>
                  </div>
                </div>

              </div>
              
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={handleAddToCart} className="w-1/2 flex items-center justify-center gap-2 bg-green-50 dark:bg-emerald-900/30 text-green-700 border border-green-200 font-bold py-4 rounded-xl hover:bg-green-100 transition-all">
                  <PackagePlus className="w-5 h-5"/> Add Ext. Item
                </button>
                <button type="button" onClick={handleReviewProceed} className="w-1/2 flex items-center justify-center bg-[#059669] text-white font-bold py-4 rounded-xl hover:bg-[#047857] transition-all shadow-md">
                  {cart.length > 0 || medicineData.medicineName ? `Review Package →` : 'Submit Package →'}
                </button>
              </div>

            </div>
          )}

          {step === 2 && (
             <div className="space-y-4">
               <div className="bg-green-50 dark:bg-emerald-900/30/50 border border-green-100 p-5 rounded-xl flex items-center justify-between mb-2">
                 <div>
                   <h4 className="font-extrabold text-green-900 text-lg">Package Summary</h4>
                   <p className="text-[0.8rem] text-green-700/80 mt-1 font-semibold">Please review the contents of your sealed disposal package.</p>
                 </div>
                 <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-green-200 shadow-sm font-black text-green-800 text-base">
                   {cart.length} Items
                 </div>
               </div>

               <div className="max-h-[45vh] overflow-y-auto space-y-3 pr-2">
                 {cart.map((item, idx) => (
                   <div key={idx} className="p-4 border border-gray-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-start justify-between group">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-800 dark:text-slate-200 text-base">{item.medicineName}</h4>
                            {item.isAntibiotic && <span className="bg-red-50 text-red-600 text-[0.65rem] px-2 py-0.5 rounded font-bold uppercase border border-red-100 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Warn</span>}
                         </div>
                         <p className="text-[0.75rem] text-gray-500 font-medium">{item.genericName || 'Manual Entry'} • {item.doseWeight}</p>
                         <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-[0.7rem] bg-gray-50 dark:bg-slate-900 px-2.5 py-1 rounded-md text-gray-600 font-bold border border-gray-100 dark:border-slate-700">Qty: {item.remainingQty} / {item.totalQty}</span>
                            {item.remainingMRP > 0 && <span className="text-[0.7rem] bg-green-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md text-green-700 font-bold border border-green-100">₹{item.remainingMRP} Est.</span>}
                         </div>
                      </div>
                      <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                         <X className="w-5 h-5" />
                      </button>
                   </div>
                 ))}
                 {cart.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                      <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-bold text-sm">Package is empty.</p>
                      <button onClick={() => setStep(1)} className="mt-3 text-sm text-green-600 font-bold underline">Go back and add medicines</button>
                    </div>
                 )}
               </div>

               <div className="pt-6">
                 {cart.length > 0 && (
                   <button onClick={() => {
                      if (requestData.disposalType === 'pickup') setStep(3);
                      else submitForm();
                   }} disabled={loading} className="w-full bg-[#059669] text-white font-bold py-4 rounded-xl hover:bg-[#047857] transition-all shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] disabled:opacity-70 flex justify-center items-center gap-2">
                     {loading ? 'Processing...' : requestData.disposalType === 'pickup' ? 'Verify & Finalize Pick-up Details' : 'Verify & Final Confirm Drop-off'}
                   </button>
                 )}
               </div>
             </div>
          )}

          {step === 3 && (
             <form onSubmit={submitForm} className="space-y-5">
              <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl flex gap-3 text-orange-800 mb-6">
                 <div className="mt-0.5"><Navigation className="w-4 h-4 text-orange-600" /></div>
                 <div>
                   <h4 className="font-bold text-sm">Delivery Partner will arrive here</h4>
                   <p className="text-[0.75rem] opacity-80 mt-0.5">Please provide specific details so they can easily find your location for the free medical waste pickup.</p>
                 </div>
              </div>

              <div>
                <label className="block text-[0.75rem] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Flat / House no / Floor / Building</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input required type="text" value={addressData.flat} onChange={(e) => setAddressData({...addressData, flat: e.target.value})} className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[0.75rem] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Area / Sector / Locality</label>
                <div className="relative">
                  <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input required type="text" value={addressData.area} onChange={(e) => setAddressData({...addressData, area: e.target.value})} className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-[0.75rem] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Nearby Landmark <span className="opacity-60">(Optional)</span></label>
                  <input type="text" placeholder="e.g. Near Apollo Hospital" value={addressData.landmark} onChange={(e) => setAddressData({...addressData, landmark: e.target.value})} className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[0.75rem] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Pincode</label>
                  <input required type="text" maxLength={6} placeholder="400050" value={addressData.pincode} onChange={(e) => setAddressData({...addressData, pincode: e.target.value})} className="w-full px-4 py-3.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm tracking-widest text-center" />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="w-full bg-[#f15700] text-white font-bold py-4 rounded-xl hover:bg-[#d64d00] transition-all shadow-md disabled:opacity-70 flex justify-center items-center gap-2">
                  {loading ? 'Processing...' : 'Save Address & Confirm Pick-up'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
