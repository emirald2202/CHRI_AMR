import React, { useState, useEffect } from 'react';
import { User, Store, Mail, Lock, Smartphone, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import AuthLayout from '../components/AuthLayout';
import axios from '../api/axios';
import { useTranslation } from 'react-i18next';
import indianCities from '../data/indianCities.json';

const AuthPage = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState('user'); // 'user' | 'pharmacy'
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [method, setMethod] = useState('password'); // 'password' | 'otp'

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', city: '', pharmacyName: '', otp: '',
    flatNo: '', street: '', landmark: '', pincode: '', state: ''
  });
  const [otpStep, setOtpStep] = useState(false); // True when waiting for user to enter OTP
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Autocomplete State
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [apiCitySuggestions, setApiCitySuggestions] = useState([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);

  // 1. Instantly filter the JSON list based on what the user types
  const localCitySuggestions = React.useMemo(() => {
    if (!formData.city || formData.city.length < 1 || !showCityDropdown) return [];
    const query = formData.city.toLowerCase();
    return indianCities.filter(c => c.city.toLowerCase().includes(query)).map(c => ({
       name: c.city, display_name: `${c.state}, India`
    }));
  }, [formData.city, showCityDropdown]);

  // 2. Hybrid Fallback: Query Nominatim API ONLY if local results are insufficient (< 3)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (formData.city && formData.city.length > 1 && showCityDropdown && localCitySuggestions.length < 3) {
        setIsSearchingCity(true);
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.city)}&format=json&addressdetails=1&countrycodes=in&featuretype=settlement&limit=5`);
          const mapped = res.data.map(s => ({
             name: s.name || s.display_name.split(',')[0], 
             display_name: s.display_name
          }));
          setApiCitySuggestions(mapped);
        } catch (error) {
          console.error("Nominatim city error", error);
        } finally {
          setIsSearchingCity(false);
        }
      } else {
        setApiCitySuggestions([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.city, showCityDropdown, localCitySuggestions.length]);

  // 3. Merge Local + API results dynamically and uniquely
  const citySuggestions = React.useMemo(() => {
    const combined = [...localCitySuggestions, ...apiCitySuggestions];
    const unique = Array.from(new Map(combined.map(item => [item.name.toLowerCase(), item])).values());
    return unique.slice(0, 8);
  }, [localCitySuggestions, apiCitySuggestions]);

  
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setOtpStep(false);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (method === 'password') {
          // Standard Password Login
          const res = await axios.post('/auth/login', { 
            email: formData.email, 
            password: formData.password 
          });
          loginUser(res.data.user, res.data.token);
          navigate('/dashboard');
        } else if (method === 'otp') {
          // OTP Login Flow
          if (!otpStep) {
            await axios.post('/auth/send-otp', { email: formData.email });
            setOtpStep(true);
            alert("OTP sent to your email!");
          } else {
            const res = await axios.post('/auth/verify-otp', { email: formData.email, otp: formData.otp, isLogin: true });
            loginUser(res.data.user, res.data.token);
            navigate('/dashboard');
          }
        }
      } else {
        // Signup Flow
        if (!otpStep) {
          // Step 1: Send OTP to verify email before registration
          await axios.post('/auth/send-otp', { email: formData.email });
          setOtpStep(true);
          alert("OTP sent to your email! Please verify to complete registration.");
        } else {
          // Step 2: Verify OTP and Register user
          await axios.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
          
          const structuredAddress = {
            flatNo: formData.flatNo,
            street: formData.street,
            landmark: formData.landmark,
            pincode: formData.pincode,
            city: formData.city,
            state: formData.state
          };
          
          await axios.post('/auth/register', {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: role,
            location: formData.city,
            ...(role === 'pharmacy' && { pharmacyName: formData.pharmacyName, address: structuredAddress })
          });
          
          // Auto login after successful signup
          const res = await axios.post('/auth/login', { email: formData.email, password: formData.password });
          loginUser(res.data.user, res.data.token);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white w-full max-w-[420px] p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-[1.35rem] font-bold text-gray-800 mb-1.5">
            {mode === 'login' ? t('welcomeBack') : t('createAccount')}
          </h2>
          <p className="text-[0.8rem] text-gray-500">
            {mode === 'login' ? t('signInSubtitle') : t('signUpSubtitle')}
          </p>
        </div>

        {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-[0.8rem] text-center font-semibold">
                {errorMsg}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Toggle */}
          <div className="space-y-2">
            <label className="text-[0.75rem] text-gray-500 font-medium ml-1">{t('iamA')}</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setRole('user'); setOtpStep(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                  role === 'user' 
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className="w-[14px] h-[14px]" /> {t('user')}
              </button>
              <button
                type="button"
                onClick={() => { setRole('pharmacy'); setOtpStep(false); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                  role === 'pharmacy' 
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Store className="w-[14px] h-[14px]" /> {t('pharmacy')}
              </button>
            </div>
          </div>

          {/* Mode Toggle (Login/Signup) */}
          <div className="flex p-1 bg-gray-100/80 rounded-lg">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 py-1.5 text-[0.85rem] font-semibold rounded-md transition-all ${
                mode === 'login' ? 'bg-white text-gray-800 shadow-sm border border-gray-200/60' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('loginTab')}
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 py-1.5 text-[0.85rem] font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                mode === 'signup' ? 'bg-[#eefcf2] text-green-700 shadow-sm border border-green-100' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('signupTab')}
            </button>
          </div>

          {/* Login Method Toggle (only for login) */}
          {mode === 'login' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setMethod('password'); setOtpStep(false); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[0.85rem] font-semibold transition-colors ${
                  method === 'password'
                    ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-600/20'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Lock className="w-[14px] h-[14px]" /> {t('password')}
              </button>
              <button
                type="button"
                onClick={() => { setMethod('otp'); setOtpStep(false); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[0.85rem] font-semibold transition-colors ${
                  method === 'otp'
                     ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-600/20'
                    : 'border-green-100 bg-green-50/50 text-green-700 hover:bg-green-50'
                }`}
              >
                <Smartphone className="w-[14px] h-[14px]" /> {t('otp')}
              </button>
            </div>
          )}

          {/* Input Fields */}
          <div className="space-y-4">
            
            {mode === 'signup' && !otpStep && (
              <>
                <div>
                  <label className="block text-[0.75rem] font-semibold text-gray-700 mb-1.5 ml-1">{t('fullName')}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder={t('enterName')} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.75rem] font-semibold text-gray-700 mb-1.5 ml-1">{t('phone')}</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder={t('enterPhone')} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                  </div>
                </div>
                {role === 'user' && (
                  <div className="space-y-4">
                    <div className="animate-in slide-in-from-top-2 duration-300 relative">
                      <label className="block text-[0.75rem] font-semibold text-gray-700 mb-1.5 ml-1">City</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center">📍</div>
                        <input type="text" name="city" value={formData.city} 
                          onChange={(e) => { handleInputChange(e); setShowCityDropdown(true); }}
                          onFocus={() => setShowCityDropdown(true)}
                          onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                          required placeholder="e.g. Mumbai, Delhi" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                        {isSearchingCity && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
                      </div>
                      
                      {showCityDropdown && citySuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                          {citySuggestions.map((sugg, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0 text-sm text-gray-700"
                               onMouseDown={(e) => {
                                 e.preventDefault();
                                 setFormData({...formData, city: sugg.name});
                                 setShowCityDropdown(false);
                               }}>
                              <span className="font-semibold">{sugg.name}</span>
                              <div className="text-[0.7rem] text-gray-500 mt-0.5 truncate">{sugg.display_name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {(!otpStep || mode === 'login') && (
                <div>
                  <label className="block text-[0.75rem] font-semibold text-gray-700 mb-1.5 ml-1">{t('email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder={t('enterEmail')} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                  </div>
                </div>
            )}

            {((method === 'password' && mode === 'login') || (mode === 'signup' && !otpStep)) && (
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                  <label className="text-[0.75rem] font-semibold text-gray-700">{t('password')}</label>
                  {mode === 'login' && <a href="#" className="text-[0.7rem] font-semibold text-green-600 hover:text-green-700 transition-colors">{t('forgotPassword')}</a>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required placeholder={t('enterPassword')} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                </div>
              </div>
            )}
            
            {otpStep && (
              <div>
                  <label className="text-[0.75rem] font-semibold text-gray-700 mb-1.5 ml-1">{t('otp')}</label>
                <div className="relative">
                  <input type="text" name="otp" value={formData.otp} onChange={handleInputChange} required placeholder="123456" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm tracking-widest font-mono text-center" />
                </div>
              </div>
            )}

            {mode === 'signup' && role === 'pharmacy' && !otpStep && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[0.75rem] font-semibold text-gray-700 mb-1.5 ml-1">{t('pharmacyName')}</label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" name="pharmacyName" value={formData.pharmacyName} onChange={handleInputChange} required placeholder={t('enterPharmacy')} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                  </div>
                </div>
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 flex flex-col gap-3 shadow-inner">
                  <h4 className="text-[0.8rem] font-bold text-gray-700 flex items-center gap-1.5 mb-1"><span className="text-xl">🏢</span> Complete Pharmacy Address</h4>
                  <div>
                    <input type="text" name="flatNo" value={formData.flatNo} onChange={handleInputChange} required placeholder="Shop No. / Building Name / Complex" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700" />
                  </div>
                  <div>
                    <input type="text" name="street" value={formData.street} onChange={handleInputChange} required placeholder="Street / Road / Sector / Floor" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700" />
                  </div>
                  <div className="flex gap-3">
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Landmark (Optional)" className="flex-1 w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700" />
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required placeholder="Pincode" maxLength="6" className="w-[100px] px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700 text-center tracking-widest" />
                  </div>
                  <div className="flex gap-3">
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="City / District" className="flex-1 w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700" />
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required placeholder="State" className="flex-1 w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              otpStep ? t('verifyOtp') : (mode === 'login' ? (method === 'otp' ? t('sendOtp') : t('signInBtn')) : t('signUpBtn'))
            )}
          </button>
        </form>

      </div>
    </AuthLayout>
  );
};

export default AuthPage;
