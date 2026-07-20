/**
 * simulatorStore.js — Zustand store for AES-128 CipherFlow Simulator
 * Author: Imam Rizki Saputra (NIM 301230013)
 *
 * Architecture:
 *  - steps[]      : flat ordered list of {label, stateMatrix, phase} snapshots
 *                   produced by the onStep callback from encrypt/decrypt
 *  - currentStep  : index into steps[]
 *  - mode         : 'encrypt' | 'decrypt'
 *
 * The store intentionally does NOT import encrypt/decrypt directly —
 * it will receive them lazily so the student can implement them in aes.js
 * without causing a crash at startup.
 */

import { create } from 'zustand';

// ─── Phase metadata for UI rendering ─────────────────────────────────────────
// Labels that arrive via onStep are matched against these prefixes to
// derive the operation type and colour theme.

export const PHASE_META = {
  'Key Expansion': { color: 'indigo', icon: 'vpn_key',       label: 'Key Expansion'  },
  'Initial Round': { color: 'rose',   icon: 'start',          label: 'Initial Round'  },
  'SubBytes':      { color: 'amber',  icon: 'swap_horiz',     label: 'SubBytes'       },
  'InvSubBytes':   { color: 'amber',  icon: 'swap_horiz',     label: 'InvSubBytes'    },
  'ShiftRows':     { color: 'violet', icon: 'compare_arrows', label: 'ShiftRows'      },
  'InvShiftRows':  { color: 'violet', icon: 'compare_arrows', label: 'InvShiftRows'   },
  'MixColumns':    { color: 'teal',   icon: 'view_column',    label: 'MixColumns'     },
  'InvMixColumns': { color: 'teal',   icon: 'view_column',    label: 'InvMixColumns'  },
  'AddRoundKey':   { color: 'rose',   icon: 'key',            label: 'AddRoundKey'    },
};

/** Best-effort match of a step label string to a PHASE_META key */
function detectPhase(label) {
  for (const key of Object.keys(PHASE_META)) {
    if (label.includes(key)) return key;
  }
  return 'AddRoundKey';
}

// ─── Deep-copy helper (matrices are small, JSON is fine) ─────────────────────
const deepCopy = (m) => JSON.parse(JSON.stringify(m));

// ─── Mock matrix for placeholder / fallback ──────────────────────────────────
const ZERO_MATRIX = Array.from({ length: 4 }, () => new Array(4).fill(0));

const makeMockSteps = () => {
  const phases = [
    'Key Expansion — W[4] RotWord', 'Key Expansion — W[4] SubWord',
    'Key Expansion — W[4] XOR Rcon', 'Key Expansion — W[4] Result',
    'Initial Round — AddRoundKey',
    'Round 1 — SubBytes', 'Round 1 — ShiftRows',
    'Round 1 — MixColumns', 'Round 1 — AddRoundKey',
    'Round 2 — SubBytes', 'Round 2 — ShiftRows',
    'Round 2 — MixColumns', 'Round 2 — AddRoundKey',
  ];
  return phases.map((label, i) => ({
    label,
    phase: detectPhase(label),
    stateMatrix: Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => (i * 17 + r * 4 + c) % 256)
    ),
    isMock: true,
  }));
};

// ─── Store ────────────────────────────────────────────────────────────────────

