import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  Settings, User, Mail, MapPin, ShieldCheck, Phone,
  Building2, Clock, Trash2, AlertTriangle, X, Check, Edit3
} from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

/* ── Static info row (pharmacy) ── */
const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
      <div className="bg-green-100 p-2.5 rounded-xl shrink-0">
        <Icon className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
};

/* ── Editable field row (user) ── */
const EditableRow = ({ icon: Icon, label, value, onChange, type = 'text', readOnly = false }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 group">
    <div className="bg-green-100 p-2.5 rounded-xl shrink-0">
      <Icon className="w-5 h-5 text-green-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      {readOnly ? (
        <p className="font-semibold text-gray-400 text-sm">{value}</p>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent font-semibold text-gray-800 dark:text-slate-200 text-sm outline-none border-b-2 border-transparent focus:border-green-400 transition-colors placeholder-gray-300"
        />
      )}
    </div>
    {!readOnly && (
      <Edit3 className="w-3.5 h-3.5 text-gray-300 group-focus-within:text-green-500 transition-colors shrink-0" />
    )}
  </div>
);

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isPharmacy = user?.role === 'pharmacy';

  /* ── Editable state (user only) ── */
  const [form, setForm]       = useState({ name: user?.name || '', phone: user?.phone || '', location: user?.location || '' });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [saveErr, setSaveErr] = useState('');

  /* ── Delete state ── */
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting]       = useState(false);
  const [deleteErr, setDeleteErr]     = useState('');

  const addressStr = user?.address
    ? [user.address.flatNo, user.address.street, user.address.landmark,
       user.address.city, user.address.state, user.address.pincode].filter(Boolean).join(', ')
    : null;

  /* ── Save profile ── */
  const handleSave = async () => {
    setSaving(true); setSaved(false); setSaveErr('');
    try {
      await axios.put('/users/me', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveErr(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete account ── */
  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    setDeleting(true); setDeleteErr('');
    try {
      await axios.delete('/users/me');
      logout();
      navigate('/login');
    } catch (err) {
      setDeleteErr(err.response?.data?.message || 'Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  const isDirty = form.name !== (user?.name || '') ||
                  form.phone !== (user?.phone || '') ||
                  form.location !== (user?.location || '');

  return (
    <DashboardLayout>
      <div className="lg:col-span-12 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">

          {/* ── Header ── */}
          <div className="bg-[#059669] p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-slate-800/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <Settings className="w-14 h-14 text-white mx-auto mb-4 opacity-90 drop-shadow-md" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
              {t('settings.heading')}
            </h2>
            <p className="text-green-100 text-sm font-medium">
              {isPharmacy ? 'Manage your AMRiT Pharmacy account' : 'Click any field below to edit your profile'}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="max-w-xl space-y-4">

              {/* ══ USER — Editable fields ══ */}
              {!isPharmacy && (
                <>
                  <EditableRow icon={User}  label={t('settings.name')}  value={form.name}     onChange={v => setForm(f => ({ ...f, name: v }))} />
                  <EditableRow icon={Phone} label={t('settings.phone')} value={form.phone}    onChange={v => setForm(f => ({ ...f, phone: v }))} />
                  <EditableRow icon={MapPin} label={t('settings.city')} value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} />
                  {/* Non-editable */}
                  <EditableRow icon={Mail}       label={t('settings.email')} value={user?.email}  readOnly />
                  <EditableRow icon={ShieldCheck} label="Account Type"       value="User"          readOnly />

                  {/* Save button */}
                  <div className="pt-1 flex items-center gap-3">
                    <button
                      onClick={handleSave}
                      disabled={!isDirty || saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      {saving ? (
                        <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
                      ) : (
                        <><Check className="w-4 h-4" />{t('settings.save')}</>
                      )}
                    </button>
                    {saved && <span className="text-green-600 text-sm font-semibold flex items-center gap-1"><Check className="w-4 h-4" /> Saved!</span>}
                    {saveErr && <span className="text-red-500 text-xs font-semibold">{saveErr}</span>}
                  </div>
                </>
              )}

              {/* ══ PHARMACY — Static fields ══ */}
              {isPharmacy && (
                <>
                  <InfoRow icon={User}        label={t('settings.name')}  value={user?.name} />
                  <InfoRow icon={Mail}        label={t('settings.email')} value={user?.email} />
                  <InfoRow icon={Phone}       label={t('settings.phone')} value={user?.phone} />
                  <InfoRow icon={ShieldCheck} label="Account Type"        value="Pharmacy" />
                  <InfoRow icon={Building2}   label="Pharmacy Name"       value={user?.pharmacyName} />
                  <InfoRow icon={MapPin}      label="Address"             value={addressStr} />
                  <InfoRow icon={Clock}       label="Opening Hours"       value={user?.openingHours} />
                </>
              )}

              {/* Back link */}
              <div className="pt-2">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700 transition-colors">
                  ← {t('common.back')} to Dashboard
                </Link>
              </div>

              {/* ── Danger Zone ── */}
              <div className="mt-4 border border-red-100 rounded-2xl p-5 bg-red-50/50">
                <p className="text-sm font-bold text-red-700 flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4" /> Danger Zone
                </p>
                <p className="text-xs text-red-500 mb-4">
                  Permanently deletes your account and all associated data. This cannot be undone.
                </p>
                <button
                  onClick={() => { setShowConfirm(true); setConfirmText(''); setDeleteErr(''); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowConfirm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-200 text-center mb-1">Delete Account</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              This will permanently delete your account,{' '}
              {isPharmacy ? 'all collection records' : 'all disposal history and points'}.{' '}
              There is <strong>no way to recover</strong> this data.
            </p>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
              Type <span className="text-red-600 font-black">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full border-2 border-gray-200 dark:border-gray-700 focus:border-red-400 outline-none rounded-xl px-4 py-3 text-sm font-semibold mb-4 transition-colors"
            />
            {deleteErr && (
              <p className="text-xs text-red-600 font-semibold mb-3 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {deleteErr}
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 font-bold text-sm hover:bg-gray-50 dark:bg-slate-900 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE' || deleting}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {deleting
                  ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Deleting…</>
                  : <><Trash2 className="w-4 h-4" />Yes, Delete</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SettingsPage;
