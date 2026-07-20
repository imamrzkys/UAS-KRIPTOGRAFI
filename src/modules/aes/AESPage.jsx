import { useState, useEffect } from 'react';
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

import Navbar from '../../components/shared/Navbar';

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

/* ─── Typewriter Hero Section untuk AES-128 ──────────────── */
function AESHeroSection() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const phrases = [
    ['AES', '128'],
    ['RIJN', 'DAEL'],
    ['STATE', 'FLOW'],
    ['SBOX', 'BYTE'],
    ['ROUND', 'STEPS']
  ];

  useEffect(() => {
    if (isTransitioning) return;
    const currentPhrase = phrases[currentPhraseIndex];
    const fullText = currentPhrase.join('\n');
    
    const typingSpeed = 150;
    const deleteSpeed = 70;
    const pauseAfterTyping = 3000;
    const transitionDelay = 1500;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < fullText.length) {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseAfterTyping);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          setIsTransitioning(true);
          setIsDeleting(false);
          setTimeout(() => {
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            setDisplayedText('');
            setIsTransitioning(false);
          }, transitionDelay);
        }
      }
    }, isDeleting ? deleteSpeed : (displayedText.length === fullText.length ? 0 : typingSpeed));

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhraseIndex, isTransitioning]);

  return (
    <section className="relative w-full py-8 md:py-12 border-b-4 border-black bg-[#FFDAF0] overflow-hidden px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 select-none animate-fadeIn">
      <div className="flex-1 max-w-2xl">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="nb-badge animate-pulse" style={{ background: '#FF8FD8' }}>AES-128</span>
          <span className="nb-badge bg-white">Tugas UAS • Sem 6</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentPhraseIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tighter uppercase text-black whitespace-pre-line min-h-[2.1em]"
          >
            {displayedText}
            {!isTransitioning && (
              <span className="inline-block w-1 h-[0.9em] bg-black ml-1 animate-pulse align-middle"></span>
            )}
          </motion.h2>
        </AnimatePresence>
        <p className="font-display font-extrabold text-xs sm:text-sm text-black/70 mt-3 max-w-xl uppercase">
          Simulator Interaktif AES-128 — Visualisasi Key Expansion, SubBytes, ShiftRows, MixColumns, AddRoundKey, State Matrix, dan Dekripsi Invers.
        </p>
        <div className="font-mono text-[9px] text-black/40 mt-2 uppercase tracking-widest">
          Imam Rizki Saputra · 301230013 · Kriptografi 2026
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-4 items-center md:flex-col md:items-end flex-shrink-0">
        {[
          ['10 ROUNDS', '#FF8FD8'],
          ['128-BIT BLOCK', '#FFFFFF'],
          ['128-BIT KEY', '#FFE156']
        ].map(([txt, bg], i) => (
          <motion.div
            key={txt}
            initial={{ scale: 0, rotate: i % 2 === 0 ? -15 : 15 }}
            animate={{ scale: 1, rotate: i % 2 === 0 ? -2 : 3 }}
            whileHover={{ scale: 1.1, rotate: 0, y: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 10, delay: i * 0.05 }}
            className="text-black border-[3px] border-black px-4 py-2 font-display font-black text-xs sm:text-sm uppercase shadow-sm select-none cursor-pointer"
            style={{ background: bg, borderRadius: '0px', boxShadow: '3px 3px 0px #111' }}
          >
            {txt}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

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
      {/* Shared Navbar */}
      <Navbar accentColor="#FF8FD8" moduleLabel="AES" />
      <AESHeroSection />

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
