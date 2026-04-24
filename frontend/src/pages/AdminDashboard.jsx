import React, { useState, useEffect } from 'react';
import { Users, Store, Trash2, Power, PowerOff, ShieldAlert, Loader2, MapPin, Search } from 'lucide-react';
import axios from '../api/axios';
import { useAuth } from '../contexts/Authcontext';
import DashboardLayout from '../components/DashboardLayout';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDestructive }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 relative animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-200 text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-3 text-white font-bold text-sm rounded-xl transition-all shadow-md ${isDestructive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-green-600 hover:bg-green-700 shadow-green-600/20'}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, targetId: null, actionName: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, pharmRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/pharmacies')
      ]);
      setUsers(userRes.data);
      setPharmacies(pharmRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleSuspend = async (id, suspendStatus) => {
    try {
      await axios.put(`/admin/pharmacies/${id}/suspend`, { suspend: suspendStatus });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to suspend pharmacy.');
    }
    setModalConfig({ isOpen: false });
  };

  const handleDelete = async (id, role) => {
    try {
      await axios.delete(`/admin/${role === 'pharmacy' ? 'pharmacies' : 'users'}/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete account.');
    }
    setModalConfig({ isOpen: false });
  };

  const openSuspendModal = (id, currentStatus) => {
    const isSuspending = currentStatus === 'active';
    setModalConfig({
      isOpen: true,
      type: 'suspend',
      targetId: id,
      actionStatus: isSuspending,
      title: isSuspending ? 'Suspend Pharmacy?' : 'Reactivate Pharmacy?',
      message: isSuspending ? 'This pharmacy will no longer be able to log in or accept requests.' : 'This pharmacy will be fully reactivated.',
      isDestructive: isSuspending
    });
  };

  const openDeleteModal = (id, role) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      targetId: id,
      role: role,
      title: 'Delete Account?',
      message: 'This action is permanent and cannot be undone. All data associated with this account will be lost.',
      isDestructive: true
    });
  };

  const executeModalAction = () => {
    if (modalConfig.type === 'suspend') {
      handleToggleSuspend(modalConfig.targetId, modalConfig.actionStatus);
    } else if (modalConfig.type === 'delete') {
      handleDelete(modalConfig.targetId, modalConfig.role);
    }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPharmacies = pharmacies.filter(p => (p.pharmacyName || p.name).toLowerCase().includes(searchQuery.toLowerCase()) || p.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <DashboardLayout>
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false })}
        onConfirm={executeModalAction}
        title={modalConfig.title}
        message={modalConfig.message}
        isDestructive={modalConfig.isDestructive}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20"><ShieldAlert className="w-32 h-32" /></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 tracking-tight">Admin Portal</h1>
            <p className="text-slate-300 font-medium max-w-xl">
              Welcome back, {user?.name}. Manage platform users, verify pharmacies, and maintain network integrity from this dashboard.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 w-full sm:w-auto">
             <button onClick={() => setActiveTab('users')}
               className={`flex-1 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'users' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
               <Users className="w-4 h-4" /> Users ({users.length})
             </button>
             <button onClick={() => setActiveTab('pharmacies')}
               className={`flex-1 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'pharmacies' ? 'bg-green-50 dark:bg-green-900/40 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
               <Store className="w-4 h-4" /> Pharmacies ({pharmacies.length})
             </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`} 
              className="w-full pl-10 pr-4 py-3 sm:py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm outline-none font-medium" 
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {activeTab === 'users' && filteredUsers.map(u => (
              <div key={u._id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                 <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-200 dark:border-indigo-800/50">
                     {u.name.charAt(0).toUpperCase()}
                   </div>
                   <button onClick={() => openDeleteModal(u._id, 'user')} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
                 <h3 className="font-extrabold text-gray-900 dark:text-slate-100 text-lg mb-1 truncate">{u.name}</h3>
                 <p className="text-sm text-gray-500 mb-3 truncate">{u.email}</p>
                 <div className="flex gap-2">
                   <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-slate-700 rounded-md text-gray-600 dark:text-gray-300">{u.phone}</span>
                   <span className="text-xs font-bold px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 rounded-md text-yellow-700 dark:text-yellow-400">{u.points} pts</span>
                 </div>
              </div>
            ))}

            {activeTab === 'pharmacies' && filteredPharmacies.map(p => {
              const isSuspended = p.accountStatus === 'suspended';
              return (
              <div key={p._id} className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border ${isSuspended ? 'border-red-200 dark:border-red-900/50 bg-red-50/30' : 'border-gray-100 dark:border-slate-700'} hover:shadow-md transition-shadow relative group`}>
                 <div className="flex justify-between items-start mb-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border ${isSuspended ? 'bg-red-100 text-red-600 border-red-200' : 'bg-green-100 dark:bg-emerald-900/40 text-green-600 border-green-200 dark:border-emerald-800/50'}`}>
                     <Store className="w-5 h-5" />
                   </div>
                   <div className="flex gap-1">
                     <button title={isSuspended ? 'Reactivate' : 'Suspend'} onClick={() => openSuspendModal(p._id, p.accountStatus)} className={`p-2 rounded-lg transition-colors ${isSuspended ? 'text-green-600 hover:bg-green-100' : 'text-orange-500 hover:bg-orange-50'}`}>
                       {isSuspended ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                     </button>
                     <button title="Delete" onClick={() => openDeleteModal(p._id, 'pharmacy')} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
                 <h3 className="font-extrabold text-gray-900 dark:text-slate-100 text-lg mb-0.5 truncate">{p.pharmacyName || p.name}</h3>
                 <p className="text-sm text-gray-500 mb-2 truncate">{p.name} • {p.email}</p>
                 <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-4 truncate w-full">
                     <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {p.location || (p.address?.city)}
                 </div>
                 <div className="flex items-center gap-2">
                   <span className={`text-[0.65rem] uppercase tracking-wider font-black px-2 py-1 rounded-md ${isSuspended ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {isSuspended ? 'Suspended' : 'Active'}
                   </span>
                   <span className="text-xs font-bold px-2 py-1 bg-yellow-100 dark:bg-yellow-900/40 rounded-md text-yellow-700 dark:text-yellow-400">★ {p.averageRating?.toFixed(1) || '0.0'}</span>
                 </div>
              </div>
            )})}

            {activeTab === 'users' && filteredUsers.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 font-medium">No users found.</div>
            )}
            {activeTab === 'pharmacies' && filteredPharmacies.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 font-medium">No pharmacies found.</div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
