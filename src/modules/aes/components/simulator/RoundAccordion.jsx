/**
 * RoundAccordion.jsx — Per-round collapsible detail view (Spec C.3 & C.4)
 * Shows all AES rounds as expandable sections. Each section lists every
 * sub-step (SubBytes, ShiftRows, MixColumns, AddRoundKey) with its State Matrix.
 *
 * Author: Imam Rizki Saputra (NIM 301230013)
 */

import { useState, useMemo } from 'react';
import useSimulatorStore from '../../store/simulatorStore';

// Colour per phase
const PHASE_CONFIG = {
  'Key Expansion': { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-600 dark:text-indigo-300', icon: 'vpn_key',       dot: 'bg-indigo-500' },
  'Initial Round': { bg: 'bg-rose-500/10',   border: 'border-rose-500/30',   text: 'text-rose-600   dark:text-rose-300',   icon: 'start',          dot: 'bg-rose-500'   },
  SubBytes:        { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-600  dark:text-amber-300',  icon: 'swap_horiz',     dot: 'bg-amber-500'  },
  InvSubBytes:     { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-600  dark:text-amber-300',  icon: 'swap_horiz',     dot: 'bg-amber-500'  },
  ShiftRows:       { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-600 dark:text-violet-300', icon: 'compare_arrows', dot: 'bg-violet-500' },
  InvShiftRows:    { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-600 dark:text-violet-300', icon: 'compare_arrows', dot: 'bg-violet-500' },
  MixColumns:      { bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   text: 'text-teal-600   dark:text-teal-300',   icon: 'view_column',    dot: 'bg-teal-500'   },
  InvMixColumns:   { bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   text: 'text-teal-600   dark:text-teal-300',   icon: 'view_column',    dot: 'bg-teal-500'   },
  AddRoundKey:     { bg: 'bg-rose-500/10',   border: 'border-rose-500/30',   text: 'text-rose-600   dark:text-rose-300',   icon: 'key',            dot: 'bg-rose-500'   },
};
const DEFAULT_CFG = PHASE_CONFIG.AddRoundKey;

// ─── Compact 4x4 matrix grid ─────────────────────────────────────────────────
function MiniMatrix({ matrix, cfg }) {
  if (!matrix || matrix.length !== 4) return null;
  return (
    <div className="grid grid-cols-4 gap-[3px] w-fit">
      {matrix.map((row, r) =>
        row.map((v, c) => (
          <div
            key={`${r}-${c}`}
            className={`w-8 h-8 flex items-center justify-center
              rounded-md font-mono text-[10px] font-bold
              ${cfg?.bg ?? 'bg-surface-container'} ${cfg?.border ?? 'border-outline-variant'}
              border text-on-surface`}
          >
            {v.toString(16).toUpperCase().padStart(2, '0')}
          </div>
        ))
      )}
    </div>
  );
}

// ─── Single step row ─────────────────────────────────────────────────────────
function StepRow({ step, prevMatrix, isActive, onClick }) {
  const cfg = PHASE_CONFIG[step.phase] ?? DEFAULT_CFG;
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200
      ${isActive ? `${cfg.border} ring-1 ring-inset ${cfg.border}` : 'border-outline-variant'}`}>
      <button
        onClick={() => { setOpen(!open); onClick?.(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high transition-colors text-left"
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
        <span className={`material-symbols-outlined text-sm flex-shrink-0 ${cfg.text}`}>{cfg.icon}</span>
        <span className={`text-xs font-semibold flex-1 ${isActive ? cfg.text : 'text-on-surface'}`}>
          {step.label.split('—').pop().trim()}
        </span>
        {isActive && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-on-secondary">
            Aktif
          </span>
        )}
        <span className="material-symbols-outlined text-sm text-on-surface-variant">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-outline-variant/50 space-y-3">
          <p className="text-xs text-on-surface-variant">{step.label}</p>
          <div className="overflow-x-auto">
            <MiniMatrix matrix={step.stateMatrix} cfg={cfg} />
          </div>
          {prevMatrix && (
            <details className="text-xs">
              <summary className="cursor-pointer text-on-surface-variant hover:text-on-surface">
                Tampilkan State sebelumnya
              </summary>
              <div className="mt-2 overflow-x-auto">
                <MiniMatrix matrix={prevMatrix} cfg={{ bg: 'bg-surface-container', border: 'border-outline-variant' }} />
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

// ─── One round section (collapsible) ─────────────────────────────────────────
function RoundSection({ title, steps, stepOffset, currentStep, setCurrentStep, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const isRoundActive = steps.some((_, i) => stepOffset + i === currentStep);

  return (
    <div className={`rounded-2xl border-2 transition-all duration-200
      ${isRoundActive ? 'border-primary/40 shadow-md shadow-primary/5' : 'border-outline-variant'}`}>
      {/* Round header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-container-high/50 transition-colors rounded-2xl"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
          ${isRoundActive ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}>
          {isRoundActive ? '▶' : steps.length}
        </div>
        <div className="flex-1 text-left">
          <p className={`text-sm font-bold ${isRoundActive ? 'text-primary' : 'text-on-surface'}`}>{title}</p>
          <p className="text-[11px] text-on-surface-variant">{steps.length} langkah</p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 border-t border-outline-variant/50">
          {steps.map((step, i) => (
            <StepRow
              key={stepOffset + i}
              step={step}
              prevMatrix={i > 0 ? steps[i - 1].stateMatrix : null}
              isActive={stepOffset + i === currentStep}
              onClick={() => setCurrentStep(stepOffset + i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function RoundAccordion() {
  const { steps, currentStep, setCurrentStep, hasResult, mode } = useSimulatorStore();

  // Group steps by round label prefix
  const groups = useMemo(() => {
    if (!steps.length) return [];
    const g = [];
    let cur = null;

    steps.forEach((step, idx) => {
      const label = step.label;
      let groupKey;
      if (label.includes('Key Expansion')) {
        groupKey = 'Key Expansion';
      } else if (label.includes('Initial Round')) {
        groupKey = 'Initial Round — AddRoundKey';
      } else {
        const m = label.match(/^(Round \d+)/);
        groupKey = m ? m[1] : label;
      }

      if (!cur || cur.key !== groupKey) {
        cur = { key: groupKey, title: groupKey, steps: [], offset: idx };
        g.push(cur);
      }
      cur.steps.push(step);
    });
    return g;
  }, [steps]);

  if (!hasResult || !steps.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="material-symbols-outlined text-primary">list_alt</span>
        <h3 className="font-display text-base font-semibold text-on-surface">
          Rincian Proses Per Ronde
        </h3>
        <span className="ml-auto text-xs text-on-surface-variant">
          {groups.length} seksi · {steps.length} langkah
        </span>
      </div>

      {groups.map((grp, gi) => (
        <RoundSection
          key={grp.key}
          title={grp.title}
          steps={grp.steps}
          stepOffset={grp.offset}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          defaultOpen={gi === 0 || grp.steps.some((_, i) => grp.offset + i === currentStep)}
        />
      ))}
    </div>
  );
}
