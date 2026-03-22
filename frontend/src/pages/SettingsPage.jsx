import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Settings, User, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="lg:col-span-12 flex flex-col gap-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#059669] p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <Settings className="w-14 h-14 text-white mx-auto mb-4 opacity-90 drop-shadow-md" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">{t('accountSettings')}</h2>
            <p className="text-green-100 text-sm font-medium">Manage your AMRiT account</p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="max-w-xl space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-green-100 p-2.5 rounded-xl shrink-0">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Name</p>
                  <p className="font-semibold text-gray-800">{user?.name || t('guest')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-green-100 p-2.5 rounded-xl shrink-0">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="font-semibold text-gray-800">{user?.email || '—'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-green-100 p-2.5 rounded-xl shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Account Type</p>
                  <p className="font-semibold text-gray-800 capitalize">{user?.role || t('user')}</p>
                </div>
              </div>

              {user?.location && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="bg-green-100 p-2.5 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Location</p>
                    <p className="font-semibold text-gray-800">{user.location}</p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-700"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
