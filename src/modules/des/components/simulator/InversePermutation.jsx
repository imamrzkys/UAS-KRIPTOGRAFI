import React from 'react';
import { useDESStore } from '../../store/desStore.js';
import { NeoCard } from '../common/NeoCard.jsx';
import { PermutationVisualizer } from './PermutationVisualizer.jsx';
import { IP_INV } from '../../services/permutation.js';
import { ShieldAlert } from 'lucide-react';

export function InversePermutation() {
  const { result } = useDESStore();

  if (!result) {
    return (
      <NeoCard title="INVERSE INITIAL PERMUTATION (IP-1)" className="opacity-50">
        <div className="flex flex-col items-center justify-center py-12 text-black/40">
          <ShieldAlert className="w-12 h-12 stroke-[3px] mb-4" />
          <p className="font-grotesk font-bold uppercase tracking-wider">
            Jalankan simulasi untuk melihat Inverse Initial Permutation (IP-1)
          </p>
        </div>
      </NeoCard>
    );
  }

  return (
    <section id="ipinv" className="space-y-6">
      <NeoCard title="5. INVERSE INITIAL PERMUTATION (IP-1)">
        <div className="space-y-4">
          <p className="font-inter text-xs text-black/70 leading-relaxed font-medium">
            Setelah Putaran 16 selesai, blok kiri dan kanan digabungkan secara terbalik menjadi <strong>R16 + L16</strong> (32-bit R16 diikuti 32-bit L16). 
            Blok gabungan 64-bit ini kemudian dilewatkan pada tabel Inverse Initial Permutation (IP-1) untuk mengembalikan bit-bit teracak ke posisi aslinya guna menghasilkan ciphertext final.
          </p>

          {/* R16 + L16 visualization box */}
          <div className="bg-brutal-white p-4 border-3 border-black shadow-brutal-sm flex flex-col items-center justify-center gap-4">
            <div className="w-full flex items-center justify-around gap-2 text-center text-xs font-grotesk font-black uppercase">
              <span className="p-2 border-2 border-black bg-brutal-orange/15 w-[45%]">Blok R16 (32-bit)</span>
              <span className="font-black text-lg">+</span>
              <span className="p-2 border-2 border-black bg-brutal-coral/15 w-[45%]">Blok L16 (32-bit)</span>
            </div>
            
            <div className="font-mono text-center text-xs text-black/60 uppercase">
              Gabungan Blok 64-bit Sebelum IP-1 (R16 + L16):
            </div>
            
            <div className="w-full bg-brutal-surface p-3 brutal-border flex justify-center overflow-x-auto">
              <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
                {/* R16 block */}
                <div className="flex gap-1 p-1 bg-brutal-orange/10 border-2 border-dashed border-brutal-orange">
                  {result.preOutput.slice(0, 32).match(/.{1,4}/g)?.map((chunk, idx) => (
                    <span key={idx} className="font-mono text-xs font-bold tracking-widest bg-white border border-black px-1.5 py-0.5">{chunk}</span>
                  ))}
                </div>
                {/* L16 block */}
                <div className="flex gap-1 p-1 bg-brutal-coral/10 border-2 border-dashed border-brutal-coral">
                  {result.preOutput.slice(32, 64).match(/.{1,4}/g)?.map((chunk, idx) => (
                    <span key={idx} className="font-mono text-xs font-bold tracking-widest bg-white border border-black px-1.5 py-0.5">{chunk}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="text-xs font-grotesk font-black uppercase text-black mb-4">
              Visualisasi Alur Bit IP-1
            </div>
            <PermutationVisualizer
              title="Inverse Initial Permutation (IP-1)"
              table={IP_INV}
              inputBin={result.preOutput}
              outputBin={result.ciphertextBin}
              colorTheme="purple"
            />
          </div>
        </div>
      </NeoCard>
    </section>
  );
}

export default InversePermutation;
