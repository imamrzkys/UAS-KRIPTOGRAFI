import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SAESSimulator from './pages/Simulator/index';
import Navbar from '../../components/shared/Navbar';
import './index.css';

/* ─── Typewriter Hero Section untuk S-AES ──────────────── */
function SAESHeroSection() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const phrases = [
    ['MINI', 'AES'],
    ['16-BIT', 'BLOCK'],
    ['EASY', 'ROUNDS'],
    ['GF', 'FIELD'],
    ['KEY', 'FLOW']
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
    <section className="relative w-full py-8 md:py-12 border-b-4 border-black bg-[#FFEBF7] overflow-hidden px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 select-none animate-fadeIn">
      <div className="flex-1 max-w-2xl">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="nb-badge animate-pulse" style={{ background: '#FFE156' }}>S-AES</span>
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
          Simulator Interaktif S-AES — Visualisasi Key Expansion (w0-w5), Putaran Awal (AddRoundKey), SubNibbles, ShiftRows, MixColumns, dan Dekripsi Invers.
        </p>
        <div className="font-mono text-[9px] text-black/40 mt-2 uppercase tracking-widest">
          Imam Rizki Saputra · 301230013 · Kriptografi 2026
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-4 items-center md:flex-col md:items-end flex-shrink-0">
        {[
          ['2 ROUNDS', '#FFE156'],
          ['16-BIT BLOCK', '#FFFFFF'],
          ['16-BIT KEY', '#FF8FD8']
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

/* ─── S-AES Page ──────────────────────────────────────────── */
export default function SAESPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF5FB' }}>
      <Navbar accentColor="#FFE156" moduleLabel="S-AES" />
      <SAESHeroSection />
      <SAESSimulator />
      <footer style={{
        borderTop: '4px solid #111111', padding: '1rem 2rem',
        background: '#FFE156', textAlign: 'center',
        fontFamily: '"Space Mono", monospace', fontSize: '11px',
        fontWeight: 700, textTransform: 'uppercase', color: '#111111',
      }}>
        <strong>imam rizki saputra · 301230013</strong> | S-AES Simulator — Teknik Informatika UNIBBA · Kriptografi 2026
      </footer>
    </div>
  );
}