const useSimulatorStore = create((set, get) => ({

  // ── Input state ─────────────────────────────────────────────────────────────
  inputText:  new Array(16).fill(0),
  cipherKey:  new Array(16).fill(0),
  inputHex:   '00112233445566778899aabbccddeeff',
  keyHex:     '000102030405060708090a0b0c0d0e0f',

  // ── Simulation state ─────────────────────────────────────────────────────────
  mode:         'encrypt',   // 'encrypt' | 'decrypt'
  isRunning:    false,
  hasResult:    false,
  error:        null,

  // ── Steps (flat list of snapshots) ──────────────────────────────────────────
  steps:        [],
  currentStep:  0,

  // ── Result ───────────────────────────────────────────────────────────────────
  resultHex:    '',

  // ── Legacy: matrixHistory (kept for backward-compat with existing components)
  matrixHistory:  [],
  isEncrypted:    false,
  currentRoundIndex: 0,
  currentStepIndex:  0,

  // ─── Setters ─────────────────────────────────────────────────────────────────

  setInputHex: (hex) => set({ inputHex: hex }),
  setKeyHex:   (hex) => set({ keyHex: hex }),
  setMode:     (m)   => set({ mode: m }),

  parseHexString: (hexString) => {
    const cleaned = hexString.replace(/[^0-9a-fA-F]/g, '');
    const bytes = [];
    for (let i = 0; i < Math.min(32, cleaned.length); i += 2) {
      bytes.push(parseInt(cleaned.substr(i, 2), 16));
    }
    while (bytes.length < 16) bytes.push(0);
    return bytes.slice(0, 16);
  },

  setInputText: (text) => {
    if (Array.isArray(text) && text.length === 16) set({ inputText: text });
  },
  setCipherKey: (key) => {
    if (Array.isArray(key) && key.length === 16) set({ cipherKey: key });
  },

  // ─── Navigation ──────────────────────────────────────────────────────────────

  setCurrentStep: (i) => {
    const { steps } = get();
    set({ currentStep: Math.max(0, Math.min(steps.length - 1, i)) });
  },

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) set({ currentStep: currentStep + 1 });
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },

  // Legacy navigation (kept for RoundStepper backwards compat)
  setRound: (roundIndex) => set({ currentRoundIndex: Math.max(0, Math.min(10, roundIndex)) }),
  setStep:  (stepIndex)  => set({ currentStepIndex:  Math.max(0, Math.min(3, stepIndex)) }),

  // ─── Run encrypt ─────────────────────────────────────────────────────────────

  runEncrypt: async () => {
    const { parseHexString, inputHex, keyHex } = get();

    set({ isRunning: true, error: null, steps: [], hasResult: false });

    const inputBytes = parseHexString(inputHex);
    const keyBytes   = parseHexString(keyHex);

    set({ inputText: inputBytes, cipherKey: keyBytes });

    const collectedSteps = [];

    const onStep = (label, stateMatrix) => {
      collectedSteps.push({
        label,
        phase:       detectPhase(label),
        stateMatrix: deepCopy(stateMatrix),
        isMock:      false,
      });
    };

    let resultBytes;
    let usedMock = false;

    try {
      // Dynamic import so a throw('Not implemented') doesn't crash the UI
      const { encrypt } = await import('../services/aes.js');
      resultBytes = encrypt(inputBytes, keyBytes, onStep);
    } catch (err) {
      console.warn('[simulatorStore] encrypt() not ready:', err.message);
      // Fall back to mock data so the UI stays interactive
      collectedSteps.push(...makeMockSteps());
      usedMock = true;
      resultBytes = new Array(16).fill(0);
    }

    const resultHex = Array.from(resultBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // ── Build legacy matrixHistory for backward-compat ─────────────────────
    const STEP_NAMES = ['SubBytes', 'ShiftRows', 'MixColumns', 'AddRoundKey'];
    const legacyHistory = Array.from({ length: 11 }, (_, round) =>
      STEP_NAMES.map((operation) => ({
        operation,
        before: deepCopy(ZERO_MATRIX),
        after:  deepCopy(ZERO_MATRIX),
      }))
    );

    set({
      steps:        collectedSteps,
      currentStep:  0,
      mode:         'encrypt',
      hasResult:    true,
      isRunning:    false,
      resultHex,
      error:        usedMock ? '⚠️ Using placeholder data — implement aes.js to see real steps' : null,
      // Legacy
      matrixHistory: legacyHistory,
      isEncrypted:   true,
      currentRoundIndex: 0,
      currentStepIndex:  0,
    });
  },

  // ─── Run decrypt ─────────────────────────────────────────────────────────────

  runDecrypt: async () => {
    const { parseHexString, inputHex, keyHex } = get();

    set({ isRunning: true, error: null, steps: [], hasResult: false });

    const cipherBytes = parseHexString(inputHex);
    const keyBytes    = parseHexString(keyHex);

    const collectedSteps = [];
    const onStep = (label, stateMatrix) => {
      collectedSteps.push({
        label,
        phase:       detectPhase(label),
        stateMatrix: deepCopy(stateMatrix),
        isMock:      false,
      });
    };

    let resultBytes;
    let usedMock = false;

    try {
      const { decrypt } = await import('../services/aes.js');
      resultBytes = decrypt(cipherBytes, keyBytes, onStep);
    } catch (err) {
      console.warn('[simulatorStore] decrypt() not ready:', err.message);
      collectedSteps.push(...makeMockSteps());
      usedMock = true;
      resultBytes = new Array(16).fill(0);
    }

    const resultHex = Array.from(resultBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    set({
      steps:       collectedSteps,
      currentStep: 0,
      mode:        'decrypt',
      hasResult:   true,
      isRunning:   false,
      resultHex,
      error:       usedMock ? '⚠️ Using placeholder data — implement aes.js to see real steps' : null,
      // Legacy compat
      isEncrypted: true,
      currentRoundIndex: 0,
      currentStepIndex:  0,
    });
  },

  // ─── Reset ───────────────────────────────────────────────────────────────────

  reset: () => set({
    steps:        [],
    currentStep:  0,
    hasResult:    false,
    isRunning:    false,
    resultHex:    '',
    error:        null,
    matrixHistory:  [],
    isEncrypted:    false,
    currentRoundIndex: 0,
    currentStepIndex:  0,
  }),

  // ─── Legacy selectors (kept for existing components) ─────────────────────────

  getCurrentStepName: () => {
    const { steps, currentStep } = get();
    if (!steps[currentStep]) return 'SubBytes';
    const label = steps[currentStep].label;
    for (const key of Object.keys(PHASE_META)) {
      if (label.includes(key)) return key;
    }
    return 'SubBytes';
  },

  getCurrentMatrices: () => {
    const { steps, currentStep, hasResult } = get();
    if (!hasResult || !steps[currentStep]) return null;
    return {
      before: steps[Math.max(0, currentStep - 1)]?.stateMatrix ?? ZERO_MATRIX,
      after:  steps[currentStep].stateMatrix,
      operation: steps[currentStep].phase,
    };
  },
}));

export default useSimulatorStore;
