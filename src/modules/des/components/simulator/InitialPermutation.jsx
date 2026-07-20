import React from 'react';
import { useDESStore } from '../../store/desStore.js';
import { NeoCard } from '../common/NeoCard.jsx';
import { PermutationVisualizer } from './PermutationVisualizer.jsx';
import { IP } from '../../services/desConstants.js';
import { ShieldAlert } from 'lucide-react';

export function InitialPermutation() {
  const { result } = useDESStore();

  if (!result) {
    return (
      <NeoCard title="INITIAL PERMUTATION (IP)" className="opacity-50">
        <div className="flex flex-col items-center justify-center py-12 text-black/40">
          <ShieldAlert className="w-12 h-12 stroke-[3px] mb-4" />
          <p className="font-grotesk font-bold uppercase tracking-wider">
            Jalankan simulasi untuk melihat Initial Permutation / Permutasi Awal (IP)
          </p>
        </div>
      </NeoCard>
    );
  }

  return (
    <section id="ip" className="space-y-4">
      <NeoCard title="3. INITIAL PERMUTATION (IP)">
        <p className="font-inter text-xs text-black/70 mb-4 leading-relaxed">
          Blok data plaintext 64-bit dipermutasikan (diacak posisinya) menggunakan tabel Initial Permutation (IP). Langkah ini tidak menambahkan kekuatan kriptografi secara langsung, melainkan mempersiapkan blok untuk 16 putaran Feistel dengan membaginya menjadi register Kiri (Left) dan Kanan (Right) masing-masing 32-bit (<strong>L0</strong> dan <strong>R0</strong>).
        </p>

        <PermutationVisualizer
          title="Initial Permutation (IP)"
          table={IP}
          inputBin={result.ipInput}
          outputBin={result.ipOutput}
          colorTheme="orange"
        />
      </NeoCard>
    </section>
  );
}

export default InitialPermutation;
