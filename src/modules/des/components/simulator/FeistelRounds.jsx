import React, { useEffect } from 'react';
import { useDESStore } from '../../store/desStore.js';
import { NeoCard } from '../common/NeoCard.jsx';
import { NeoButton } from '../common/NeoButton.jsx';
import { RoundViewer } from './RoundViewer.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Cpu } from 'lucide-react';

export function FeistelRounds() {
  const {
    result,
    currentRound,
    setCurrentRound,
    isAutoplay,
    setIsAutoplay,
    autoplaySpeed,
    setAutoplaySpeed
  } = useDESStore();

  // Handle Autoplay timer
  useEffect(() => {
    let interval = null;
    if (isAutoplay && result) {
      interval = setInterval(() => {
        setCurrentRound(currentRound === 16 ? 1 : currentRound + 1);
      }, autoplaySpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoplay, currentRound, result, autoplaySpeed, setCurrentRound]);

  if (!result) {
    return (
      <NeoCard title="PIPELINE PUTARAN FEISTEL (1-16)" className="opacity-50">
        <div className="flex flex-col items-center justify-center py-12 text-black/40">
          <Cpu className="w-12 h-12 stroke-[3px] mb-4" />
          <p className="font-grotesk font-bold uppercase tracking-wider">
            Jalankan simulasi untuk menghasilkan Putaran Feistel
          </p>
        </div>
      </NeoCard>
    );
  }

  const activeRoundData = result.rounds[currentRound - 1];

  const handlePrev = () => {
    setIsAutoplay(false);
    setCurrentRound(currentRound - 1);
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setCurrentRound(currentRound + 1);
  };

  return (
    <section id="rounds" className="space-y-6">
      {/* 1. ROUND NAVIGATION CARD */}
      <NeoCard title="UNIT KONTROL JARINGAN FEISTEL">
        <div className="flex flex-col gap-6">
          {/* Autoplay & Speed Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brutal-surface p-4 border-3 border-black shadow-brutal-sm">
            <div className="flex items-center gap-3">
              <span className="font-grotesk font-black text-sm uppercase">Putar Otomatis (Autoplay):</span>
              <NeoButton
                variant={isAutoplay ? 'coral' : 'green'}
                onClick={() => setIsAutoplay(!isAutoplay)}
                className="px-4 py-2 text-xs"
              >
                {isAutoplay ? <Pause className="w-3.5 h-3.5 stroke-[3px]" /> : <Play className="w-3.5 h-3.5 stroke-[3px]" />}
                {isAutoplay ? 'JEDA ENGINE' : 'PUTAR UTAMA'}
              </NeoButton>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-grotesk font-black text-sm uppercase">Kecepatan:</span>
              <div className="flex border-2 border-black divide-x-2 divide-black bg-brutal-white font-mono text-xs overflow-hidden shadow-brutal-sm">
                {[800, 1200, 2000].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setAutoplaySpeed(speed)}
                    className={`px-3 py-1 font-bold transition-colors ${autoplaySpeed === speed ? 'bg-brutal-yellow text-black' : 'bg-brutal-white text-black/40'}`}
                  >
                    {speed}ms
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 16 Round select buttons */}
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-mono font-bold text-black/50 uppercase">
              Loncat langsung ke Putaran Feistel tertentu
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-8 xl:grid-cols-16 gap-2">
              {Array.from({ length: 16 }, (_, i) => i + 1).map((roundNum) => {
                const isActive = roundNum === currentRound;
                
                return (
                  <button
                    key={roundNum}
                    onClick={() => {
                      setIsAutoplay(false);
                      setCurrentRound(roundNum);
                    }}
                    className={`
                      border-3 border-black p-2 font-grotesk font-black text-sm transition-all duration-75 select-none
                      ${isActive ? 'bg-brutal-yellow translate-y-0.5 shadow-none' : 'bg-brutal-white shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:translate-y-0.5 active:shadow-none'}
                    `}
                    style={{ borderRadius: '0px' }}
                  >
                    {roundNum.toString().padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Steppers */}
          <div className="flex items-center justify-between border-t border-black/10 pt-4">
            <NeoButton variant="cream" onClick={handlePrev} disabled={currentRound === 1} className="text-xs px-2.5 py-2">
              <ChevronLeft className="w-4 h-4 stroke-[3px]" />
              <span className="hidden sm:inline">PUTARAN SEBELUMNYA</span>
            </NeoButton>
            
            <div className="font-grotesk font-black text-sm sm:text-lg text-black uppercase select-none">
              PUTARAN {currentRound.toString().padStart(2, '0')} / 16
            </div>

            <NeoButton variant="cream" onClick={handleNext} disabled={currentRound === 16} className="text-xs px-2.5 py-2">
              <span className="hidden sm:inline">PUTARAN BERIKUTNYA</span>
              <ChevronRight className="w-4 h-4 stroke-[3px]" />
            </NeoButton>
          </div>
        </div>
      </NeoCard>

      {/* 2. ROUND DETAILS WITH SMOOTH ANIMATION */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <RoundViewer roundData={activeRoundData} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default FeistelRounds;
