import React from 'react';

export function StepIndicator({ activeSection = 'hero', onSectionClick }) {
  const steps = [
    { id: 'input', label: 'Initialization', bg: 'bg-brutal-yellow' },
    { id: 'keysched', label: 'Key Schedule', bg: 'bg-brutal-purple' },
    { id: 'ip', label: 'Initial IP', bg: 'bg-brutal-orange' },
    { id: 'rounds', label: 'Feistel Rounds', bg: 'bg-brutal-yellow' },
    { id: 'ipinv', label: 'Inverse IP-1', bg: 'bg-brutal-purple' },
    { id: 'result', label: 'Final Result', bg: 'bg-brutal-green' }
  ];

  return (
    <div className="flex flex-col gap-3 w-full font-grotesk">
      <div className="text-xs uppercase tracking-widest font-black text-black/40 mb-1 select-none">
        Simulation Pipeline
      </div>
      <div className="flex flex-col border-3 border-black divide-y-3 divide-black bg-brutal-white shadow-brutal-sm">
        {steps.map((step, idx) => {
          const isActive = activeSection === step.id;
          
          return (
            <button
              key={step.id}
              onClick={() => onSectionClick && onSectionClick(step.id)}
              className={`
                w-full text-left px-4 py-3 flex items-center gap-3 transition-colors outline-none
                ${isActive ? step.bg + ' text-black font-extrabold' : 'bg-brutal-white text-black/60 hover:bg-brutal-cream hover:text-black'}
              `}
            >
              <span className="font-mono text-xs font-bold border-2 border-black bg-black text-white px-1.5 py-0.5">
                0{idx + 1}
              </span>
              <span className="uppercase text-sm tracking-wider">
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;
