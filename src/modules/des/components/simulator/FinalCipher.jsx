import React, { useState } from 'react';
import { useDESStore } from '../../store/desStore.js';
import { NeoCard } from '../common/NeoCard.jsx';
import { NeoButton } from '../common/NeoButton.jsx';
import { BinaryGrid } from '../common/BinaryGrid.jsx';
import { Copy, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FinalCipher() {
  const { result } = useDESStore();
  const [copiedType, setCopiedType] = useState(null); // 'hex' | 'bin' | null

  if (!result) {
    return (
      <NeoCard title="HASIL SIMULASI AKHIR" className="opacity-50">
        <div className="flex flex-col items-center justify-center py-12 text-black/40">
          <Info className="w-12 h-12 stroke-[3px] mb-4" />
          <p className="font-grotesk font-bold uppercase tracking-wider">
            Jalankan simulasi untuk melihat keluaran akhir
          </p>
        </div>
      </NeoCard>
    );
  }

  const { ciphertextHex, ciphertextBin, mode, plaintextBin, keyBin } = result;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  return (
    <section id="result" className="space-y-6">
      {/* 1. TOAST COMPLETED NOTIFICATION */}
      <AnimatePresence>
        {copiedType && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-5 right-5 z-50 bg-brutal-green border-3 border-black p-4 shadow-brutal font-grotesk font-bold uppercase tracking-wider text-black flex items-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[3px]" />
            Nilai {copiedType === 'hex' ? 'Hex' : 'Biner'} berhasil disalin ke clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. RESULT BOX CARD */}
      <NeoCard variant="yellow" title="HASIL AKHIR CIPHERTEXT (KELUARAN)" shadowSize="lg">
        <div className="space-y-6">
          {/* Hex display */}
          <div className="bg-brutal-white border-3 border-black p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-brutal-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black text-black/40 uppercase">
                Nilai Hexadesimal (16 Hex)
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-black tracking-wider break-all select-all">
                {ciphertextHex}
              </div>
            </div>
            <NeoButton
              variant="cream"
              onClick={() => handleCopy(ciphertextHex, 'hex')}
              className="text-xs shrink-0 self-start md:self-center"
            >
              {copiedType === 'hex' ? <Check className="w-4 h-4 stroke-[3px]" /> : <Copy className="w-4 h-4 stroke-[3px]" />}
              {copiedType === 'hex' ? 'DISALIN!' : 'SALIN HEX'}
            </NeoButton>
          </div>

          {/* Binary display */}
          <div className="bg-brutal-white border-3 border-black p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-brutal-sm">
            <div className="space-y-1 w-full overflow-hidden">
              <span className="text-[10px] font-mono font-black text-black/40 uppercase">
                Representasi Biner 64-bit
              </span>
              <div className="bg-brutal-surface p-3 brutal-border overflow-x-auto w-full">
                <BinaryGrid binaryString={ciphertextBin} groupSize={8} highlightColor="green" highlightIndices={Array.from({ length: 64 }, (_, i) => i)} />
              </div>
            </div>
            <NeoButton
              variant="cream"
              onClick={() => handleCopy(ciphertextBin, 'bin')}
              className="text-xs shrink-0 self-start md:self-center"
            >
              {copiedType === 'bin' ? <Check className="w-4 h-4 stroke-[3px]" /> : <Copy className="w-4 h-4 stroke-[3px]" />}
              {copiedType === 'bin' ? 'DISALIN!' : 'SALIN BIN'}
            </NeoButton>
          </div>
        </div>
      </NeoCard>

      {/* 3. SUMMARY RECAP CARD */}
      <NeoCard title="REKAPITULASI LOG EKSEKUSI SIMULASI">
        <div className="font-mono text-xs divide-y-2 divide-black/10">
          <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-black/50 uppercase">Operasi Kriptografi:</span>
            <span className="font-black font-grotesk uppercase text-sm border-2 border-black bg-black text-white px-2 py-0.5">
              DES {mode === 'encrypt' ? 'ENKRIPSI' : 'DEKRIPSI'}
            </span>
          </div>

          <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-black/50 uppercase">Blok Input (Plaintext):</span>
            <span className="font-semibold text-black break-all">{plaintextBin}</span>
          </div>

          <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-black/50 uppercase">Kunci Cipher (Key):</span>
            <span className="font-semibold text-black break-all">{keyBin}</span>
          </div>

          <div className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="font-bold text-black/50 uppercase">Hasil Output (Ciphertext):</span>
            <span className="font-black text-brutal-coral break-all font-mono text-sm">
              {ciphertextHex}
            </span>
          </div>
        </div>
      </NeoCard>
    </section>
  );
}

export default FinalCipher;
