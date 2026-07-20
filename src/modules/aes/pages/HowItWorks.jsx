/**
 * HowItWorks.jsx — Beautifully animated explanation page for AES-128
 * Author: Imam Rizki Saputra (NIM 301230013)
 */

import { motion } from 'framer-motion';

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-on-background mb-8 text-center sm:text-left"
        >
          Cara Kerja AES-128
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="prose prose-lg max-w-none space-y-8 text-left"
        >
          {/* Section 1 */}
          <motion.section
            variants={itemVariants}
            className="bg-surface-container rounded-2xl p-6 sm:p-8 space-y-4 border border-outline-variant/30 shadow-sm"
          >
            <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
              Apa itu AES?
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Advanced Encryption Standard (AES) adalah cipher blok simetris yang diadopsi oleh 
              pemerintah Amerika Serikat pada tahun 2001. Algoritma ini mengenkripsi data dalam 
              ukuran blok tetap sebesar 128 bit menggunakan kunci berukuran 128, 192, atau 256 bit. 
              Simulator ini berfokus pada AES-128, yang menggunakan kunci berukuran 128 bit (16 byte).
            </p>
          </motion.section>

          {/* Section 2 */}
          <motion.section
            variants={itemVariants}
            className="bg-surface-container rounded-2xl p-6 sm:p-8 space-y-4 border border-outline-variant/30 shadow-sm"
          >
            <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
              Empat Operasi Utama
            </h2>

            <div className="space-y-6 pt-2">
              <div className="border-l-4 border-amber-500 pl-4 sm:pl-6">
                <h3 className="font-bold text-sm sm:text-base text-on-surface mb-1">1. SubBytes</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Langkah substitusi non-linear di mana setiap byte digantikan oleh byte lainnya 
                  berdasarkan tabel pencarian (lookup table) yang disebut S-Box.
                </p>
              </div>

              <div className="border-l-4 border-violet-500 pl-4 sm:pl-6">
                <h3 className="font-bold text-sm sm:text-base text-on-surface mb-1">2. ShiftRows</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Langkah transposisi di mana baris-baris pada state digeser secara siklis untuk 
                  memberikan difusi lintas kolom.
                </p>
              </div>

              <div className="border-l-4 border-teal-500 pl-4 sm:pl-6">
                <h3 className="font-bold text-sm sm:text-base text-on-surface mb-1">3. MixColumns</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Operasi pencampuran yang bekerja pada kolom-kolom state, mengombinasikan 
                  empat byte di setiap kolom menggunakan aritmetika Galois Field.
                </p>
              </div>

              <div className="border-l-4 border-rose-500 pl-4 sm:pl-6">
                <h3 className="font-bold text-sm sm:text-base text-on-surface mb-1">4. AddRoundKey</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Setiap byte pada state dikombinasikan dengan Round Key menggunakan operasi 
                  bitwise XOR. Ini adalah satu-satunya langkah yang menggunakan kunci cipher.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 3 */}
          <motion.section
            variants={itemVariants}
            className="bg-surface-container rounded-2xl p-6 sm:p-8 space-y-4 border border-outline-variant/30 shadow-sm"
          >
            <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
              Proses Enkripsi
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Enkripsi AES-128 terdiri dari 10 ronde ditambah dengan operasi awal AddRoundKey. 
              Setiap ronde (kecuali ronde terakhir) menerapkan keempat transformasi tersebut secara 
              berurutan. Ronde terakhir melewati langkah MixColumns. Struktur ini memastikan bahwa 
              enkripsi memberikan kebingungan (confusion) melalui SubBytes serta difusi (diffusion) 
              melalui ShiftRows dan MixColumns, sekaligus mengintegrasikan Round Key pada setiap ronde.
            </p>
          </motion.section>
        </motion.div>
      </div>
    </motion.div>
  );
}
