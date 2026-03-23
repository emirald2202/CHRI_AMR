import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Award, Medal, Trophy, User, Store } from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';
import { useTranslation } from 'react-i18next';

const generatedUsers = Array.from({ length: 50 }).map((_, i) => {
  const points = Math.floor(Math.random() * 350) + 10;
  return {
    id: `demo-${i + 1}`,
    name: `Demo User ${i + 1}`,
    points: points,
    disposals: Math.floor(points / 25) + 1
  };
});

const mockUsers = [...generatedUsers].sort((a, b) => b.points - a.points);

const generatedPharmacies = Array.from({ length: 50 }).map((_, i) => {
  return {
    id: `pharma-${i + 1}`,
    name: `Demo Pharmacy ${i + 1}`,
    collections: Math.floor(Math.random() * 300) + 10,
    rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
    score: Math.floor(Math.random() * 50) + 50
  };
});

const mockPharmacies = [...generatedPharmacies].sort((a, b) => b.collections - a.collections);

const getMedal = (index) => {
  if (index === 0) return <Award className="w-6 h-6 text-yellow-500 fill-yellow-100 mx-auto" />;
  if (index === 1) return <Award className="w-6 h-6 text-gray-400 fill-gray-100 mx-auto" />;
  if (index === 2) return <Award className="w-6 h-6 text-amber-700 fill-amber-100 mx-auto" />;
  return <span className="text-gray-500 font-bold">#{index + 1}</span>;
};

const Leaderboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [tab, setTab] = useState('users');

  return (
    <DashboardLayout>
      <div className="lg:col-span-12 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          
          <div className="bg-[#059669] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-slate-800/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
            
            <Trophy className="w-16 h-16 text-white mx-auto mb-4 opacity-90 drop-shadow-md" />
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{t('leaderboard.heading', {defaultValue: 'Top Contributors'})}</h2>
            <p className="text-green-100 max-w-2xl mx-auto text-sm font-medium">{t('leaderboard.description', {defaultValue: 'See who is making the biggest impact'})}</p>
          </div>

          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="flex bg-gray-100 p-1.5 rounded-xl w-full max-w-md">
                <button 
                  onClick={() => setTab('users')}
                  className={`flex-1 py-2.5 rounded-lg text-[0.8rem] font-bold transition-all flex items-center justify-center gap-2 ${tab === 'users' ? 'bg-white dark:bg-slate-800 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}
                >
                  <User className="w-4 h-4" /> {t('leaderboard.topUsers')}
                </button>
                <button 
                  onClick={() => setTab('pharmacies')}
                  className={`flex-1 py-2.5 rounded-lg text-[0.8rem] font-bold transition-all flex items-center justify-center gap-2 ${tab === 'pharmacies' ? 'bg-white dark:bg-slate-800 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}
                >
                  <Store className="w-4 h-4" /> {t('leaderboard.topPharmacies')}
                </button>
              </div>
            </div>

            {tab === 'users' ? (
              <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm shadow-gray-100/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-900/80 text-gray-500 text-[0.65rem] uppercase tracking-wider">
                      <th className="p-4 font-bold text-center w-24">{t('leaderboard.rank', {defaultValue: 'Rank'})}</th>
                      <th className="p-4 font-bold">{t('leaderboard.heroName', {defaultValue: 'Hero Name'})}</th>
                      <th className="p-4 font-bold text-center">{t('history.safeDisposals', {defaultValue: 'Safe Disposals'})}</th>
                      <th className="p-4 font-bold text-right">{t('leaderboard.totalPoints', {defaultValue: 'Total Points'})}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockUsers.map((u, i) => (
                      <tr key={u.id} className={`transition-colors hover:bg-gray-50 dark:bg-slate-900 ${user?.name === u.name ? 'bg-green-50 dark:bg-emerald-900/30/50 hover:bg-green-50 dark:bg-emerald-900/30/80' : ''}`}>
                        <td className="p-4 text-center align-middle">{getMedal(i)}</td>
                        <td className="p-4 font-bold text-gray-800 dark:text-slate-200 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 text-xs font-bold">
                            {u.name.charAt(0)}
                          </div>
                          {u.name} {user?.name === u.name && <span className="text-[10px] bg-green-200 text-green-800 font-bold px-2 py-0.5 rounded-full ml-2 shadow-sm">{t('leaderboard.you', {defaultValue: 'You'})}</span>}
                        </td>
                        <td className="p-4 text-center font-semibold text-gray-600">{u.disposals}</td>
                        <td className="p-4 text-right font-black text-green-600 text-lg">{u.points} <span className="text-xs text-gray-400 font-semibold tracking-wide uppercase">{t('common.pts')}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm shadow-gray-100/50">
                 <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-900/80 text-gray-500 text-[0.65rem] uppercase tracking-wider">
                      <th className="p-4 font-bold text-center w-24">{t('leaderboard.rank', {defaultValue: 'Rank'})}</th>
                      <th className="p-4 font-bold">{t('leaderboard.pharmacyNameLb', {defaultValue: 'Pharmacy'})}</th>
                      <th className="p-4 font-bold text-center">{t('leaderboard.medsCollected', {defaultValue: 'Collected'})}</th>
                      <th className="p-4 font-bold text-center">{t('leaderboard.rating', {defaultValue: 'Rating'})}</th>
                      <th className="p-4 font-bold text-right">{t('leaderboard.partScore', {defaultValue: 'Participation'})}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockPharmacies.map((p, i) => (
                       <tr key={p.id} className="transition-colors hover:bg-gray-50 dark:bg-slate-900">
                        <td className="p-4 text-center align-middle">{getMedal(i)}</td>
                        <td className="p-4 font-bold text-gray-800 dark:text-slate-200 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-100 border border-green-200 flex items-center justify-center text-green-600 shadow-sm">
                            <Store className="w-4 h-4" />
                          </div>
                          {p.name}
                        </td>
                        <td className="p-4 text-center font-semibold text-gray-600">{p.collections}</td>
                        <td className="p-4 text-center font-bold text-amber-500 flex justify-center items-center gap-1 mt-2">
                           {p.rating} ★
                        </td>
                        <td className="p-4 text-right font-black text-green-600 text-lg">{p.score}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
