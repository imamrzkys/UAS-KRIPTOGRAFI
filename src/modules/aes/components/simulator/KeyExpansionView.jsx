/**
 * KeyExpansionView.jsx
 * Visualises the full AES-128 key schedule: W[0]..W[43] grouped into
 * 11 Round Keys (RK0-RK10), with g-function sub-steps for every word
 * at index i where i % 4 === 0.
 *
 * Data source: steps[] from simulatorStore that have label matching
 * "Key Expansion". Uses placeholder grid when real data not available yet.
 *
 * Author: Imam Rizki Saputra (NIM 301230013)
 */

import { useMemo } from 'react';
import useSimulatorStore from '../../store/simulatorStore';

// ─── Colour tokens per sub-step type ─────────────────────────────────────────
const SUB_STEP_STYLE = {
  RotWord:  'bg-violet-500/10 border-violet-500/30 text-violet-700 dark:text-violet-300',
  SubWord:  'bg-amber-500/10  border-amber-500/30  text-amber-700  dark:text-amber-300',
  'XOR Rcon': 'bg-teal-500/10 border-teal-500/30  text-teal-700   dark:text-teal-300',
  Result:   'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-300',
};

const SUB_STEP_ICON = {
  RotWord:    'rotate_right',
  SubWord:    'swap_horiz',
  'XOR Rcon': 'bolt',
  Result:     'check_circle',
};

// ─── Placeholder data (16 words = first 4 round keys + g-function details) ───
const PLACEHOLDER_WORDS = Array.from({ length: 44 }, (_, i) => ({
  index: i,
  hex: Array.from({ length: 4 }, (__, b) => ((i * 13 + b * 7) % 256).toString(16).padStart(2, '0')).join(''),
  isGWord: i >= 4 && i % 4 === 0,
  gSteps: i >= 4 && i % 4 === 0 ? {
    RotWord:    Array.from({ length: 4 }, (__, b) => (((i + b + 1) * 11) % 256).toString(16).padStart(2, '0')).join(''),
    SubWord:    Array.from({ length: 4 }, (__, b) => (((i + b + 2) * 17) % 256).toString(16).padStart(2, '0')).join(''),
    'XOR Rcon': Array.from({ length: 4 }, (__, b) => (((i + b + 3) * 19) % 256).toString(16).padStart(2, '0')).join(''),
  } : null,
  isMock: true,
}));

// ─── Helper: format hex string as "XX XX XX XX" ──────────────────────────────
const fmtWord = (hex) => hex.match(/.{2}/g)?.join(' ') ?? hex;

// ─── Sub-component: single word cell ─────────────────────────────────────────
function WordCell({ word, isActive }) {
  return (
    <div
      className={`
        relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-200
        ${isActive
          ? 'bg-indigo-500/15 border-indigo-500/50 scale-105 shadow-lg shadow-indigo-500/10'
          : 'bg-surface-container border-outline-variant hover:border-outline'
        }
      `}
    >
      <span className="text-[9px] font-mono text-on-surface-variant font-medium">
        W[{word.index}]
      </span>
      <span className="font-mono text-xs font-bold text-on-surface tracking-wide">
        {fmtWord(word.hex)}
      </span>
      {word.isMock && (
        <span className="text-[8px] text-on-surface-variant/50 italic">mock</span>
      )}
    </div>
  );
}

