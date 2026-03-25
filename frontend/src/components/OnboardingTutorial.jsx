import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, X } from 'lucide-react';

const OnboardingTutorial = ({ steps, onComplete, currentStep, onNext }) => {
  const { t } = useTranslation();
  const [highlightRect, setHighlightRect] = useState(null);
  const checkInterval = useRef(null);

  useEffect(() => {
    const step = steps[currentStep];
    if (step && step.target) {
      const updatePosition = () => {
        const element = document.querySelector(step.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setHighlightRect({
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              fullTop: rect.top + window.scrollY,
              fullLeft: rect.left + window.scrollX
            });
            return true;
          }
        }
        return false;
      };

      // Initial check
      if (!updatePosition()) {
         // Periodic check if element is not yet in DOM
         checkInterval.current = setInterval(() => {
            if (updatePosition()) clearInterval(checkInterval.current);
         }, 200);
      } else {
         // Keep it updated for animations
         checkInterval.current = setInterval(updatePosition, 500);
      }

      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      return () => {
        if (checkInterval.current) clearInterval(checkInterval.current);
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [currentStep, steps]);

  if (currentStep >= steps.length) return null;

  const step = steps[currentStep];

  return (
    <>
      {/* Interaction Blocking Overlay System */}
      {!highlightRect ? (
        <div className="fixed inset-0 z-[9998] bg-black/60 pointer-events-auto" />
      ) : (
        <div className="fixed inset-0 z-[9998] pointer-events-none">
          {/* Top */}
          <div className="absolute top-0 left-0 w-full bg-black/60 pointer-events-auto" style={{ height: highlightRect.top - 8 }} />
          {/* Bottom */}
          <div className="absolute bottom-0 left-0 w-full bg-black/60 pointer-events-auto" style={{ top: highlightRect.top + highlightRect.height + 8 }} />
          {/* Left */}
          <div className="absolute left-0 bg-black/60 pointer-events-auto" style={{ top: highlightRect.top - 8, height: highlightRect.height + 16, width: highlightRect.left - 8 }} />
          {/* Right */}
          <div className="absolute right-0 bg-black/60 pointer-events-auto" style={{ top: highlightRect.top - 8, height: highlightRect.height + 16, left: highlightRect.left + highlightRect.width + 8 }} />
          
          {/* The Border Box around the hole */}
          <div 
            className="absolute border-4 border-green-400 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 ease-in-out pointer-events-none"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
            }}
          >
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white font-black text-[0.65rem] px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 animate-bounce shadow-lg whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5"/> {t('onboarding.clickBelow', {defaultValue: 'Click This'})}
             </div>
          </div>
        </div>
      )}

      {/* Tooltip Content */}
      {highlightRect && (
        <div 
          className="fixed z-[10000] pointer-events-auto transition-all duration-300"
          style={{
            top: Math.min(window.innerHeight - 250, highlightRect.top + highlightRect.height + 24),
            left: Math.max(16, Math.min(window.innerWidth - 352, highlightRect.left + (highlightRect.width / 2) - 168)),
          }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-[336px] border border-green-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300 relative">
            <button onClick={onComplete} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-3">
               <div className="w-8 h-8 bg-green-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-green-600 font-black">
                  {currentStep + 1}
               </div>
               <h3 className="text-lg font-extrabold text-gray-800 dark:text-slate-100 italic">
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
      )}
    </>
  );
};

export default OnboardingTutorial;
