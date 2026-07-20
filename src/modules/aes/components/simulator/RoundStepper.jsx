/**
 * RoundStepper.jsx — Navigation panel for AES simulation steps
 * Author: Imam Rizki Saputra (NIM 301230013)
 *
 * Navigates through the flat steps[] array from simulatorStore.
 * First item is always "Key Expansion" (shown as a special section).
 * Then groups remaining steps by round for quick jump navigation.
 */

import { useMemo } from 'react';
import useSimulatorStore from '../../store/simulatorStore';

const PHASE_COLORS = {
  'Key Expansion': 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300',
  'Initial Round': 'bg-rose-500/10   border-rose-500/30   text-rose-700   dark:text-rose-300',
  SubBytes:        'bg-amber-500/10  border-amber-500/30  text-amber-700  dark:text-amber-300',
  InvSubBytes:     'bg-amber-500/10  border-amber-500/30  text-amber-700  dark:text-amber-300',
  ShiftRows:       'bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300',
  InvShiftRows:    'bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300',
  MixColumns:      'bg-teal-500/10   border-teal-500/30   text-teal-700   dark:text-teal-300',
  InvMixColumns:   'bg-teal-500/10   border-teal-500/30   text-teal-700   dark:text-teal-300',
  AddRoundKey:     'bg-rose-500/10   border-rose-500/30   text-rose-700   dark:text-rose-300',
};

const PHASE_ICON = {
  'Key Expansion': 'vpn_key',
  'Initial Round': 'start',
  SubBytes:        'swap_horiz',
  InvSubBytes:     'swap_horiz',
  ShiftRows:       'compare_arrows',
  InvShiftRows:    'compare_arrows',
  MixColumns:      'view_column',
  InvMixColumns:   'view_column',
  AddRoundKey:     'key',
};

export default function RoundStepper() {
  const {
    steps,
    currentStep,
    setCurrentStep,
    hasResult,
    prevStep,
    nextStep,
    mode,
    error,
  } = useSimulatorStore();

  // Build a list of "round jump" entries: [{label, firstStepIndex}]
  const roundJumps = useMemo(() => {
    if (!steps.length) return [];

    const jumps = [];
    let lastRound = null;

    // Always add Key Expansion jump if there are KE steps
    const keIdx = steps.findIndex(s => s.label.includes('Key Expansion'));
    if (keIdx >= 0) jumps.push({ label: 'Key Exp.', firstStepIndex: keIdx, icon: 'vpn_key' });

    // Initial round
    const irIdx = steps.findIndex(s => s.label.includes('Initial Round'));
    if (irIdx >= 0) jumps.push({ label: 'Ronde Awal', firstStepIndex: irIdx, icon: 'start' });

    // Rounds 1-10
    for (let r = 1; r <= 10; r++) {
      const idx = steps.findIndex(s => s.label.startsWith(`Round ${r} —`) || s.label.startsWith(`Round ${r}:`));
      if (idx >= 0 && idx !== lastRound) {
        jumps.push({ label: `Ronde ${r}`, firstStepIndex: idx, icon: 'refresh' });
        lastRound = idx;
      }
    }

    return jumps;
  }, [steps]);

  const currentData = steps[currentStep];
  const progress = steps.length > 0 ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  if (!hasResult) {
    return (
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-on-surface-variant text-3xl">
            explore
          </span>
          <p className="text-sm text-on-surface-variant">
            Jalankan enkripsi atau dekripsi untuk menavigasi langkah
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant space-y-5">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-secondary text-xl">route</span>
          <h3 className="font-display text-lg font-semibold text-on-surface">Ronde AES</h3>
        </div>
        <p className="text-xs text-on-surface-variant">
          URUTAN PROSES: {steps.length} total langkah · Mode {mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi'}
        </p>
      </div>

      {/* Error / mock badge */}
      {error && (
        <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl
                        text-xs text-amber-700 dark:text-amber-400">
          {error}
        </div>
      )}

      {/* Round jump buttons */}
      {roundJumps.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-2">
            Lompat ke Ronde
          </label>
          <div className="flex flex-wrap gap-1.5">
            {roundJumps.map(({ label, firstStepIndex, icon }) => {
              const isActive = currentStep >= firstStepIndex &&
                (roundJumps.find(j => j.firstStepIndex > firstStepIndex)?.firstStepIndex ?? steps.length) > currentStep;
              return (
                <button
                  key={label}
                  onClick={() => setCurrentStep(firstStepIndex)}
                  className={`
                    px-2.5 py-1.5 rounded-lg font-mono text-[11px] font-semibold
                    transition-all duration-200 border-2 flex items-center gap-1
                    ${isActive
                      ? 'bg-secondary text-on-secondary border-secondary shadow-md scale-105'
                      : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:border-outline'
                    }
                  `}
                >
                  <span className="material-symbols-outlined text-[12px]">{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Current step info */}
      {currentData && (
        <div className={`px-4 py-3 rounded-xl border-2 ${PHASE_COLORS[currentData.phase] ?? PHASE_COLORS.AddRoundKey}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-sm">
              {PHASE_ICON[currentData.phase] ?? 'functions'}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider">
              {currentData.phase === 'Initial Round' ? 'Ronde Awal' : currentData.phase}
            </span>
            {currentData.isMock && (
              <span className="ml-auto text-[10px] opacity-60 italic">mock</span>
            )}
          </div>
          <p className="text-xs font-mono opacity-80 break-all">
            {currentData.label
              .replace(/Round\s+(\d+)/gi, 'Ronde $1')
              .replace(/Initial Round/g, 'Ronde Awal')
              .replace(/Result/g, 'Hasil')
            }
          </p>
        </div>
      )}

      {/* Prev / Next */}
      <div className="flex items-center gap-3">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200
            ${currentStep === 0
              ? 'bg-surface-container-low text-on-surface-variant/50 cursor-not-allowed'
              : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest hover:scale-[1.02]'
            }
          `}
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Sebelumnya
        </button>

        <span className="font-mono text-xs text-on-surface-variant text-center min-w-[60px]">
          {currentStep + 1} / {steps.length}
        </span>

        <button
          onClick={nextStep}
          disabled={currentStep >= steps.length - 1}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200
            ${currentStep >= steps.length - 1
              ? 'bg-surface-container-low text-on-surface-variant/50 cursor-not-allowed'
              : 'bg-primary text-on-primary hover:opacity-90 hover:scale-[1.02]'
            }
          `}
        >
          Berikutnya
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="pt-2 border-t border-outline-variant">
        <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1.5">
          <span>Progres</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-primary to-secondary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
