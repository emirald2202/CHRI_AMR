import React from 'react';
import { ShieldCheck, MapPin, Award, TrendingUp, Users, Activity, Droplets, Store } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left Info Panel */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-[#f0fdf4] p-12 flex-col justify-between border-r border-green-100 relative overflow-hidden" 
        style={{ 
          backgroundImage: 'radial-gradient(#dcfce7 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px' 
        }}
      >
        
        {/* Soft green glow effect behind text */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-200 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

        <div className="max-w-xl relative z-10">
          <div className="flex items-center gap-2 text-green-700 font-bold text-xl mb-6">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            SafeDispose
          </div>
          
          <div className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-6 shadow-sm shadow-green-200">
            <ShieldCheck className="w-4 h-4" />
            Fighting Antimicrobial Resistance
          </div>
          
          <h1 className="text-[2.75rem] font-extrabold text-[#065f46] mb-4 leading-tight">
            Dispose Safely.<br/>Protect Tomorrow.
          </h1>
          
          <p className="text-gray-600 text-sm mb-10 leading-relaxed pr-8">
            Improper disposal of antibiotics contributes to one of the world's most serious health threats — antimicrobial resistance. Join our mission to make safe disposal easy and rewarding.
          </p>

          <div className="space-y-4">
            {/* Feature Cards */}
            <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-green-50 flex gap-4 items-start">
              <div className="text-green-500 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">Why Safe Disposal Matters</h3>
                <ul className="text-[0.8rem] text-gray-600 space-y-1.5">
                  <li className="flex gap-2 items-start"><span className="text-red-400 font-bold">•</span> Antibiotics in water systems accelerate drug-resistant bacteria</li>
                  <li className="flex gap-2 items-start"><span className="text-red-400 font-bold">•</span> 700,000+ deaths annually due to antimicrobial resistance</li>
                  <li className="flex gap-2 items-start"><span className="text-red-400 font-bold">•</span> Improper disposal contaminates soil and drinking water</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-green-50 flex gap-4 items-center">
              <div className="bg-green-50 p-2.5 rounded-full text-green-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Find Nearby Pharmacies</h3>
                <p className="text-[0.75rem] text-gray-500 mt-0.5">Locate participating pharmacies and disposal centers near you with our interactive map.</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-green-50 flex gap-4 items-center">
              <div className="bg-green-50 p-2.5 rounded-full text-green-500">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Earn Rewards</h3>
                <p className="text-[0.75rem] text-gray-500 mt-0.5">Get points and badges for every safe disposal. Climb the leaderboard and become an AMR Defender!</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-green-50 flex gap-4 items-center">
              <div className="bg-green-50 p-2.5 rounded-full text-green-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Track Your Impact</h3>
                <p className="text-[0.75rem] text-gray-500 mt-0.5">See how your contributions help protect the environment and combat antimicrobial resistance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid at Bottom */}
        <div className="grid grid-cols-2 gap-4 mt-8 relative z-10 max-w-xl">
          <div className="bg-white/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <ShieldCheck className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 text-lg">12,000+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">Antibiotics Safely Disposed</div>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <Store className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 text-lg">300+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">Participating Pharmacies</div>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <Droplets className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 text-lg">50,000+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">Liters of Water Protected</div>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-green-50 flex flex-col items-center justify-center text-center">
            <Users className="text-green-500 w-5 h-5 mb-2" />
            <div className="font-black text-gray-800 text-lg">8,500+</div>
            <div className="text-[0.65rem] text-gray-500 uppercase tracking-wide font-semibold mt-1">Active Users</div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
