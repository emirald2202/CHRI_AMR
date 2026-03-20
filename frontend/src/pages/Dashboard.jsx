import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* Left Column (70%) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Placeholder: Google Maps Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-96 flex flex-col items-center justify-center text-center">
            <h3 className="text-gray-800 font-bold mb-2">Google Maps Integration</h3>
            <p className="text-sm text-gray-500">Interactive map with pharmacy markers will appear here (Step 8)</p>
        </div>
        
        {/* Placeholder: Disposal Status Tracker */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-56 flex flex-col items-center justify-center text-center">
            <h3 className="text-gray-800 font-bold mb-2">Disposal Actions & Tracker</h3>
            <p className="text-sm text-gray-500">Scheduling button and active requests tracker (Step 9)</p>
        </div>

      </div>

      {/* Right Column (30%) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Placeholder: Risk Calculator */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-80 flex flex-col items-center justify-center text-center">
            <h3 className="text-gray-800 font-bold mb-2">Environmental Risk Calculator</h3>
            <p className="text-sm text-gray-500">Chart.js visualizations and impact math (Step 12)</p>
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
