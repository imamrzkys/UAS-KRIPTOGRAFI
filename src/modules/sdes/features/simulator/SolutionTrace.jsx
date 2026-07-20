import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulator } from '../../context/SimulatorContext';
import GlassCard from '../../components/ui/GlassCard';
import KeyGenTrace from '../keygen/KeyGenTrace';
import PipelineStep from '../../components/simulator/PipelineStep';
import Divider from '../../components/ui/Divider';
import './SolutionTrace.css';

/**
 * SolutionTrace - Panel trace yang bisa dibuka/tutup untuk melihat
 * langkah-langkah pembangkitan kunci dan proses cipher secara rinci.
 */
export default function SolutionTrace({ className = '' }) {
  const { state, dispatch } = useSimulator();
  const { trace, result, mode, showTrace } = state;

  if (!result || !trace) return null;

  // Cari blok Pembangkitan Kunci dan langkah-langkah cipher
  const keyGenBlock  = trace.find(t => t.label === 'Pembangkitan Kunci');
  const cipherSteps  = trace.filter(t => t.label !== 'Pembangkitan Kunci');

  return (
    <div className={`solution-trace ${className}`}>
      {/* Tombol buka/tutup */}
      <GlassCard
        className="solution-trace__header"
        onClick={() => dispatch({ type: 'TOGGLE_TRACE' })}
        style={{ cursor: 'pointer' }}
      >
        <div className="solution-trace__header-content">
          <span className="solution-trace__header-title uppercase">
            {showTrace ? 'Sembunyikan' : 'Tampilkan'} Langkah-Langkah Penyelesaian
          </span>
        </div>
        <motion.span
          className="solution-trace__arrow"
          animate={{ rotate: showTrace ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </GlassCard>

      {/* Konten trace yang bisa dilipat */}
      <AnimatePresence>
        {showTrace && (
          <motion.div
            className="solution-trace__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <GlassCard className="solution-trace__content-card">

              {/* Bagian 1: Pembangkitan Kunci */}
              {keyGenBlock && keyGenBlock.subTrace && (
                <div className="solution-trace__section">
                  <KeyGenTrace steps={keyGenBlock.subTrace} />
                </div>
              )}

              <Divider label={`Proses ${mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi'}`} />

              {/* Bagian 2: Langkah-langkah Feistel Cipher */}
              <div className="solution-trace__section">
                <h3 className="solution-trace__section-title uppercase">
                  Proses {mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi'} — Feistel Cipher
                </h3>
                <div className="solution-trace__pipeline">
                  {cipherSteps.map((step, idx) => (
                    <div key={idx} id={`trace-step-${step.step}`} className="solution-trace__step-group">
                      <PipelineStep
                        stepNumber={step.step}
                        label={step.label}
                        description={step.description}
                        input={step.input}
                        output={step.output}
                        table={step.table}
                        sbox={step.sbox}
                        delay={idx * 0.05}
                      />

                      {/* Sub-trace detail putaran Feistel */}
                      {step.subTrace && (
                        <div className="solution-trace__sub-steps">
                          <div className="solution-trace__sub-steps-title uppercase">
                            Detail Langkah Putaran:
                          </div>
                          {step.subTrace.map((subStep, subIdx) => (
                            <PipelineStep
                              key={subIdx}
                              stepNumber={subStep.step}
                              label={subStep.label}
                              description={subStep.description}
                              input={subStep.input}
                              output={subStep.output}
                              table={subStep.table}
                              sbox={subStep.sbox}
                              delay={(idx + subIdx * 0.1) * 0.05}
                              className="solution-trace__sub-pipeline-step"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