// ─── Sub-component: g-function panel ─────────────────────────────────────────
function GFunctionPanel({ wordIndex, gSteps, rconIndex }) {
  if (!gSteps) return null;

  const steps = ['RotWord', 'SubWord', 'XOR Rcon'];

  return (
    <div className="mt-3 p-3 rounded-xl bg-surface-container-high/50 border border-outline-variant/50 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-indigo-500 text-sm">functions</span>
        <span className="text-xs font-semibold text-on-surface-variant">
          g(W[{wordIndex - 1}]) — diterapkan pada W[{wordIndex}]
        </span>
        <span className="ml-auto text-[10px] font-mono text-on-surface-variant/60">
          Rcon[{rconIndex}]
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {steps.map((step) => (
          <div
            key={step}
            className={`rounded-lg border p-2 text-center ${SUB_STEP_STYLE[step]}`}
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className="material-symbols-outlined text-[14px]">{SUB_STEP_ICON[step]}</span>
              <span className="text-[10px] font-semibold">{step}</span>
            </div>
            <div className="font-mono text-[11px] font-bold">
              {fmtWord(gSteps[step])}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-component: one Round Key card ───────────────────────────────────────
function RoundKeyCard({ rkIndex, words, currentWordIndex }) {
  const isInitial = rkIndex === 0;
  const wordStart = rkIndex * 4;

  // Build a 4×4 display matrix from the 4 words (each word is 4 bytes → 1 column)
  const matrix = Array.from({ length: 4 }, (_, row) =>
    Array.from({ length: 4 }, (__, col) => {
      const wordHex = words[col]?.hex ?? '00000000';
      return wordHex.slice(row * 2, row * 2 + 2);
    })
  );

  return (
    <div className={`
      rounded-2xl border-2 p-5 space-y-4 transition-all duration-300
      ${isInitial
        ? 'border-primary/40 bg-primary/5'
        : 'border-outline-variant bg-surface-container hover:border-outline'
      }
    `}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
            ${isInitial ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}>
            {rkIndex}
          </div>
          <div>
            <div className="font-display text-sm font-semibold text-on-surface">
              Round Key {rkIndex}
            </div>
            <div className="text-[10px] font-mono text-on-surface-variant">
              W[{wordStart}]..W[{wordStart + 3}]
            </div>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant text-lg">key</span>
      </div>

      {/* 4×4 Hex Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {matrix.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className="aspect-square flex items-center justify-center bg-surface-container-low
                         border border-outline-variant/50 rounded-lg font-mono text-xs font-semibold
                         text-on-surface hover:bg-surface-container hover:scale-110
                         transition-all duration-150 cursor-default"
              title={`W[${wordStart + c}] byte ${r}: 0x${cell.toUpperCase()}`}
            >
              {cell.toUpperCase()}
            </div>
          ))
        )}
      </div>

      {/* 4 Words with g-function detail for i%4===0 words */}
      <div className="space-y-2">
        {words.map((word) => (
          <div key={word.index}>
            <WordCell word={word} isActive={word.index === currentWordIndex} />
            {word.isGWord && (
              <GFunctionPanel
                wordIndex={word.index}
                gSteps={word.gSteps}
                rconIndex={word.index / 4}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function KeyExpansionView() {
  const { steps, currentStep } = useSimulatorStore();

  // Filter key-expansion steps from the store
  const keySteps = useMemo(
    () => steps.filter(s => s.label.includes('Key Expansion')),
    [steps]
  );

  // Use real data if available, otherwise placeholder
  const words = keySteps.length > 0
    ? (() => {
        // Re-hydrate words from step snapshots
        // Each step has label like "Key Expansion — W[4] RotWord"
        const byIndex = {};
        for (const s of keySteps) {
          const m = s.label.match(/W\[(\d+)\]/);
          if (!m) continue;
          const wi = parseInt(m[1]);
          if (!byIndex[wi]) byIndex[wi] = { index: wi, hex: '????????', isGWord: wi >= 4 && wi % 4 === 0, gSteps: {}, isMock: false };
          const subStep = s.label.split(' — ').pop().replace(`W[${wi}] `, '');
          if (['RotWord', 'SubWord', 'XOR Rcon'].includes(subStep)) {
            byIndex[wi].gSteps[subStep] = s.stateMatrix.flat().map(v => v.toString(16).padStart(2,'0')).join('').slice(0,8);
          }
          if (subStep === 'Result') {
            byIndex[wi].hex = s.stateMatrix.flat().map(v => v.toString(16).padStart(2,'0')).join('').slice(0,8);
          }
        }
        return Array.from({ length: 44 }, (_, i) => byIndex[i] ?? PLACEHOLDER_WORDS[i]);
      })()
    : PLACEHOLDER_WORDS;

  // Active word index (derived from current step label)
  const currentStepData = steps[currentStep];
  const activeWordMatch = currentStepData?.label?.match(/W\[(\d+)\]/);
  const activeWordIndex = activeWordMatch ? parseInt(activeWordMatch[1]) : -1;

  // Group words into 11 Round Keys
  const roundKeys = Array.from({ length: 11 }, (_, rk) =>
    words.slice(rk * 4, rk * 4 + 4)
  );

  const isMockData = keySteps.length === 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-500">vpn_key</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-on-surface">
                Jadwal Key Expansion
              </h2>
              <p className="text-xs text-on-surface-variant font-mono">
                W[0]..W[43] → RK0..RK10 (11 × 16 byte)
              </p>
            </div>
          </div>
          {isMockData && (
            <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400
                             text-xs font-medium rounded-full border border-amber-500/30">
              Data placeholder
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-outline-variant/50">
          {[
            { label: 'RotWord',    style: SUB_STEP_STYLE['RotWord'],    icon: 'rotate_right'   },
            { label: 'SubWord',    style: SUB_STEP_STYLE['SubWord'],    icon: 'swap_horiz'     },
            { label: 'XOR Rcon',   style: SUB_STEP_STYLE['XOR Rcon'],   icon: 'bolt'           },
          ].map(({ label, style, icon }) => (
            <div key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${style}`}>
              <span className="material-symbols-outlined text-sm">{icon}</span>
              {label}
            </div>
          ))}
          <div className="ml-auto text-xs text-on-surface-variant self-center">
            g() diterapkan pada setiap W[i] di mana i mod 4 = 0
          </div>
        </div>
      </div>

      {/* Round Key Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {roundKeys.map((words, rkIndex) => (
          <RoundKeyCard
            key={rkIndex}
            rkIndex={rkIndex}
            words={words}
            currentWordIndex={activeWordIndex}
          />
        ))}
      </div>

      {/* Footer note */}
      {isMockData && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-lg flex-shrink-0">info</span>
            <div>
              <strong>Menampilkan data placeholder.</strong> Implementasikan <code className="font-mono bg-amber-500/10 px-1 rounded">keyExpansion()</code> pada{' '}
              <code className="font-mono bg-amber-500/10 px-1 rounded">aes.js</code> dan panggil{' '}
              <code className="font-mono bg-amber-500/10 px-1 rounded">onStep("Key Expansion — W[i] RotWord", ...)</code>{' '}
              dsb. di dalam fungsi Anda. Nilai riil akan menggantikan data ini secara otomatis.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
