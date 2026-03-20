import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem("hideTutorial_v2") !== "true";
  });

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("hideTutorial_v2", "true");
  };

  return (
    <DashboardLayout>
      {/* Full Width Tutorial Box */}
      {showTutorial && (
        <div className="lg:col-span-12 mb-2 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-lg border-l-4 border-l-green-500 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2 flex items-center gap-2">
                👋 Did you know?
              </h3>
              <p className="text-gray-600 text-[0.85rem] leading-relaxed max-w-4xl font-medium">
                We show pharmacies registered on our platform below. But if you can't find one near you, don't worry!<br/><br/>
                Click the <span className="text-green-600 font-bold">Find Pharmacies</span> button in the menu to discover ANY pharmacy within 10km of your location using live search.
              </p>
            </div>
            <button 
              onClick={dismissTutorial}
              className="shrink-0 text-green-600 font-bold border border-green-600 rounded-lg px-5 py-2 hover:bg-green-50 transition-colors shadow-sm"
            >
              Got it ✓
            </button>
          </div>
        </div>
      )}

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
