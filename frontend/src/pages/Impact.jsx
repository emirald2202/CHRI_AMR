import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Droplets, ShieldAlert, Leaf } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const environmentalData = {
  Antibiotic: {
    pnec: 0.0001, // mg/L (Extremely strict safety limit: 0.1 µg/L)
    amrFactor: 0.8, // 80% baseline risk
    ecoToxicity: 60,
    desc: "Even tiny traces (0.1 µg/L) of antibiotics in wastewater can trigger bacteria to rapidly mutate and gain AMR immunity defenses."
  },
  Painkiller: {
    pnec: 0.005, // mg/L for Diclofenac/Ibuprofen
    amrFactor: 0.05,
    ecoToxicity: 85,
    desc: "NSAIDs (like Diclofenac) are fatally toxic to aquatic life and birds, causing renal failure in fish and wiping out local populations."
  },
  Hormone: {
    pnec: 0.00001, // mg/L - Extreme toxicity
    amrFactor: 0.01,
    ecoToxicity: 98,
    desc: "Hormones from birth control can feminize entire male fish populations at staggering dilutions of just 10 nanograms per liter."
  },
  Antifungal: {
    pnec: 0.001, 
    amrFactor: 0.6,
    ecoToxicity: 75,
    desc: "Creates hyper-resistant fungal spores deep in soil and riverbed ecosystems."
  }
};

const Impact = () => {
  const [medicineType, setMedicineType] = useState('Antibiotic');
  const [quantity, setQuantity] = useState(1);
  const [mgPerPill, setMgPerPill] = useState(500); // Average 500mg
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState(null);

  const handleSimulate = () => {
    const data = environmentalData[medicineType];
    const totalMassMg = quantity * mgPerPill; 
    
    // Formula: Liters of water contaminated beyond safe safety thresholds (PNEC)
    const litersContaminated = Math.round(totalMassMg / data.pnec);
    
    // Logarithmic curve for AMR risk to represent biological saturation
    const resistanceRisk = Math.min(Math.round(data.amrFactor * 100 * (1 - Math.exp(-quantity/4))), 99);
    
    const ecoScore = Math.min(Math.round(data.ecoToxicity + (quantity * 1.5)), 100);
    
    setResults({
      waterContaminated: litersContaminated.toLocaleString(),
      rawWater: litersContaminated,
      resistanceRisk: resistanceRisk < 5 ? 5 : resistanceRisk, 
      ecoScore,
      description: data.desc
    });
    setCalculated(true);
  };

  const chartData = {
    labels: ['Water Contamination Risk', 'Eco Toxicity Score', 'Resistance Spread Risk'],
    datasets: [
      {
        label: 'Risk Level (%)',
        data: calculated ? [
            Math.min(results.rawWater / 500000, 100), // Scale assuming 50M Liters is 100% max cap for chart visual
            results.ecoScore, 
            results.resistanceRisk
        ] : [0, 0, 0],
        backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  return (
    <DashboardLayout>
      <div className="lg:col-span-12 flex flex-col gap-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div>
              <h2 className="text-[1.6rem] font-extrabold text-gray-800 mb-1.5 tracking-tight">Environmental Risk Calculator</h2>
              <p className="text-[0.85rem] font-medium text-gray-500">Discover the hidden ecological damage of throwing common medicines in the trash or flushing them down the sink.</p>
            </div>
            <div className="bg-green-50 text-green-700 font-bold px-4 py-2.5 rounded-xl text-sm whitespace-nowrap shadow-sm border border-green-100">
              Be an AMR Defender 🌱
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6">What if you threw this away?</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest mb-2">Medicine Type</label>
                <select 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors font-semibold text-gray-700 text-sm shadow-sm"
                  value={medicineType}
                  onChange={(e) => setMedicineType(e.target.value)}
                >
                  <option value="Antibiotic">Antibiotic (e.g. Amoxicillin)</option>
                  <option value="Painkiller">Painkiller (e.g. Ibuprofen)</option>
                  <option value="Hormone">Hormones (e.g. Birth Control)</option>
                  <option value="Antifungal">Antifungal (e.g. Fluconazole)</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest mb-2">Quantity (Pills)</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors font-semibold text-gray-700 text-sm shadow-sm"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[0.65rem] font-bold text-gray-500 uppercase tracking-widest mb-2">Strength (mg per pill)</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors font-semibold text-gray-700 text-sm shadow-sm"
                    value={mgPerPill}
                    onChange={(e) => setMgPerPill(Number(e.target.value))}
                  />
                </div>
              </div>

              <button  
                onClick={handleSimulate}
                className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)]"
              >
                Simulate Impact
              </button>
            </div>
          </div>

          {/* Right: Results Chart */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-green-500 to-red-500"></div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-6">Contamination Risk Graph</h3>
            
            <div className="flex-1 flex items-center justify-center min-h-[250px] w-full">
               {calculated ? (
                 <Bar 
                    data={chartData} 
                    options={{ 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true, max: 100 } }
                    }} 
                 />
               ) : (
                  <div className="text-center text-gray-400 flex flex-col items-center">
                    <ShieldAlert className="w-14 h-14 mb-3 opacity-20" />
                    <p className="text-sm font-semibold">Use the calculator to reveal the risk graph.</p>
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {calculated && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm">
              <div className="bg-blue-100 p-3 rounded-2xl mb-3 text-blue-600 border border-blue-200"><Droplets className="w-6 h-6" /></div>
              <div className="font-black text-2xl text-blue-900 mb-1">{results.waterContaminated} L</div>
              <div className="text-[0.8rem] font-bold text-blue-700 uppercase tracking-wide">Water Contaminated</div>
              <div className="text-xs font-medium text-blue-500 mt-2">Driven above safe PNEC thresholds.</div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm">
              <div className="bg-red-100 p-3 rounded-2xl mb-3 text-red-600 border border-red-200"><ShieldAlert className="w-6 h-6" /></div>
              <div className="font-black text-2xl text-red-900 mb-1">{results.resistanceRisk}%</div>
              <div className="text-[0.8rem] font-bold text-red-700 uppercase tracking-wide">AMR Spread Risk</div>
              <div className="text-xs font-medium text-red-500 mt-2">Risk of creating resistant "superbugs".</div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm">
              <div className="bg-green-100 p-3 rounded-2xl mb-3 text-green-600 border border-green-200"><Leaf className="w-6 h-6" /></div>
              <div className="font-black text-2xl text-green-900 mb-1">{results.ecoScore}</div>
              <div className="text-[0.8rem] font-bold text-green-700 uppercase tracking-wide">Toxicity Score</div>
              <div className="text-xs font-medium text-green-500 mt-2">{results.description}</div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Impact;
