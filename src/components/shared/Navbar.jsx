import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const modules = [
  { path: '/des',  label: 'DES',   color: '#7EC8FF', bit: '64-bit' },
  { path: '/sdes', label: 'S-DES', color: '#5FE3C4', bit: '8-bit'  },
  { path: '/aes',  label: 'AES',   color: '#FF8FD8', bit: '128-bit'},
  { path: '/saes', label: 'S-AES', color: '#FFE156', bit: '16-bit' },
];

export default function Navbar({ accentColor = '#FFE156', moduleLabel = null }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b-4 border-nb-text"
      style={{ background: accentColor }}
    >
      <div className="nb-container flex items-center justify-between h-16 relative">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-black text-nb-text text-base sm:text-lg uppercase tracking-tight hover:opacity-80 transition-opacity shrink-0"
        >
          <span
            className="inline-flex items-center justify-center w-8 h-8 border-4 border-nb-text font-mono text-xs font-bold"
            style={{ background: '#111111', color: accentColor }}
          >
            CF
          </span>
          <span>CryptoFlow</span>
          {moduleLabel && (
            <>
              <span className="text-nb-text/40 font-normal">/</span>
              <span className="text-nb-text">{moduleLabel}</span>
            </>
          )}
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 border-4 border-black bg-white text-black shadow-[3px_3px_0px_#000] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all relative z-50 focus:outline-none cursor-pointer"
          style={{ borderRadius: '0px' }}
        >
          <span className="material-symbols-outlined font-black text-xl select-none">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Dropdown Menu (Floating Neobrutalism) */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay background to close dropdown */}
              <div 
                className="fixed inset-0 z-40 bg-black/10" 
                onClick={() => setIsOpen(false)} 
              />

              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ duration: 0.12, ease: 'easeOut' }}
                className="absolute right-4 top-[4.5rem] w-64 border-4 border-black bg-[#FFF8F0] shadow-[6px_6px_0px_#000] flex flex-col p-3 z-50 gap-2"
                style={{ borderRadius: '0px' }}
              >
                <div className="font-mono text-[9px] font-black text-black/50 px-2 py-1 uppercase tracking-widest border-b-2 border-black/10 pb-2 mb-1">
                  Navigasi Simulator:
                </div>
                
                {modules.map((m) => {
                  const active = location.pathname === m.path;
                  return (
                    <Link
                      key={m.path}
                      to={m.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 font-display font-black text-xs sm:text-sm uppercase border-[3px] border-black transition-all"
                      style={{
                        background: active ? '#111111' : m.color,
                        color: active ? m.color : '#111111',
                        boxShadow: active ? 'none' : '2px 2px 0px #111111',
                        transform: active ? 'translate(1.5px, 1.5px)' : 'none',
                        borderRadius: '0px'
                      }}
                    >
                      <span>{m.label}</span>
                      <span className="font-mono text-[9px] opacity-60">{m.bit}</span>
                    </Link>
                  );
                })}

                {!isHome && (
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 border-[3px] border-black bg-white text-black font-display font-black text-xs sm:text-sm uppercase shadow-[2px_2px_0px_#111] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all mt-2"
                    style={{ borderRadius: '0px' }}
                  >
                    ← BERANDA UTAMA
                  </Link>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
