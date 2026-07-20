import React from 'react';
import { StepIndicator } from '../common/StepIndicator.jsx';
import { Shield } from 'lucide-react';

/**
 * Neubrutalist Simulator Sidebar Layout Component
 */
export function Sidebar({ activeSection = 'input', onSectionClick }) {
  return (
    <aside className="hidden lg:block w-72 border-r-4 border-black bg-brutal-white h-[calc(100vh-80px)] sticky top-[80px] p-6 overflow-y-auto select-none shrink-0">
      <div className="space-y-6">
        <StepIndicator
          activeSection={activeSection}
          onSectionClick={onSectionClick}
        />

        {/* Educational Info Box */}
        <div className="border-3 border-black p-4 bg-brutal-cream/50 space-y-2 text-xs">
          <div className="font-grotesk font-black flex items-center gap-1.5 uppercase text-black">
            <Shield className="w-4 h-4 stroke-[3px] text-brutal-yellow animate-pulse" />
            Parameter Utama DES
          </div>
          <p className="font-inter text-black/60 leading-relaxed">
            DES (Data Encryption Standard) adalah algoritma cipher blok kunci simetris yang memproses data dalam blok 64-bit menggunakan kunci 56-bit melalui 16 putaran struktur jaringan Feistel.
          </p>
        </div>

        {/* Watermark Box */}
        <div className="border-3 border-black p-4 bg-brutal-yellow/20 space-y-1 text-[9px] font-mono leading-tight">
          <div className="font-grotesk font-black text-xs uppercase text-black border-b border-black/10 pb-1 mb-1">
            INFO MAHASISWA
          </div>
          <p className="font-black text-black">Imam Rizki Saputra</p>
          <p className="text-black/75">DES - 2026</p>
          <p className="text-black/75">Teknik Informatika</p>
          <p className="text-black/75">Universitas Bale Bandung</p>
          <p className="text-black/75">Mata Kuliah: Kriptografi</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
