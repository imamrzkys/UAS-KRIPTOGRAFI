import React from 'react';
import { useDESStore } from '../../store/desStore.js';
import { NeoCard } from '../common/NeoCard.jsx';
import { BinaryGrid } from '../common/BinaryGrid.jsx';
import { SBoxVisualizer } from './SBoxVisualizer.jsx';
import { ArrowLeftRight } from 'lucide-react';

/**
 * Renders the detailed internal calculations of a single Feistel round.
 */
export function RoundViewer({ roundData }) {
  if (!roundData) return null;

  const {
    round,
    L_prev,
    R_prev,
    subkeyIndex,
    subkey,
    expandedR,
    xorResult,
    sboxDetails,
    sboxOutput,
    pOutput,
    xorLp,
    L,
    R,
    L_hex,
    R_hex,
    subkey_hex
  } = roundData;

  // Bits index helper arrays
  const indices32 = Array.from({ length: 32 }, (_, i) => i + 1);
  const indices48 = Array.from({ length: 48 }, (_, i) => i + 1);

  // Duplicated bit indices in E-Expansion (48 bits length)
  const duplicatedEIndices = [0, 5, 6, 11, 12, 17, 18, 23, 24, 29, 30, 35, 36, 41, 42, 47];

  return (
    <div className="space-y-6">
      {/* 1. UPPER HALVES BLOCK & SUBKEY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* L(i-1) Register */}
        <div className="border-3 border-black p-4 bg-brutal-white shadow-brutal-sm flex flex-col justify-between" style={{ borderRadius: '0px' }}>
          <div className="flex justify-between items-center mb-2 border-b border-black/10 pb-1">
            <span className="font-grotesk font-black text-sm uppercase text-brutal-coral">
              Blok Kiri L({round - 1})
            </span>
            <span className="font-mono text-xs font-bold border border-black bg-brutal-coral/20 px-2 py-0.5" style={{ borderRadius: '0px' }}>
              HEX: {L_prev ? L_hex : '00000000'}
            </span>
          </div>
          <BinaryGrid
            binaryString={L_prev}
            highlightColor="coral"
            bitIndices={indices32}
          />
        </div>

        {/* Subkey K_i Register */}
        <div className="border-3 border-black p-4 bg-brutal-white shadow-brutal-sm flex flex-col justify-between" style={{ borderRadius: '0px' }}>
          <div className="flex justify-between items-center mb-2 border-b border-black/10 pb-1">
            <span className="font-grotesk font-black text-sm uppercase text-brutal-purple">
              Subkey K({subkeyIndex})
            </span>
            <span className="font-mono text-xs font-bold border border-black bg-brutal-purple/20 px-2 py-0.5" style={{ borderRadius: '0px' }}>
              HEX: {subkey_hex}
            </span>
          </div>
          <BinaryGrid
            binaryString={subkey}
            highlightColor="purple"
            bitIndices={indices48}
          />
        </div>

        {/* R(i-1) Register */}
        <div className="border-3 border-black p-4 bg-brutal-white shadow-brutal-sm flex flex-col justify-between" style={{ borderRadius: '0px' }}>
          <div className="flex justify-between items-center mb-2 border-b border-black/10 pb-1">
            <span className="font-grotesk font-black text-sm uppercase text-brutal-orange">
              Blok Kanan R({round - 1})
            </span>
            <span className="font-mono text-xs font-bold border border-black bg-brutal-orange/20 px-2 py-0.5" style={{ borderRadius: '0px' }}>
              HEX: {R_prev ? R_hex : '00000000'}
            </span>
          </div>
          <BinaryGrid
            binaryString={R_prev}
            highlightColor="orange"
            bitIndices={indices32}
          />
        </div>
      </div>

      {/* 2. THE FEISTEL FUNCTION CASCADE */}
      <NeoCard title={`KASKADE FUNGSI PUTARAN ${round}`}>
        <div className="space-y-6">
          {/* A. Expansion mapping */}
          <div className="space-y-2 border-b border-black/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black border-2 border-black bg-black text-white px-2 py-0.5" style={{ borderRadius: '0px' }}>
                LANGKAH A
              </span>
              <h5 className="font-grotesk font-black text-sm uppercase">
                Permutasi Ekspansi E: R({round - 1}) 32-bit ➔ 48-bit
              </h5>
            </div>
            <p className="text-xs text-black/60 font-inter leading-relaxed">
              Mengekspansi Blok Kanan 32-bit menjadi 48-bit dengan menduplikasi bit-bit batas tertentu (ditandai warna oranye di bawah).
            </p>
            <div className="bg-brutal-surface p-3 brutal-border">
              <BinaryGrid
                binaryString={expandedR}
                highlightIndices={duplicatedEIndices}
                highlightColor="orange"
                bitIndices={indices48}
              />
            </div>
          </div>

          {/* B. XOR with Key */}
          <div className="space-y-3 border-b border-black/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black border-2 border-black bg-black text-white px-2 py-0.5" style={{ borderRadius: '0px' }}>
                LANGKAH B
              </span>
              <h5 className="font-grotesk font-black text-sm uppercase">
                Operasi XOR: R Ekspansi ⊕ Subkey K({subkeyIndex})
              </h5>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <div className="md:col-span-2 bg-brutal-surface p-3 brutal-border">
                <div className="text-[9px] font-mono font-bold text-black/50 mb-1 uppercase">R Ekspansi (48-bit)</div>
                <BinaryGrid binaryString={expandedR} groupSize={6} />
              </div>

              <div className="flex items-center justify-center font-grotesk font-black text-sm bg-brutal-coral border-3 border-black w-16 h-10 mx-auto shadow-brutal-sm" style={{ borderRadius: '0px' }}>
                XOR
              </div>

              <div className="md:col-span-2 bg-brutal-surface p-3 brutal-border">
                <div className="text-[9px] font-mono font-bold text-black/50 mb-1 uppercase">Subkey K (48-bit)</div>
                <BinaryGrid binaryString={subkey} groupSize={6} highlightColor="purple" />
              </div>
            </div>

            <div className="bg-brutal-yellow/10 p-3 border-3 border-black bg-brutal-yellow/5" style={{ border: '3px solid #000000' }}>
              <div className="text-[9px] font-mono font-bold text-black/50 mb-1 uppercase">Keluaran XOR (48-bit)</div>
              <BinaryGrid binaryString={xorResult} groupSize={6} highlightColor="yellow" />
            </div>
          </div>

          {/* C. S-Box Substitution */}
          <div className="space-y-2 border-b border-black/10 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-black border-2 border-black bg-black text-white px-2 py-0.5" style={{ borderRadius: '0px' }}>
                LANGKAH C
              </span>
              <h5 className="font-grotesk font-black text-sm uppercase">
                Substitusi S-Box: 8 Tabel Mini (48-bit ➔ 32-bit)
              </h5>
            </div>
            <p className="text-xs text-black/60 font-inter leading-relaxed mb-4">
              Dibagi menjadi 8 blok masing-masing 6-bit. Setiap blok dimasukkan ke S-Box yang sesuai. Bit pertama dan terakhir (luar) menentukan baris, bit tengah menentukan kolom.
            </p>
            
            <SBoxVisualizer sboxDetails={sboxDetails} />
            
            <div className="bg-brutal-green/10 p-3 border-3 border-black bg-brutal-green/5 mt-4" style={{ border: '3px solid #000000' }}>
              <div className="text-[9px] font-mono font-bold text-black/50 mb-1 uppercase">Hasil Gabungan S-Box (32-bit)</div>
              <BinaryGrid binaryString={sboxOutput} groupSize={4} highlightColor="green" />
            </div>
          </div>

          {/* D. Permutation P */}
          <div className="space-y-2 border-b border-black/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black border-2 border-black bg-black text-white px-2 py-0.5" style={{ borderRadius: '0px' }}>
                LANGKAH D
              </span>
              <h5 className="font-grotesk font-black text-sm uppercase">
                Permutasi P (Blok 32-bit)
              </h5>
            </div>
            <p className="text-xs text-black/60 font-inter leading-relaxed">
              Mengacak kembali 32 bit keluaran gabungan S-Box menggunakan tabel permutasi P untuk mendistribusikan bit secara matematis.
            </p>
            <div className="bg-brutal-surface p-3 brutal-border">
              <BinaryGrid
                binaryString={pOutput}
                highlightColor="purple"
                bitIndices={indices32}
              />
            </div>
          </div>

          {/* E. Final XOR & Swap */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black border-2 border-black bg-black text-white px-2 py-0.5" style={{ borderRadius: '0px' }}>
                LANGKAH E
              </span>
              <h5 className="font-grotesk font-black text-sm uppercase">
                XOR Akhir dan Pertukaran Register
              </h5>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <div className="md:col-span-2 bg-brutal-surface p-3 brutal-border">
                <div className="text-[9px] font-mono font-bold text-black/50 mb-1 uppercase">L({round - 1}) (32-bit)</div>
                <BinaryGrid binaryString={L_prev} highlightColor="coral" />
              </div>

              <div className="flex items-center justify-center font-grotesk font-black text-sm bg-brutal-coral border-3 border-black w-16 h-10 mx-auto shadow-brutal-sm" style={{ borderRadius: '0px' }}>
                XOR
              </div>

              <div className="md:col-span-2 bg-brutal-surface p-3 brutal-border">
                <div className="text-[9px] font-mono font-bold text-black/50 mb-1 uppercase">Keluaran Permutasi P (32-bit)</div>
                <BinaryGrid binaryString={pOutput} highlightColor="purple" />
              </div>
            </div>

            {/* Results Swap Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/10">
              <div className="p-4 border-3 border-black bg-brutal-orange/5 flex flex-col justify-between" style={{ borderRadius: '0px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-grotesk font-black text-sm uppercase text-brutal-orange">
                    Blok Kiri Baru L({round}) = R({round - 1})
                  </span>
                  <ArrowLeftRight className="w-4 h-4 text-brutal-orange stroke-[3px]" />
                </div>
                <BinaryGrid binaryString={L} highlightColor="orange" />
              </div>

              <div className="p-4 border-3 border-black bg-brutal-green/5 flex flex-col justify-between" style={{ borderRadius: '0px' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-grotesk font-black text-sm uppercase text-brutal-green">
                    Blok Kanan Baru R({round}) = L({round - 1}) ⊕ f(R({round - 1}))
                  </span>
                  <ArrowLeftRight className="w-4 h-4 text-brutal-green stroke-[3px]" />
                </div>
                <BinaryGrid binaryString={R} highlightColor="green" />
              </div>
            </div>
          </div>
        </div>
      </NeoCard>
    </div>
  );
}

export default RoundViewer;
