import { useState, useMemo } from 'react';
import useSimulatorStore from '../../store/simulatorStore';

const OPERATION_INFO = {
  SubBytes: {
    title: 'SubBytes Transformation',
    description: 'Setiap byte pada State Matrix disubstitusi menggunakan kotak substitusi 8-bit (S-Box Rijndael). Operasi ini merupakan satu-satunya elemen non-linear dalam algoritma AES, yang berperan penting dalam memperkuat ketahanan cipher terhadap analisis kriptografi.',
    glowClass: 'glow-amber',
    icon: 'swap_horiz'
  },
  ShiftRows: {
    title: 'ShiftRows Permutation',
    description: 'Baris-baris pada State Matrix digeser secara siklis. Baris 0 tidak digeser, baris 1 digeser sejauh 1 byte ke kiri, baris 2 digeser sejauh 2 byte ke kiri, dan baris 3 digeser sejauh 3 byte ke kiri. Transformasi ini menyebarkan pengaruh perubahan bit ke baris-baris lainnya.',
    glowClass: 'glow-violet',
    icon: 'compare_arrows'
  },
  MixColumns: {
    title: 'MixColumns Diffusion',
    description: 'Setiap kolom pada State Matrix dikalikan dengan polinomial tetap pada Galois Field GF(2^8). Operasi ini memberikan difusi tingkat tinggi pada cipher dengan memastikan ketergantungan antarbit dalam kolom yang sama.',
    glowClass: 'glow-teal',
    icon: 'view_column'
  },
  AddRoundKey: {
    title: 'AddRoundKey Operation',
    description: 'Setiap byte pada State Matrix dikombinasikan dengan byte yang bersesuaian dari Round Key menggunakan operasi bitwise XOR. Ini adalah satu-satunya tahapan dalam algoritma yang melibatkan kunci rahasia secara langsung.',
    glowClass: 'glow-rose',
    icon: 'key'
  }
};

export default function OperationAccordion({ operation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { steps, currentStep } = useSimulatorStore();
  
  const currentData = steps[currentStep];
  const label = currentData?.label || '';
  
  const roundHeaderText = useMemo(() => {
    if (label.includes('Initial Round')) {
      return 'Operasi Ronde Awal';
    }
    const match = label.match(/Round\s+(\d+)/i);
    return match ? `Operasi Ronde ${match[1]}` : 'Operasi Ronde';
  }, [label]);
  
  const info = OPERATION_INFO[operation] || {};
  
  return (
    <div className="space-y-3">
      <h4 className="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
        {roundHeaderText}
      </h4>
      <div className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface-container-high transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${info.glowClass} flex items-center justify-center border-2`}>
              <span className="material-symbols-outlined text-sm">{info.icon}</span>
            </div>
            <h3 className="font-display text-base font-semibold text-on-surface">
              {info.title}
            </h3>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface transition-colors">
            {isExpanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-4 pt-0 border-t border-outline-variant/50">
            <p className="text-sm text-on-surface-variant leading-relaxed mt-3">
              {info.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
