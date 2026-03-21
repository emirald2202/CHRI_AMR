import React from 'react';
import { useAuth } from '../contexts/Authcontext';
import UserDashboard from '../components/UserDashboard';
import PharmacyDashboard from '../components/PharmacyDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Pure Role-Based Layout Routing
  if (user.role === 'pharmacy') {
    return <PharmacyDashboard />;
  }

  // Fallback to Standard Citizen Layout
  return <UserDashboard />;
};

export default Dashboard;
