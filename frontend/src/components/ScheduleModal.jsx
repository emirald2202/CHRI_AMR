import React, { useState, useEffect } from 'react';
import { X, Pill, Hash, AlertCircle, MapPin, Building, Map, Navigation, ArrowLeft, Building2 } from 'lucide-react';
import axios from '../api/axios';

const ScheduleModal = ({ isOpen, onClose, onSuccess }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Medicine Details, 2: Address
  
  const [formData, setFormData] = useState({
    pharmacyId: '',
    medicineName: '',
    doseWeight: '',
    quantity: '',
    reason: '',
    disposalType: 'dropoff',
  });

  const [addressData, setAddressData] = useState({
    flat: '',
    area: '',
    landmark: '',
    pincode: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchPharmacies();
      setStep(1);
      setFormData({
        pharmacyId: '',
        medicineName: '',
        doseWeight: '',
        quantity: '',
        reason: '',
        disposalType: 'dropoff'
      });
      setAddressData({ flat: '', area: '', landmark: '', pincode: '' });
    }
  }, [isOpen]);

  const fetchPharmacies = async () => {
    try {
      const res = await axios.get('/users/pharmacies');
      // If the user has a location, we could theoretically sort this.
      setPharmacies(res.data);
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.disposalType === 'pickup') {
      setStep(2);
    } else {
      submitForm();
    }
  };

  const submitForm = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      let finalAddress = undefined;
      if (formData.disposalType === 'pickup') {
        finalAddress = `${addressData.flat}\n${addressData.area}\n${addressData.landmark ? `Landmark: ${addressData.landmark}\n` : ''}Pincode: ${addressData.pincode}`;
      }

      await axios.post('/disposals', {
        ...formData,
        pickupAddress: finalAddress
      });
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center sm:p-4">
      <div className="bg-white w-full sm:max-w-[550px] rounded-t-3xl sm:rounded-3xl relative shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-2 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto overflow-x-hidden">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 2 && (
               <button type="button" onClick={() => setStep(1)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
               </button>
            )}
            <h2 className="text-xl font-extrabold text-gray-800">
              {step === 1 ? 'Schedule Disposal' : 'Pickup Address'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-6">
              
              {/* Pharmacy Selection */}
              <div>
                <label className="block text-[0.8rem] font-bold text-gray-600 uppercase tracking-wider mb-2">Assign Pharmacy</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <select required value={formData.pharmacyId} onChange={(e) => setFormData({...formData, pharmacyId: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all font-medium appearance-none">
                    <option value="">Choose a nearby pharmacy...</option>
                    {pharmacies.map(p => (
                      <option key={p._id} value={p._id}>{p.pharmacyName || p.name} {p.address ? `(${p.address})` : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Medicine Details Group */}
              <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl space-y-5">
                <div>
                  <label className="block text-[0.8rem] font-bold text-gray-600 uppercase tracking-wider mb-2">Medicine Details</label>
                  <div className="relative">
                    <Pill className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input required type="text" placeholder="Exact Name (e.g. Paracetamol, Azithromycin)" value={formData.medicineName} onChange={(e) => setFormData({...formData, medicineName: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.75rem] font-semibold text-gray-500 mb-1.5 ml-1">Dose / Weight</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">mg</span>
                      <input required type="text" placeholder="e.g. 500mg, 10ml" value={formData.doseWeight} onChange={(e) => setFormData({...formData, doseWeight: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-semibold text-gray-500 mb-1.5 ml-1">Total Quantity</label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input required type="text" placeholder="e.g. 1 strip, 12 tabs" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.75rem] font-semibold text-gray-500 mb-1.5 ml-1">Reason for Disposal</label>
                  <div className="relative">
                    <AlertCircle className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                    <textarea required placeholder="e.g. Expired, Course completed, Discontinued..." rows="2" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>
              </div>

              {/* Delivery Method Selection */}
              <div>
                <label className="block text-[0.8rem] font-bold text-gray-600 uppercase tracking-wider mb-2">Delivery Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.disposalType === 'dropoff' ? 'border-green-500 bg-green-50/50' : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="delivery" value="dropoff" checked={formData.disposalType === 'dropoff'} onChange={() => setFormData({...formData, disposalType: 'dropoff'})} className="sr-only" />
                    <MapPin className={`w-6 h-6 ${formData.disposalType === 'dropoff' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-bold flex flex-col items-center ${formData.disposalType === 'dropoff' ? 'text-green-800' : 'text-gray-600'}`}>
                      Self Drop-off
                      <span className="text-[0.65rem] font-semibold text-green-600 bg-green-100 px-1.5 rounded uppercase mt-1">Recommended</span>
                    </span>
                  </label>
                  <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.disposalType === 'pickup' ? 'border-green-500 bg-green-50/50' : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="delivery" value="pickup" checked={formData.disposalType === 'pickup'} onChange={() => setFormData({...formData, disposalType: 'pickup'})} className="sr-only" />
                    <Navigation className={`w-6 h-6 ${formData.disposalType === 'pickup' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-bold flex flex-col items-center ${formData.disposalType === 'pickup' ? 'text-green-800' : 'text-gray-600'}`}>
                      Free Pick-up
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-[#059669] text-white font-bold py-4 rounded-xl hover:bg-[#047857] transition-all shadow-[0_4px_14px_0_rgba(5,150,105,0.39)]">
                  {formData.disposalType === 'pickup' ? 'Continue to Address' : 'Confirm Drop-off Details'}
                </button>
              </div>
            </form>
          ) : (
            
            /* SWIGGY STYLE ADDRESS FORM */
            <form onSubmit={submitForm} className="space-y-5 animate-in slide-in-from-right-8 duration-300">
              <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-xl flex gap-3 text-orange-800 mb-6">
                 <div className="mt-0.5"><Navigation className="w-4 h-4 text-orange-600" /></div>
                 <div>
                   <h4 className="font-bold text-sm">Delivery Partner will arrive here</h4>
                   <p className="text-[0.75rem] opacity-80 mt-0.5">Please provide specific details so they can easily find your location for the free medical waste collection.</p>
                 </div>
              </div>

              <div>
                <label className="block text-[0.75rem] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Flat / House no / Floor / Building</label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input required type="text" value={addressData.flat} onChange={(e) => setAddressData({...addressData, flat: e.target.value})} className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[0.75rem] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Area / Sector / Locality</label>
                <div className="relative">
                  <Map className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input required type="text" value={addressData.area} onChange={(e) => setAddressData({...addressData, area: e.target.value})} className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3">
                  <label className="block text-[0.75rem] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Nearby Landmark <span className="opacity-60">(Optional)</span></label>
                  <input type="text" placeholder="e.g. Near Apollo Hospital" value={addressData.landmark} onChange={(e) => setAddressData({...addressData, landmark: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[0.75rem] font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Pincode</label>
                  <input required type="text" maxLength={6} placeholder="400050" value={addressData.pincode} onChange={(e) => setAddressData({...addressData, pincode: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm tracking-widest text-center" />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={loading} className="w-full bg-[#f15700] text-white font-bold py-4 rounded-xl hover:bg-[#d64d00] transition-all shadow-[0_4px_14px_0_rgba(241,87,0,0.39)] disabled:opacity-70 flex justify-center items-center gap-2">
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
