import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfigPanel from './components/simulator/ConfigPanel';
import StateMatrix from './components/simulator/StateMatrix';
import RoundStepper from './components/simulator/RoundStepper';
import OperationAccordion from './components/simulator/OperationAccordion';
import LaboratoryInsight from './components/simulator/LaboratoryInsight';
import KeyExpansionView from './components/simulator/KeyExpansionView';
import ResultPanel from './components/simulator/ResultPanel';
import RoundAccordion from './components/simulator/RoundAccordion';
import useSimulatorStore from './store/simulatorStore';

// AES-specific styles
import './index.css';

const OPERATION_GLOW_MAP = {
  SubBytes:        'glow-amber',
  InvSubBytes:     'glow-amber',
  ShiftRows:       'glow-violet',
  InvShiftRows:    'glow-violet',
  MixColumns:      'glow-teal',
  InvMixColumns:   'glow-teal',
  AddRoundKey:     'glow-rose',
  'Key Expansion': 'glow-indigo',
  'Initial Round': 'glow-rose',
};

export default function AESPage() {
  const {
    steps,
    currentStep,
    getCurrentMatrices,
    getCurrentStepName,
    hasResult,
    prevStep,
    nextStep,
    error,
    isRunning,
  } = useSimulatorStore();

  const [showDetail, setShowDetail] = useState(true);
  const [showAccordion, setShowAccordion] = useState(false);

  const matrices         = getCurrentMatrices();
  const currentOperation = getCurrentStepName();
  const glowClass        = OPERATION_GLOW_MAP[currentOperation] || '';

  const currentData        = steps[currentStep];
  const isKeyExpansionStep = currentData?.label?.includes('Key Expansion');

  const canGoPrev = currentStep > 0;
  const canGoNext = currentStep < steps.length - 1;

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background, #FFF8F0)' }}>
      {/* AES Navbar */}
      <nav
        className="sticky top-0 z-50 border-b-4 border-nb-text"
        style={{ background: '#FF8FD8' }}
      >
        <div className="nb-container flex items-center justify-between h-14 gap-4">
          <a href="/" className="flex items-center gap-2 font-display font-black text-nb-text text-lg uppercase tracking-tight hover:opacity-80">
            <span className="inline-flex items-center justify-center w-8 h-8 border-4 border-nb-text font-mono text-xs font-bold" style={{ background: '#111111', color: '#FF8FD8' }}>
              CF
            </span>
            <span className="hidden sm:inline">CryptoFlow</span>
            <span className="text-nb-text/40 font-normal hidden sm:inline">/</span>
            <span className="text-nb-text hidden sm:inline">AES-128</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="nb-badge" style={{ background: '#111111', color: '#FF8FD8' }}>128-bit</span>
            <span className="nb-badge bg-white">10 Rounds</span>
            <a href="/" className="nb-btn nb-btn-white text-xs px-3 py-1.5" style={{ boxShadow: '2px 2px 0px #111111' }}>← Home</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="border-b-4 border-nb-text p-6 md:p-10" style={{ background: '#FFDAF0' }}>
        <div className="nb-container">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight text-nb-text">
                AES-128
              </h1>
              <p className="font-mono text-sm text-nb-text/60 mt-1 font-bold uppercase">
                Advanced Encryption Standard — 128-bit Block · 10 Rounds
              </p>
              <p className="font-mono text-[10px] text-nb-text/40 mt-1 uppercase tracking-widest">
                Imam Rizki Saputra · 301230013 · Kriptografi 2026
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['SubBytes','ShiftRows','MixColumns','AddRoundKey'].map(op => (
                <span key={op} className="nb-badge" style={{ background: '#FF8FD8' }}>{op}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        className="nb-container py-8 space-y-8"
      >
        {/* Config Panel */}
        <div className="nb-card p-6">
          <ConfigPanel />
        </div>

        {error && (
          <div className="nb-card p-4 border-nb-error" style={{ borderColor: '#FF5757', background: '#FFE0E0' }}>
            <p className="font-mono text-sm font-bold text-red-700">{error}</p>
          </div>
        )}

        {hasResult && (
          <>
            <div className="nb-card p-4">
              <ResultPanel />
            </div>

            <div className="border-4 border-nb-text p-4" style={{ background: '#FFDAF0', boxShadow: '4px 4px 0px #111111' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-black text-xl uppercase">Visualisasi State</h2>
                <div className="flex gap-2">
                  <button
                    onClick={prevStep}
                    disabled={!canGoPrev}
                    className="nb-btn nb-btn-white text-sm disabled:opacity-40"
                  >← Prev</button>
                  <button
                    onClick={nextStep}
                    disabled={!canGoNext}
                    className="nb-btn nb-btn-yellow text-sm disabled:opacity-40"
                  >Next →</button>
                </div>
              </div>

              <RoundStepper />

              {isKeyExpansionStep ? (
                <KeyExpansionView />
              ) : (
                <div className={`transition-all rounded-sm ${glowClass}`}>
                  <StateMatrix matrices={matrices} operation={currentOperation} />
                  <LaboratoryInsight />
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setShowAccordion(v => !v)}
                className="nb-btn nb-btn-pink w-full justify-center text-sm mb-4"
                style={{ background: '#FF8FD8' }}
              >
                {showAccordion ? '▲ Sembunyikan' : '▼ Tampilkan'} Detail Semua Ronde
              </button>
              <AnimatePresence>
                {showAccordion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <RoundAccordion />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        <div className="border-3 border-black p-4 font-mono text-center text-xs uppercase text-black" style={{ background: '#FF8FD8' }}>
          <strong>imam rizki saputra · 301230013</strong> | AES-128 Simulator — Teknik Informatika UNIBBA · Kriptografi 2026
        </div>
      </motion.div>
    </div>
  );
}
