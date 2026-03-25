import React, { useState, useEffect } from 'react';
import { User, Store, Mail, Lock, Smartphone, Loader2, Eye, EyeOff, KeyRound, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import AuthLayout from '../components/AuthLayout';
import axios from '../api/axios';
import { useTranslation } from 'react-i18next';
import indianCities from '../data/indianCities.json';
import LanguageModal from '../components/LanguageModal';

/* ─── Reusable Password Input ─── */
const PasswordInput = ({ name, value, onChange, placeholder, required = true }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};

/* ─── Forgot Password Modal ─── */
// Inject keyframe once
if (typeof document !== 'undefined' && !document.getElementById('amr-modal-style')) {
  const s = document.createElement('style');
  s.id = 'amr-modal-style';
  s.textContent = '@keyframes amrFadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}';
  document.head.appendChild(s);
}

const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'reset' | 'done'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!email) return setError('Please enter your email.');
    setLoading(true); setError('');
    try {
      await axios.post('/auth/forgot-password', { email });
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return setError('Enter the 6-digit OTP.');
    // We just move to reset step; actual verification happens on reset
    setError('');
    setStep('reset');
  };

  const handleReset = async () => {
    if (!newPass) return setError('Enter a new password.');
    if (newPass.length < 6) return setError('Password must be at least 6 characters long.');
    if (newPass !== confirmPass) return setError('Passwords do not match.');
    setLoading(true); setError('');
    try {
      await axios.post('/auth/reset-password', { email, otp, newPassword: newPass });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4" style={{background:'rgba(0,0,0,0.55)'}}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 relative" style={{animation:'amrFadeIn 0.18s ease both'}}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-6 h-6 text-green-600" />
        </div>

        {/* Step: Email */}
        {step === 'email' && (
          <>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-200 text-center mb-1">Forgot Password?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Enter your registered email to receive a reset OTP.</p>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Email Address</label>
            <div className="relative mb-4">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 focus:border-green-400 outline-none rounded-xl text-sm font-semibold transition-colors"
              />
            </div>
            {error && <p className="text-xs text-red-600 font-semibold mb-3">{error}</p>}
            <button onClick={handleSendOtp} disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Send OTP</>}
            </button>
          </>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-200 text-center mb-1">Check Your Email</h3>
            <p className="text-sm text-gray-500 text-center mb-1">We sent a 6-digit OTP to</p>
            <p className="text-sm font-bold text-green-600 text-center mb-6">{email}</p>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Enter OTP</label>
            <input
              type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •"
              className="w-full border-2 border-gray-200 dark:border-gray-700 focus:border-green-400 outline-none rounded-xl px-4 py-3 text-sm font-mono text-center tracking-[0.5em] font-bold mb-4 transition-colors"
            />
            {error && <p className="text-xs text-red-600 font-semibold mb-3">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep('email')} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 font-bold text-sm hover:bg-gray-50 dark:bg-slate-900">Back</button>
              <button onClick={handleVerifyOtp} disabled={otp.length < 6}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 transition-all">
                <ArrowRight className="w-4 h-4" /> Verify
              </button>
            </div>
          </>
        )}

        {/* Step: New Password */}
        {step === 'reset' && (
          <>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-200 text-center mb-1">Set New Password</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Choose a strong new password.</p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">New Password</label>
                <PasswordInput name="newPass" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New password" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Confirm Password</label>
                <PasswordInput name="confirmPass" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Confirm password" />
              </div>
            </div>
            {error && <p className="text-xs text-red-600 font-semibold mb-3">{error}</p>}
            <button onClick={handleReset} disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
            </button>
          </>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-200 mb-2">Password Reset!</h3>
            <p className="text-sm text-gray-500 mb-6">You can now log in with your new password.</p>
            <button onClick={onClose} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition-all">
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════ */
/*                   MAIN AUTH PAGE                   */
/* ══════════════════════════════════════════════════ */
const AuthPage = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState('user');
  const [mode, setMode] = useState('login');
  const [method, setMethod] = useState('password');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', city: '', pharmacyName: '', otp: '',
    flatNo: '', street: '', landmark: '', pincode: '', state: ''
  });
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // City autocomplete
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [apiCitySuggestions, setApiCitySuggestions] = useState([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);

  const localCitySuggestions = React.useMemo(() => {
    if (!formData.city || formData.city.length < 1 || !showCityDropdown) return [];
    const query = formData.city.toLowerCase();
    return indianCities.filter(c => c.city.toLowerCase().includes(query)).map(c => ({
      name: c.city, display_name: `${c.state}, India`
    }));
  }, [formData.city, showCityDropdown]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (formData.city && formData.city.length > 1 && showCityDropdown && localCitySuggestions.length < 3) {
        setIsSearchingCity(true);
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.city)}&format=json&addressdetails=1&countrycodes=in&featuretype=settlement&limit=5`);
          const mapped = res.data.map(s => ({ name: s.name || s.display_name.split(',')[0], display_name: s.display_name }));
          setApiCitySuggestions(mapped);
        } catch {}
        finally { setIsSearchingCity(false); }
      } else { setApiCitySuggestions([]); }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [formData.city, showCityDropdown, localCitySuggestions.length]);

  const citySuggestions = React.useMemo(() => {
    const combined = [...localCitySuggestions, ...apiCitySuggestions];
    const unique = Array.from(new Map(combined.map(item => [item.name.toLowerCase(), item])).values());
    return unique.slice(0, 8);
  }, [localCitySuggestions, apiCitySuggestions]);

  const navigate = useNavigate();
  const { login: loginUser, enterGuest } = useAuth();

  const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setOtpStep(false);
    setErrorMsg('');
    if (newMode === 'signup') {
      setShowLanguageModal(true);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      if (mode === 'login') {
        if (method === 'password') {
          const res = await axios.post('/auth/login', { email: formData.email, password: formData.password });
          loginUser(res.data.user, res.data.token);
          navigate('/dashboard');
        } else {
          if (!otpStep) {
            await axios.post('/auth/send-otp', { email: formData.email });
            setOtpStep(true);
          } else {
            const res = await axios.post('/auth/verify-otp', { email: formData.email, otp: formData.otp, isLogin: true });
            loginUser(res.data.user, res.data.token);
            navigate('/dashboard');
          }
        }
      } else {
        // Direct signup — no OTP required
        if (formData.password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long');
          return;
        }
        const structuredAddress = { flatNo: formData.flatNo, street: formData.street, landmark: formData.landmark, pincode: formData.pincode, city: formData.city, state: formData.state };
        await axios.post('/auth/register', {
          name: formData.name, email: formData.email, phone: formData.phone,
          password: formData.password, role, location: formData.city,
          ...(role === 'pharmacy' && { pharmacyName: formData.pharmacyName, address: structuredAddress })
        });
        const res = await axios.post('/auth/login', { email: formData.email, password: formData.password });
        loginUser(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'An error occurred');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      <LanguageModal isOpen={showLanguageModal} onClose={() => setShowLanguageModal(false)} />

      <div className="bg-white dark:bg-slate-800 w-full max-w-[420px] p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-slate-700">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-slate-200 mb-2">
            {mode === 'login' ? t('auth.login.heading', { defaultValue: 'Welcome Back' }) : t('auth.signup.heading', { defaultValue: 'Create Account' })}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-8 font-medium">
            {mode === 'login' ? t('auth.login.tagline', { defaultValue: 'Sign in to continue your mission' }) : t('auth.login.tagline', { defaultValue: 'Join the movement against AMR' })}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-[0.8rem] text-center font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Role Toggle */}
          <div className="space-y-2">
            <label className="text-[0.75rem] text-gray-500 font-medium ml-1">{t('auth.login.iamA', { defaultValue: 'I am a' })}</label>
            <div className="flex gap-3">
              {['user', 'pharmacy'].map(r => (
                <button key={r} type="button" onClick={() => { setRole(r); setOtpStep(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${role === r ? 'border-green-500 bg-green-50 dark:bg-emerald-900/30 text-green-700 shadow-sm' : 'border-gray-200 dark:border-gray-700 text-gray-600 hover:bg-gray-50 dark:bg-slate-900'}`}
                >
                  {r === 'user' ? <User className="w-[14px] h-[14px]" /> : <Store className="w-[14px] h-[14px]" />}
                  {r === 'user' ? t('auth.login.userTab') : t('auth.login.pharmacyTab')}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex p-1 bg-gray-100/80 dark:bg-slate-700 rounded-lg">
            {['login', 'signup'].map(m => (
              <button key={m} type="button" onClick={() => handleModeSwitch(m)}
                className={`flex-1 py-1.5 text-[0.85rem] font-semibold rounded-md transition-all ${mode === m
                  ? m === 'login' ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 shadow-sm border border-gray-200 dark:border-gray-700/60' : 'bg-[#eefcf2] text-green-700 shadow-sm border border-green-100'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}
              >
                {m === 'login' ? t('auth.signup.login') : t('auth.login.signUp')}
              </button>
            ))}
          </div>

          {/* Login Method Toggle */}
          {mode === 'login' && (
            <div className="flex gap-2">
              <button type="button" onClick={() => { setMethod('password'); setOtpStep(false); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[0.85rem] font-semibold transition-colors ${method === 'password' ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-600/20' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:bg-slate-900'}`}>
                <Lock className="w-[14px] h-[14px]" /> {t('auth.login.password')}
              </button>
              <button type="button" onClick={() => { setMethod('otp'); setOtpStep(false); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[0.85rem] font-semibold transition-colors ${method === 'otp' ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-600/20' : 'border-green-100 bg-green-50 dark:bg-emerald-900/30/50 text-green-700 hover:bg-green-50 dark:bg-emerald-900/30'}`}>
                <Smartphone className="w-[14px] h-[14px]" /> {t('auth.login.otpLogin', { defaultValue: 'OTP' })}
              </button>
            </div>
          )}

          {/* Input Fields */}
          <div className="space-y-4">

            {/* Signup-only top fields */}
            {mode === 'signup' && !otpStep && (
              <>
                <div>
                  <label className="block text-[0.75rem] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">{t('auth.signup.name')}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      placeholder={t('auth.signup.enterName', { defaultValue: 'Enter your name' })}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.75rem] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">{t('auth.signup.phone')}</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                      placeholder={t('auth.signup.enterPhone', { defaultValue: 'Enter your phone number' })}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                  </div>
                </div>

                {/* City (user only) */}
                {role === 'user' && (
                  <div className="animate-in slide-in-from-top-2 duration-300 relative">
                    <label className="block text-[0.75rem] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">City</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center">📍</div>
                      <input type="text" name="city" value={formData.city}
                        onChange={e => { handleInputChange(e); setShowCityDropdown(true); }}
                        onFocus={() => setShowCityDropdown(true)}
                        onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                        required placeholder="e.g. Mumbai, Delhi"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                      {isSearchingCity && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />}
                    </div>
                    {showCityDropdown && citySuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {citySuggestions.map((sugg, i) => (
                          <div key={i} className="px-4 py-3 hover:bg-green-50 dark:bg-emerald-900/30 cursor-pointer border-b border-gray-50 last:border-0 text-sm text-gray-700 dark:text-gray-300"
                            onMouseDown={e => { e.preventDefault(); setFormData({ ...formData, city: sugg.name }); setShowCityDropdown(false); }}>
                            <span className="font-semibold">{sugg.name}</span>
                            <div className="text-[0.7rem] text-gray-500 mt-0.5 truncate">{sugg.display_name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Email */}
            {(!otpStep || mode === 'login') && (
              <div>
                <label className="block text-[0.75rem] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">{t('auth.login.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                    placeholder={t('auth.login.enterEmail', { defaultValue: 'Enter your email' })}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                </div>
              </div>
            )}

            {/* Password (with show/hide) */}
            {((method === 'password' && mode === 'login') || (mode === 'signup' && !otpStep)) && (
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1 mr-1">
                  <label className="text-[0.75rem] font-semibold text-gray-700 dark:text-gray-300">{t('auth.login.password')}</label>
                  {mode === 'login' && (
                    <button type="button" onClick={() => setShowForgot(true)}
                      className="text-[0.7rem] font-semibold text-green-600 hover:text-green-700 transition-colors">
                      {t('auth.login.forgotPassword')}
                    </button>
                  )}
                </div>
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('auth.login.enterPassword', { defaultValue: 'Enter your password' })}
                />
              </div>
            )}

            {/* OTP Input */}
            {otpStep && (
              <div>
                <label className="block text-[0.75rem] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                  {mode === 'signup' ? 'Email Verification OTP' : t('auth.login.otpLogin', { defaultValue: 'OTP' })}
                </label>
                {mode === 'signup' && (
                  <p className="text-xs text-gray-400 mb-2 ml-1">Check your inbox — a 6-digit code was sent to <span className="font-semibold text-gray-600">{formData.email}</span></p>
                )}
                <input type="text" name="otp" value={formData.otp}
                  onChange={e => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  required placeholder="• • • • • •"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm tracking-[0.5em] font-mono text-center" />
              </div>
            )}

            {/* Pharmacy fields */}
            {mode === 'signup' && role === 'pharmacy' && !otpStep && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="block text-[0.75rem] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">{t('auth.signup.pharmacyName')}</label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" name="pharmacyName" value={formData.pharmacyName} onChange={handleInputChange} required
                      placeholder={t('auth.signup.enterPharmacy', { defaultValue: 'Enter pharmacy name' })}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm" />
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-emerald-900/30/50 p-4 rounded-xl border border-green-100 flex flex-col gap-3 shadow-inner">
                  <h4 className="text-[0.8rem] font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-1"><span className="text-xl">🏢</span> Complete Pharmacy Address</h4>
                  <input type="text" name="flatNo" value={formData.flatNo} onChange={handleInputChange} required placeholder="Shop No. / Building Name / Complex" className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700 dark:text-gray-300" />
                  <input type="text" name="street" value={formData.street} onChange={handleInputChange} required placeholder="Street / Road / Sector" className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700 dark:text-gray-300" />
                  <div className="flex gap-3">
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="Landmark (Optional)" className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700 dark:text-gray-300" />
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required placeholder="Pincode" maxLength="6" className="w-[100px] px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700 dark:text-gray-300 text-center tracking-widest" />
                  </div>
                  <div className="flex gap-3">
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="City / District" className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700 dark:text-gray-300" />
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required placeholder="State" className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[0.85rem] focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex justify-center items-center bg-[#059669] hover:bg-[#047857] text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              otpStep ? t('auth.signup.verify') :
              mode === 'login' ? (method === 'otp' ? t('auth.forgotPassword.sendOTP') : t('auth.login.loginButton')) :
              t('auth.signup.createAccount')
            )}
          </button>
        </form>

        {/* Guest Mode */}
        <div className="mt-4 text-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
            <span className="text-xs text-gray-400 font-semibold">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
          </div>
          <button
            type="button"
            onClick={() => { enterGuest(); navigate('/dashboard'); }}
            className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-green-400 hover:text-green-600 dark:hover:text-green-400 font-semibold text-sm transition-all"
          >
            👀 Continue as Guest
          </button>
          <p className="text-[0.7rem] text-gray-400 mt-1.5">Explore the app — login to earn rewards</p>
        </div>

      </div>
    </AuthLayout>
  );
};

export default AuthPage;
