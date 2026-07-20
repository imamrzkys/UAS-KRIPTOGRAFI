import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield, Terminal } from 'lucide-react';
import { useDESStore } from '../../store/desStore.js';

export function Header({ activeSection = 'input', onSectionClick }) {
  const { result, mode, setMode } = useDESStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const steps = [
    { id: 'input', label: 'Initialization' },
    ...(result ? [
      { id: 'keysched', label: 'Key Schedule' },
      { id: 'ip', label: 'Initial IP' },
      { id: 'rounds', label: 'Feistel Rounds' },
      { id: 'ipinv', label: 'Inverse IP-1' },
      { id: 'result', label: 'Final Result' }
    ] : [])
  ];

  const handleLinkClick = (id) => {
    setMenuOpen(false);
    if (onSectionClick) {
      onSectionClick(id);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-brutal-yellow border-b-4 border-black px-1.5 sm:px-6 py-2 sm:py-4 flex items-center justify-between select-none shadow-[0_4px_0_#000] relative gap-1 sm:gap-2">
      {/* Title / Logo */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink overflow-hidden">
        <div className="hidden sm:flex w-9 h-9 bg-black items-center justify-center border-2 border-black text-brutal-yellow shadow-brutal-sm shrink-0">
          <Terminal className="w-5 h-5 stroke-[3px]" />
        </div>
        <div className="min-w-0 flex-shrink">
          <h1 className="font-syne font-black text-[10px] xs:text-xs sm:text-base md:text-lg lg:text-xl tracking-[-0.08em] sm:tracking-tighter leading-tight text-black">
            DES SIMULATOR
          </h1>
          <span className="font-mono text-[6px] xs:text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-tighter sm:tracking-wide font-black text-black/50 block mt-0.5">
            Digital Encryption Standard
          </span>
        </div>
      </div>

      {/* Navigation Badges and Menu Trigger */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Mode badge (visible on md+) */}
        <div className={`
          hidden md:flex items-center gap-2 px-3.5 py-1.5 border-3 border-black text-xs font-grotesk font-black uppercase shadow-brutal-sm
          ${mode === 'encrypt' ? 'bg-brutal-purple' : 'bg-brutal-coral'}
        `}>
          <Shield className="w-3.5 h-3.5 stroke-[3px]" />
          Mode: {mode === 'encrypt' ? 'ENKRIPSI' : 'DEKRIPSI'}
        </div>

        {/* Status indicator (visible on md+) */}
        <div className={`
          hidden md:flex items-center gap-2 px-3.5 py-1.5 border-3 border-black text-xs font-grotesk font-black uppercase shadow-brutal-sm
          ${result ? 'bg-brutal-green text-black' : 'bg-brutal-cream text-black/40'}
        `}>
          <span className={`w-2.5 h-2.5 border-2 border-black ${result ? 'bg-black animate-pulse' : 'bg-transparent'}`}></span>
          {result ? 'AKTIF' : 'SIAP'}
        </div>

        {/* Compact Mode display (visible on mobile only, hidden on md+) */}
        <div className={`
          flex md:hidden items-center justify-center px-1 py-0.5 border-2 border-black text-[7px] font-mono font-black uppercase shadow-brutal-sm flex-shrink-0 min-w-[32px]
          ${mode === 'encrypt' ? 'bg-brutal-purple' : 'bg-brutal-coral'}
        `}>
          {mode === 'encrypt' ? 'ENC' : 'DEC'}
        </div>

        {/* ← Home Button */}
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border-3 border-black text-xs font-grotesk font-black uppercase shadow-brutal-sm bg-white text-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          style={{ textDecoration: 'none' }}
        >
          ← Home
        </Link>

        {/* Hamburger Menu toggle (always visible - mobile & desktop) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-[32px] h-[32px] sm:w-9 sm:h-9 bg-black border-2 border-black text-white flex items-center justify-center shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-75 hover:bg-brutal-yellow hover:text-black flex-shrink-0"
          style={{ borderRadius: '0px' }}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[3px]" /> : <Menu className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[3px]" />}
        </button>
      </div>

      {/* Collapsible Dropdown Drawer Menu (Mobile & Desktop) */}
      {menuOpen && (
        <div className="absolute top-[100%] left-0 w-full bg-brutal-white border-b-4 border-black p-4 sm:p-6 flex flex-col gap-4 shadow-brutal-lg z-50">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <span className="font-grotesk font-black text-xs uppercase text-black/40">Status Simulator</span>
            
            {/* Status indicator inside mobile menu */}
            <div className={`
              flex items-center gap-1.5 px-2 py-0.5 border-2 border-black text-[10px] font-grotesk font-black uppercase
              ${result ? 'bg-brutal-green text-black' : 'bg-brutal-cream text-black/30'}
            `}>
              <span className={`w-2 h-2 border border-black ${result ? 'bg-black animate-pulse' : 'bg-transparent'}`}></span>
              {result ? 'AKTIF' : 'SIAP'}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-grotesk font-black text-xs uppercase text-black/40 mb-1">Pilih Bagian / Steps</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {steps.map((step) => {
                const isActive = activeSection === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleLinkClick(step.id)}
                    className={`
                      w-full text-left px-4 py-2.5 border-2 border-black font-grotesk font-black text-xs uppercase transition-colors
                      ${isActive ? 'bg-brutal-yellow text-black' : 'bg-brutal-white text-black/60 hover:bg-brutal-cream'}
                    `}
                    style={{ borderRadius: '0px' }}
                  >
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
