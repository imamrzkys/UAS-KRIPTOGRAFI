import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Neubrutalist Hero Header with smooth rotating typewriter animation (2 lines, max 5 chars each)
 */
export function HeroSection() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Banyak judul menarik, 2 kata (max 5 huruf per kata) - pas untuk mobile
  const phrases = [
    ['CYBER', 'SAFE'],
    ['DATA', 'LOCK'],
    ['CODE', 'GUARD'],
    ['BLOCK', 'CHAIN'],
    ['PIXEL', 'VAULT'],
    ['HASH', 'POWER'],
    ['BYTE', 'ARMOR'],
    ['AGENT', 'ZERO'],
    ['LOGIC', 'WALL'],
    ['NINJA', 'CRYPT']
  ];
  
  useEffect(() => {
    if (isTransitioning) return; // Skip saat transisi
    
    const currentPhrase = phrases[currentPhraseIndex];
    const fullText = currentPhrase.join('\n');
    
    const typingSpeed = 150; // Lebih lambat lagi (150ms per karakter - sangat smooth)
    const deleteSpeed = 70; // Lebih lambat saat hapus (70ms - smooth)
    const pauseAfterTyping = 3000; // Pause 3 detik setelah selesai ngetik
    const transitionDelay = 3000; // Delay 3 detik untuk transisi bersih
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Mode TYPING
        if (displayedText.length < fullText.length) {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        } else {
          // Selesai ngetik, pause dulu sebelum hapus
          setTimeout(() => setIsDeleting(true), pauseAfterTyping);
        }
      } else {
        // Mode DELETING
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          // Selesai hapus, transisi bersih ke judul berikutnya
          setIsTransitioning(true);
          setIsDeleting(false);
          
          setTimeout(() => {
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            setDisplayedText(''); // Pastikan bersih
            setIsTransitioning(false);
          }, transitionDelay);
        }
      }
    }, isDeleting ? deleteSpeed : (displayedText.length === fullText.length ? 0 : typingSpeed));
    
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhraseIndex, isTransitioning]);

  return (
    <section className="relative w-full py-8 md:py-12 border-b-4 border-black bg-brutal-cream overflow-hidden px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
      {/* Title */}
      <div className="flex-1 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentPhraseIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="font-syne font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tighter uppercase text-black select-none whitespace-pre-line min-h-[2em]"
          >
            {displayedText}
            {!isTransitioning && (
              <span className="inline-block w-1 h-[0.9em] bg-black ml-1 animate-pulse align-middle"></span>
            )}
          </motion.h2>
        </AnimatePresence>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          className="font-grotesk font-extrabold text-sm sm:text-lg text-black/70 mt-3 max-w-xl uppercase"
        >
          Simulator Interaktif Algoritma DES — Visualisasi Key Schedule, Jaringan Feistel & Substitusi S-Box.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
          className="font-mono text-[10px] text-black/50 mt-2 uppercase tracking-widest"
        >
          Imam Rizki Saputra · Teknik Informatika UNIBBA · Kriptografi 2026
        </motion.div>
      </div>

      {/* Badges Column */}
      <div className="flex flex-wrap gap-4 items-center md:flex-col md:items-end flex-shrink-0">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: -2 }}
          whileHover={{ scale: 1.1, rotate: 0, y: -4 }}
          transition={{ type: 'spring', stiffness: 220, damping: 10 }}
          className="bg-brutal-yellow text-black border-3 border-black px-4 py-2 font-grotesk font-black text-sm uppercase shadow-brutal-sm select-none cursor-pointer"
          style={{ borderRadius: '0px' }}
        >
          16 ROUNDS
        </motion.div>
        
        <motion.div
          initial={{ scale: 0, rotate: 15 }}
          animate={{ scale: 1, rotate: 3 }}
          whileHover={{ scale: 1.1, rotate: 0, y: -4 }}
          transition={{ type: 'spring', stiffness: 220, damping: 10, delay: 0.06 }}
          className="bg-brutal-purple text-black border-3 border-black px-4 py-2 font-grotesk font-black text-sm uppercase shadow-brutal-sm select-none cursor-pointer"
          style={{ borderRadius: '0px' }}
        >
          64-BIT BLOCK
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: -1 }}
          whileHover={{ scale: 1.1, rotate: 0, y: -4 }}
          transition={{ type: 'spring', stiffness: 220, damping: 10, delay: 0.12 }}
          className="bg-brutal-orange text-black border-3 border-black px-4 py-2 font-grotesk font-black text-sm uppercase shadow-brutal-sm select-none cursor-pointer"
          style={{ borderRadius: '0px' }}
        >
          56-BIT KEY
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
