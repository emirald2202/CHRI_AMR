import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';

const OnboardingTutorial = ({ steps, onComplete, currentStep, onNext }) => {
  const { t } = useTranslation();
  const [highlightStyle, setHighlightStyle] = useState({});

  useEffect(() => {
    const step = steps[currentStep];
    if (step && step.target) {
      const updatePosition = () => {
        const element = document.querySelector(step.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          setHighlightStyle({
            top: rect.top + window.scrollY - 8,
            left: rect.left + window.scrollX - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          });
          // Ensure the element is visible
          if (rect.top < 0 || rect.bottom > window.innerHeight) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [currentStep, steps]);

  if (currentStep >= steps.length) return null;

  const step = steps[currentStep];

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
    >
      {/* Shadow Overlay with Hole */}
      <div 
        className="absolute pointer-events-none rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-500 ease-in-out border-4 border-green-400 group"
        style={{
          ...highlightStyle,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
        }}
      >
         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white font-black text-[0.65rem] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 animate-bounce">
            <Sparkles className="w-3 h-3"/> Click This
         </div>
      </div>

      {/* Tooltip Content */}
      <div 
        className="absolute pointer-events-auto transition-all duration-300 transform translate-y-4"
        style={{
          top: highlightStyle.top + highlightStyle.height + 16,
          left: Math.max(16, Math.min(window.innerWidth - 352, highlightStyle.left + (highlightStyle.width / 2) - 168)),
        }}
      >
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-[336px] border border-green-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 bg-green-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-green-600 font-black">
                {currentStep + 1}
             </div>
             <h3 className="text-lg font-extrabold text-gray-800 dark:text-slate-100">
               {step.title}
             </h3>
          </div>
          <p className="text-[0.85rem] text-gray-500 dark:text-gray-400 mb-6 leading-relaxed font-medium">
            {step.description}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex gap-1.5">
               {steps.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-green-500' : 'w-2 bg-gray-200 dark:bg-slate-700'}`} />
               ))}
            </div>
            {step.manualNext && (
              <button 
                onClick={onNext}
                className="bg-green-600 hover:bg-green-700 text-white font-black py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
              >
                {currentStep === steps.length - 1 ? t('onboarding.done') : t('onboarding.ok')}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
