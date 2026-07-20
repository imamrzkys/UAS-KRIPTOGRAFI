import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const titles = [
    "Enkripsi Bukan Lagi Kotak Hitam.",
    "Visualisasikan Aliran Data AES-128.",
    "Kupas Tuntas Struktur Kriptografi."
  ];

  const [currentText, setCurrentText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    let timer;
    const currentTitle = titles[titleIndex];

    if (!isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(currentTitle.slice(0, currentText.length + 1));
        setTypingSpeed(80);
      }, typingSpeed);

      if (currentText === currentTitle) {
        setIsDeleting(true);
        setTypingSpeed(2500); // Pause for 2.5s when fully typed
      }
    } else {
      timer = setTimeout(() => {
        setCurrentText(currentTitle.slice(0, currentText.length - 1));
        setTypingSpeed(35); // Deleting is twice as fast
      }, typingSpeed);

      if (currentText === "") {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
        setTypingSpeed(400); // Small pause before typing next word
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, titleIndex, typingSpeed]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Academic Badge */}
        <motion.div variants={itemVariants} className="inline-block">
          <div className="inline-flex items-center px-4 py-1.5 bg-[#eae8e4] dark:bg-[#2e2927] rounded-full border border-outline-variant/40">
            <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant tracking-[0.18em] uppercase">
              Mesin Visualisasi Akademik
            </span>
          </div>
        </motion.div>

        {/* Heading with Typing Animation (Fixed height wrapper to prevent layout shifting) */}
        <div className="h-[90px] sm:h-[130px] md:h-[160px] flex items-center justify-center overflow-hidden">
          <motion.h1
            variants={itemVariants}
            className="m-0 p-0 font-display text-3xl sm:text-5xl md:text-6xl font-bold text-on-background leading-[1.2] max-w-4xl mx-auto"
          >
            <span>{currentText}</span>
            <span className="inline-block text-primary animate-pulse font-normal ml-1 select-none">|</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
        >
          Amati bagaimana AES-128 mentransformasi data, ronde demi ronde.
          Telusuri koreografi matematis bit dan byte dengan kejelasan visual yang mendalam.
        </motion.p>

        {/* CTA Button - Mulai Simulasi */}
        <motion.div variants={itemVariants} className="pt-2">
          <Link to="/simulator">
            <motion.button
              whileHover={{ scale: 1.05, shadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 bg-primary text-on-primary rounded-full font-semibold text-sm sm:text-base transition-all shadow-md"
            >
              Mulai Simulasi
            </motion.button>
          </Link>
        </motion.div>

        {/* Hero Illustration */}
        <motion.div
          variants={itemVariants}
          className="relative max-w-4xl mx-auto pt-10"
        >
          <div className="bg-gradient-to-br from-[#dfcbba] via-[#f7ebd9] to-[#ebd7c5] 
                        dark:from-[#2a1f18] dark:via-[#36271c] dark:to-[#221711] 
                        rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-outline-variant/40 min-h-[300px] sm:min-h-[380px] flex items-center justify-center">

            {/* Elegant Flowing Ribbon Waves (SVG) */}
            <div className="absolute inset-0 z-0">
              <svg viewBox="0 0 800 400" className="w-full h-full object-cover opacity-80" preserveAspectRatio="none">
                <defs>
                  {/* Glowing patterns and filters */}
                  <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bf9d7a" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#9c7247" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#805b33" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="waveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9c7247" stopOpacity="0.6" />
                    <stop offset="40%" stopColor="#dfcbba" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#9c7247" stopOpacity="0.7" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background Wave Ribbon paths */}
                <motion.path
                  d="M -50 250 C 150 100, 300 350, 450 200 C 600 50, 650 300, 850 150 L 850 450 L -50 450 Z"
                  fill="url(#waveGrad1)"
                  animate={{
                    d: [
                      "M -50 250 C 150 100, 300 350, 450 200 C 600 50, 650 300, 850 150 L 850 450 L -50 450 Z",
                      "M -50 270 C 160 120, 290 320, 460 220 C 580 80, 670 280, 850 170 L 850 450 L -50 450 Z",
                      "M -50 250 C 150 100, 300 350, 450 200 C 600 50, 650 300, 850 150 L 850 450 L -50 450 Z"
                    ]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.path
                  d="M -50 280 C 120 180, 270 300, 420 170 C 570 40, 700 240, 850 210 L 850 450 L -50 450 Z"
                  fill="url(#waveGrad2)"
                  opacity="0.6"
                  animate={{
                    d: [
                      "M -50 280 C 120 180, 270 300, 420 170 C 570 40, 700 240, 850 210 L 850 450 L -50 450 Z",
                      "M -50 260 C 130 200, 280 280, 400 190 C 550 70, 720 220, 850 190 L 850 450 L -50 450 Z",
                      "M -50 280 C 120 180, 270 300, 420 170 C 570 40, 700 240, 850 210 L 850 450 L -50 450 Z"
                    ]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Fine lines on waves for "choreography" vibe */}
                <path d="M -50 250 C 150 100, 300 350, 450 200 C 600 50, 650 300, 850 150" fill="none" stroke="#ebd7c5" strokeWidth="2" opacity="0.4" />
                <path d="M -50 260 C 140 120, 290 330, 440 210 C 590 60, 660 290, 850 170" fill="none" stroke="#ebd7c5" strokeWidth="1" opacity="0.3" />
                <path d="M -50 270 C 130 140, 280 310, 430 220 C 580 70, 670 270, 850 190" fill="none" stroke="#ebd7c5" strokeWidth="1" opacity="0.2" />
              </svg>
            </div>

            {/* Binary stream overlay on ribbon */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.05))] font-mono text-[10px] text-[#9c7247]/30 select-none overflow-hidden">
              <div className="absolute top-[40%] left-[10%] rotate-[-12deg]">01100101 01101110 01100011 01110010 01111001 01110000 01110100</div>
              <div className="absolute top-[60%] right-[15%] rotate-[-8deg]">01100100 01100101 01100011 01110010 01111001 01110000 01110100</div>
              <div className="absolute bottom-[20%] left-[30%] rotate-[-5deg]">00010001 00100010 00110011 01000100 01010101</div>
            </div>

            {/* Interactive Float Containers for Glass Orbs */}
            <div className="relative z-10 flex items-center justify-around w-full max-w-2xl px-4 flex-wrap gap-8 sm:gap-12">

              {/* Left Sphere - Closed Lock */}
              <motion.div
                className="text-center"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Globe with blur and shadow */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center
                                border border-white/40 shadow-[0_20px_50px_rgba(156,114,71,0.3)]
                                bg-white/10 dark:bg-white/5 backdrop-blur-md overflow-hidden group">
                  {/* Internal glare effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/40 pointer-events-none" />
                  <div className="absolute top-1 left-2 w-10 h-6 bg-white/20 rounded-full blur-[2px] rotate-[-20deg]" />

                  {/* Floating Lock Icon */}
                  <motion.span
                    className="material-symbols-outlined text-white text-4xl sm:text-5xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] select-none"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    lock
                  </motion.span>
                </div>
                <div className="mt-4">
                  <span className="text-white bg-black/25 dark:bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-mono tracking-wider font-semibold border border-white/10">
                    Plaintext
                  </span>
                </div>
              </motion.div>

              {/* Right Sphere - Open Lock */}
              <motion.div
                className="text-center"
                animate={{ y: [-15, 0, -15] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Globe with blur and shadow */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center
                                border border-white/40 shadow-[0_20px_50px_rgba(156,114,71,0.3)]
                                bg-white/10 dark:bg-white/5 backdrop-blur-md overflow-hidden group">
                  {/* Internal glare effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/40 pointer-events-none" />
                  <div className="absolute top-1 left-2 w-10 h-6 bg-white/20 rounded-full blur-[2px] rotate-[-20deg]" />

                  {/* Floating Lock Open Icon */}
                  <motion.span
                    className="material-symbols-outlined text-white text-4xl sm:text-5xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] select-none"
                    animate={{ scale: [1.05, 1, 1.05] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  >
                    lock_open
                  </motion.span>
                </div>
                <div className="mt-4">
                  <span className="text-white bg-black/25 dark:bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-mono tracking-wider font-semibold border border-white/10">
                    Ciphertext
                  </span>
                </div>
              </motion.div>

            </div>

          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}