import React from 'react';
import { useDESStore } from '../../store/desStore.js';
import { NeoCard } from '../common/NeoCard.jsx';
import { NeoButton } from '../common/NeoButton.jsx';
import { BinaryGrid } from '../common/BinaryGrid.jsx';
import { hexToBin } from '../../services/binaryUtils.js';
import { motion } from 'framer-motion';

export function InputPanel() {
  const {
    plaintext,
    key,
    mode,
    plaintextFormat,
    keyFormat,
    validationErrors,
    setPlaintext,
    setKey,
    setMode,
    togglePlaintextFormat,
    toggleKeyFormat
  } = useDESStore();

  // Highlight parity indices in 64-bit key: bits 8, 16, 24, 32, 40, 48, 56, 64 (0-based: 7, 15, 23, 31, 39, 47, 55, 63)
  const parityIndices = [7, 15, 23, 31, 39, 47, 55, 63];
  
  // Format key binary representation for parity viewer
  const getKeyBinaryString = () => {
    if (keyFormat === 'bin') return key.padEnd(64, '0');
    try {
      return hexToBin(key).padEnd(64, '0');
    } catch {
      return '0'.repeat(64);
    }
  };

  const getPlaintextBinaryString = () => {
    if (plaintextFormat === 'bin') return plaintext.padEnd(64, '0');
    try {
      return hexToBin(plaintext).padEnd(64, '0');
    } catch {
      return '0'.repeat(64);
    }
  };

  // Indices for binary grid labels (1 to 64)
  const bitIndices = Array.from({ length: 64 }, (_, i) => i + 1);

  return (
    <section id="input" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. PLAINTEXT INPUT CARD */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <NeoCard
          title="INPUT PLAINTEXT (DATA)"
          headerActions={
            <div className="flex border-2 border-black divide-x-2 divide-black bg-brutal-white font-mono text-xs overflow-hidden shadow-brutal-sm">
              <button
                onClick={() => plaintextFormat !== 'hex' && togglePlaintextFormat()}
                className={`px-3 py-1 font-bold ${plaintextFormat === 'hex' ? 'bg-brutal-yellow text-black' : 'bg-brutal-white text-black/40'}`}
              >
                HEX
              </button>
              <button
                onClick={() => plaintextFormat !== 'bin' && togglePlaintextFormat()}
                className={`px-3 py-1 font-bold ${plaintextFormat === 'bin' ? 'bg-brutal-yellow text-black' : 'bg-brutal-white text-black/40'}`}
              >
                BIN
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <label className="block text-xs font-mono font-black uppercase text-black/60">
              Blok Data 64-Bit {plaintextFormat === 'hex' ? '(16 Karakter Hexadesimal)' : '(64 Digit Biner)'}
            </label>
            
            <input
              type="text"
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              maxLength={plaintextFormat === 'hex' ? 16 : 64}
              className={`
                w-full p-4 font-mono text-lg border-3 border-black bg-brutal-cream text-black outline-none transition-colors
                ${validationErrors.plaintext ? 'border-brutal-coral focus:outline-brutal-coral' : 'border-black focus:bg-brutal-purple/15'}
              `}
              placeholder={plaintextFormat === 'hex' ? '0123456789ABCDEF' : '01000000...'}
            />

            {validationErrors.plaintext ? (
              <p className="text-xs font-mono font-extrabold text-brutal-coral uppercase">
                {validationErrors.plaintext}
              </p>
            ) : (
              <p className="text-xs font-mono font-bold text-black/40 uppercase">
                Status: Blok Plaintext Siap
              </p>
            )}

            {/* Real-time Binary Preview */}
            <div className="pt-2 border-t border-black/10">
              <div className="text-[10px] font-mono font-bold text-black/50 uppercase mb-2">
                Representasi Grid Biner
              </div>
              <div className="bg-brutal-surface p-3 border-3 border-black">
                <BinaryGrid
                  binaryString={getPlaintextBinaryString()}
                  highlightColor="purple"
                  highlightIndices={[]}
                  bitIndices={bitIndices}
                />
              </div>
            </div>
          </div>
        </NeoCard>
      </motion.div>

      {/* 2. CIPHER KEY INPUT CARD */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <NeoCard
          title="KUNCI ENKRIPSI (CIPHER KEY)"
          headerActions={
            <div className="flex border-2 border-black divide-x-2 divide-black bg-brutal-white font-mono text-xs overflow-hidden shadow-brutal-sm">
              <button
                onClick={() => keyFormat !== 'hex' && toggleKeyFormat()}
                className={`px-3 py-1 font-bold ${keyFormat === 'hex' ? 'bg-brutal-yellow text-black' : 'bg-brutal-white text-black/40'}`}
              >
                HEX
              </button>
              <button
                onClick={() => keyFormat !== 'bin' && toggleKeyFormat()}
                className={`px-3 py-1 font-bold ${keyFormat === 'bin' ? 'bg-brutal-yellow text-black' : 'bg-brutal-white text-black/40'}`}
              >
                BIN
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <label className="block text-xs font-mono font-black uppercase text-black/60">
              Kunci Rahasia 64-Bit {keyFormat === 'hex' ? '(16 Karakter Hexadesimal)' : '(64 Digit Biner)'}
            </label>

            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              maxLength={keyFormat === 'hex' ? 16 : 64}
              className={`
                w-full p-4 font-mono text-lg border-3 border-black bg-brutal-cream text-black outline-none transition-colors
                ${validationErrors.key ? 'border-brutal-coral focus:outline-brutal-coral' : 'border-black focus:bg-brutal-purple/15'}
              `}
              placeholder={keyFormat === 'hex' ? '133457799BBCDFF1' : '00010011...'}
            />

            {validationErrors.key ? (
              <p className="text-xs font-mono font-extrabold text-brutal-coral uppercase">
                {validationErrors.key}
              </p>
            ) : (
              <p className="text-xs font-mono font-bold text-black/40 uppercase">
                Status: Kunci Siap
              </p>
            )}

            {/* Key Parity Indicator */}
            <div className="pt-2 border-t border-black/10">
              <div className="text-[10px] font-mono font-bold text-black/50 uppercase mb-2 flex justify-between">
                <span>Pratinjau Bit Paritas (Bit abu-abu diabaikan dalam DES)</span>
              </div>
              <div className="bg-brutal-surface p-3 border-3 border-black">
                <BinaryGrid
                  binaryString={getKeyBinaryString()}
                  dimIndices={parityIndices}
                  highlightColor="yellow"
                  bitIndices={bitIndices}
                />
              </div>
            </div>
          </div>
        </NeoCard>
      </motion.div>

      {/* 3. MODE SELECTOR ROW */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.1 }}
        className="lg:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-3 border-black bg-brutal-white shadow-brutal-sm"
        style={{ borderRadius: '0px' }}
      >
        <div>
          <h4 className="font-grotesk font-black text-lg text-black uppercase">
            Pilihan Mode Simulator
          </h4>
          <p className="font-inter text-xs text-black/60">
            Pilih untuk melakukan enkripsi DES biasa atau dekripsi (menggunakan urutan subkey terbalik).
          </p>
        </div>
        
        <div className="flex border-3 border-black bg-brutal-white font-mono text-sm overflow-hidden shadow-brutal-sm shrink-0">
          <button
            onClick={() => setMode('encrypt')}
            className={`px-6 py-2.5 font-grotesk font-black uppercase text-sm flex items-center gap-2 transition-colors ${mode === 'encrypt' ? 'bg-brutal-purple text-black' : 'bg-brutal-white text-black/40'}`}
          >
            ENKRIPSI
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`px-6 py-2.5 font-grotesk font-black uppercase text-sm flex items-center gap-2 transition-colors ${mode === 'decrypt' ? 'bg-brutal-coral text-black' : 'bg-brutal-white text-black/40'}`}
          >
            DEKRIPSI
          </button>
        </div>
      </motion.div>
    </section>
  );
}

export default InputPanel;
