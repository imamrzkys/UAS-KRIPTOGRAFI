import React, { useEffect, useState } from 'react';
import { useDESStore } from '../../store/desStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Terminal, Shield, Play } from 'lucide-react';

export function ProcessingEngine() {
  const { isSimulating, commitSimulationResult, pendingResult } = useDESStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [roundCounter, setRoundCounter] = useState(1);
  const [consoleLogs, setConsoleLogs] = useState([]);

  useEffect(() => {
    if (!isSimulating || !pendingResult) return;

    setCurrentStep(0);
    setRoundCounter(1);
    setConsoleLogs([
      '>> MENGINISIALISASI ENGINE DIGITAL ENCRYPTION STANDARD (DES)...',
      '>> MEMUAT BLOK DATA 64-BIT DAN CONFIG JADWAL KUNCI...'
    ]);

    // Timeline steps
    // 1. Initial key shifts
    const t1 = setTimeout(() => {
      setCurrentStep(1);
      setConsoleLogs(prev => [
        ...prev,
        '>> MENJALANKAN PEMILIHAN PERMUTASI 1 (PC-1)...',
        `>> PEMBAGIAN KUNCI: C0 = ${pendingResult.keySchedule.PC1_C0.slice(0, 14)}... D0 = ${pendingResult.keySchedule.PC1_D0.slice(0, 14)}...`,
        '>> MENGINISIALISASI IP (INITIAL PERMUTATION)...'
      ]);
    }, 300);

    // 2. Feistel rounds tick (ticks rapidly from 1 to 16)
    let roundInterval;
    const t2 = setTimeout(() => {
      setCurrentStep(2);
      setConsoleLogs(prev => [
        ...prev,
        '>> MATRIKS IP DITERAPKAN. L0 DAN R0 DIHASILKAN.',
        '>> MEMULAI 16 PUTARAN OPERASI JARINGAN FEISTEL:'
      ]);

      let r = 1;
      roundInterval = setInterval(() => {
        if (r <= 16) {
          setRoundCounter(r);
          setConsoleLogs(prev => [
            ...prev.slice(-6), // keep last few logs
            `   [PUTARAN ${r.toString().padStart(2, '0')}/16] L${r}=R${r-1}, R${r}=L${r-1} ⊕ f(R${r-1}, K${r})`
          ]);
          r++;
        } else {
          clearInterval(roundInterval);
        }
      }, 50); // 16 rounds * 50ms = 800ms
    }, 600);

    // 3. Final Swap and IP-INV
    const t3 = setTimeout(() => {
      setCurrentStep(3);
      setConsoleLogs(prev => [
        ...prev,
        '>> 16 PUTARAN JARINGAN FEISTEL BERHASIL DIEKSEKUSI.',
        '>> MELAKUKAN PERTUKARAN REGISTER AKHIR (R16 + L16)...',
        '>> MENJALANKAN INVERSE INITIAL PERMUTATION (IP-1)...'
      ]);
    }, 1450);

    // 4. Complete
    const t4 = setTimeout(() => {
      setCurrentStep(4);
      setConsoleLogs(prev => [
        ...prev,
        '>> PERMUTASI IP-1 SELESAI.',
        '>> BLOK CIPHERTEXT SELESAI DIRAKIT.',
        '>> EKSEKUSI SELESAI. MENGEMBALIKAN KONTROL...'
      ]);
      
      // Auto-commit after brief final pause
      const commitTimeout = setTimeout(() => {
        commitSimulationResult();
      }, 400);

      return () => clearTimeout(commitTimeout);
    }, 1850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (roundInterval) clearInterval(roundInterval);
    };
  }, [isSimulating, pendingResult, commitSimulationResult]);

  if (!isSimulating) return null;

  const stepsList = [
    { label: 'Jadwal Kunci & PC-1' },
    { label: 'Pemetaan Awal IP' },
    { label: '16 Putaran Feistel' },
    { label: 'Transformasi IP-1' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 select-none">
      <motion.div
        initial={{ scale: 0.9, y: 20, rotate: -1 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        className="w-full max-w-2xl border-4 border-black bg-brutal-white p-6 shadow-[8px_8px_0_#000] space-y-6 relative"
        style={{ borderRadius: '0px' }}
      >
        {/* Header decoration */}
        <div className="flex items-center justify-between border-b-4 border-black pb-4 bg-brutal-yellow p-4 -mx-6 -mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-brutal-yellow border-2 border-black flex items-center justify-center shadow-brutal-sm">
              <Cpu className="w-6 h-6 stroke-[3px] animate-spin" />
            </div>
            <div>
              <h3 className="font-syne font-black text-xl text-black">DES_ENGINE_PROSES</h3>
              <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 font-black">
                Eksekusi Pipeline Kriptografi
              </span>
            </div>
          </div>
          
          <button
            onClick={commitSimulationResult}
            className="px-4 py-2 border-3 border-black bg-black text-brutal-yellow hover:bg-brutal-coral hover:text-black font-grotesk font-black text-xs uppercase shadow-brutal-sm transition-all duration-75 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            style={{ borderRadius: '0px' }}
          >
            Lewati Animasi
          </button>
        </div>

        {/* Pipeline steps visual representation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {stepsList.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isActive = currentStep === idx;
            
            return (
              <div
                key={idx}
                className={`
                  border-3 border-black p-3 font-grotesk flex flex-col justify-between transition-colors
                  ${isCompleted ? 'bg-brutal-green text-black' : isActive ? 'bg-brutal-yellow text-black' : 'bg-brutal-surface text-black/30'}
                `}
                style={{ borderRadius: '0px' }}
              >
                <div className="font-mono text-xs font-black border-2 border-black bg-black text-white px-1.5 py-0.5 w-fit mb-2">
                  0{idx + 1}
                </div>
                <div className="text-xs font-black uppercase tracking-wider leading-tight">
                  {step.label}
                </div>
                {isActive && idx === 2 && (
                  <div className="mt-2 text-[10px] font-mono font-bold bg-black text-brutal-yellow text-center p-1 border border-black animate-pulse">
                    PUTARAN {roundCounter.toString().padStart(2, '0')}/16
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Terminal Outputs */}
        <div className="border-3 border-black bg-black p-4 h-48 overflow-y-auto font-mono text-[11px] text-brutal-green space-y-1.5 scrollbar-thin">
          <div className="flex items-center gap-1.5 border-b border-brutal-green/20 pb-2 mb-2">
            <Terminal className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider text-white">Log Pemrosesan Sistem</span>
          </div>
          <div className="space-y-1 select-text">
            {consoleLogs.map((log, i) => (
              <div key={i} className="leading-relaxed whitespace-pre-wrap">
                {log}
              </div>
            ))}
            {currentStep < 4 && (
              <div className="inline-block w-2.5 h-4 bg-brutal-green animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Technical animation - stream of random binary digits */}
        <div className="w-full h-8 overflow-hidden relative border-3 border-black bg-brutal-surface flex items-center justify-center">
          <div className="font-mono text-[10px] text-black/20 font-bold whitespace-nowrap overflow-hidden select-none w-full text-center">
            {Array.from({ length: 64 }).map(() => (Math.random() > 0.5 ? '1' : '0')).join(' ')}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brutal-yellow/20 to-transparent animate-pulse"></div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProcessingEngine;
