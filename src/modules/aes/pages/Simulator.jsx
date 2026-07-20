/**
 * Simulator.jsx — Main AES-128 simulation page (Animated with Framer Motion)
 * Author: Imam Rizki Saputra (NIM 301230013)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfigPanel from '../components/simulator/ConfigPanel';
import StateMatrix from '../components/simulator/StateMatrix';
import RoundStepper from '../components/simulator/RoundStepper';
import OperationAccordion from '../components/simulator/OperationAccordion';
import LaboratoryInsight from '../components/simulator/LaboratoryInsight';
import KeyExpansionView from '../components/simulator/KeyExpansionView';
import ResultPanel from '../components/simulator/ResultPanel';
import RoundAccordion from '../components/simulator/RoundAccordion';
import useSimulatorStore from '../store/simulatorStore';

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

export default function Simulator() {
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
    <motion.div 
      initial="initial"
      animate="animate"
      variants={pageTransition}
      className="min-h-screen bg-background"
    >
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-surface-container/50 to-transparent border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container rounded-full border border-outline-variant/40">
              <span className="material-symbols-outlined text-primary text-sm">science</span>
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Laboratorium Interaktif
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-on-background">
              AES-128 CipherFlow Simulator
            </h1>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Konfigurasikan plaintext &amp; kunci rahasia, jalankan enkripsi atau dekripsi,
              lalu jelajahi setiap transformasi langkah-demi-langkah.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">

          {/* ── Left Column: Configuration & Navigation ── */}
          <div className="space-y-6">
            <ConfigPanel />
            <RoundStepper />
          </div>

          {/* ── Right Column: Visualization ── */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {hasResult ? (
                <motion.div
                  key="result-view"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Error / mock notice */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-500/8 border border-amber-500/25 rounded-2xl px-5 py-4
                                      text-sm text-amber-700 dark:text-amber-400 flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-xl flex-shrink-0">warning</span>
                      {error}
                    </motion.div>
                  )}

                  {/* ── Result Output ── */}
                  <ResultPanel />

                  {/* ── Toggle buttons ── */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setShowDetail(!showDetail)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold
                        border-2 transition-all duration-200
                        ${showDetail
                          ? 'bg-primary/10 border-primary/30 text-primary'
                          : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-outline'
                        }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {showDetail ? 'visibility' : 'visibility_off'}
                      </span>
                      {showDetail ? 'Sembunyikan' : 'Tampilkan'} Detail Proses
                    </button>

                    <button
                      onClick={() => setShowAccordion(!showAccordion)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold
                        border-2 transition-all duration-200
                        ${showAccordion
                          ? 'bg-secondary/10 border-secondary/30 text-secondary'
                          : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-outline'
                        }`}
                    >
                      <span className="material-symbols-outlined text-base">list_alt</span>
                      {showAccordion ? 'Sembunyikan' : 'Tampilkan'} Semua Ronde
                    </button>
                  </div>

                  {/* ── Full Round Accordion ── */}
                  <AnimatePresence>
                    {showAccordion && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <RoundAccordion />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Step-by-step detail section ── */}
                  <AnimatePresence>
                    {showDetail && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        {/* Laboratory Insight */}
                        <LaboratoryInsight />

                        {/* Operation accordion */}
                        {!isKeyExpansionStep && (
                          <OperationAccordion operation={currentOperation} />
                        )}

                        {/* Key Expansion View */}
                        {isKeyExpansionStep && (
                          <KeyExpansionView />
                        )}

                        {/* State Matrix Comparison */}
                        {!isKeyExpansionStep && matrices && (
                          <motion.div 
                            layout
                            className="bg-surface-container rounded-2xl p-4 sm:p-8 space-y-6 border border-outline-variant/40"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <h2 className="font-display text-base sm:text-lg font-bold text-on-surface">
                                Transformasi State
                              </h2>
                              <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/30">
                                <span className="text-[10px] sm:text-xs font-mono text-on-surface-variant">
                                  Langkah {currentStep + 1} / {steps.length}
                                </span>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                              <StateMatrix
                                matrix={matrices.before}
                                title="State Masukan (SEBELUM)"
                              />
                              <StateMatrix
                                matrix={matrices.after}
                                title="State Tersubstitusi (SESUDAH)"
                                highlightIndices={(() => {
                                  if (!matrices.before || !matrices.after) return [];
                                  const diff = [];
                                  for (let r = 0; r < 4; r++) {
                                    for (let c = 0; c < 4; c++) {
                                      if (matrices.before[r][c] !== matrices.after[r][c]) {
                                        diff.push([r, c]);
                                      }
                                    }
                                  }
                                  return diff;
                                })()}
                                glowClass={glowClass}
                              />
                            </div>
                          </motion.div>
                        )}

                        {/* Navigation Controls */}
                        <div className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/40">
                          <div className="flex items-center justify-between gap-2">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={prevStep}
                              disabled={!canGoPrev}
                              className={`
                                flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm
                                transition-all duration-300 shrink-0
                                ${canGoPrev
                                  ? 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                                  : 'bg-surface-container-low text-on-surface-variant cursor-not-allowed opacity-50'
                                }
                              `}
                            >
                              <span className="material-symbols-outlined text-base">arrow_back</span>
                              <span className="hidden sm:inline">Sebelumnya</span>
                            </motion.button>

                            <div className="text-center px-2 min-w-0 flex-1">
                              <div className="font-display text-xs sm:text-sm font-bold text-on-surface truncate">
                                {currentData?.label ?? currentOperation}
                              </div>
                              <div className="font-mono text-[10px] sm:text-xs text-on-surface-variant mt-0.5">
                                {currentStep + 1} / {steps.length}
                              </div>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={nextStep}
                              disabled={!canGoNext}
                              className={`
                                flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm
                                transition-all duration-300 shrink-0
                                ${canGoNext
                                  ? 'bg-primary text-on-primary hover:opacity-90'
                                  : 'bg-surface-container-low text-on-surface-variant cursor-not-allowed opacity-50'
                                }
                              `}
                            >
                              <span className="hidden sm:inline">Berikutnya</span>
                              <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                /* Empty state */
                <motion.div
                  key="empty-view"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-surface-container rounded-2xl p-8 sm:p-16 text-center space-y-6 border border-outline-variant/40"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full
                                  animate-pulse-glow">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '2.5rem' }}>
                      play_circle
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
                      Siap untuk Eksplorasi
                    </h3>
                    <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                      Konfigurasikan plaintext dan kunci rahasia, lalu klik{' '}
                      <strong>ENKRIPSI</strong> atau <strong>DEKRIPSI</strong>{' '}
                      untuk memulai visualisasi langkah-demi-langkah.
                    </p>
                  </div>
                  {isRunning && (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                      <span className="text-xs font-semibold">Memproses…</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
