import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant/30 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-on-surface-variant">
          {/* Logo + Copyright info */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-display font-bold text-[#894d0d] dark:text-accent-orange text-base">
              CipherFlow
            </span>
            <span className="hidden sm:inline text-on-surface-variant/40">|</span>
            <span className="text-[11px] sm:text-xs">
              © 2026 CipherFlow Academic. Project Pertemuan 13 - Advanced Encryption Standard (AES).
            </span>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-on-surface transition-colors">
              Dokumentasi
            </Link>
            <a href="#" className="hover:text-on-surface transition-colors">
              Kebijakan Privasi
            </a>
            <a href="https://github.com/imamrzkys/TUGAS-13-KRIPTOGRAFY" target="_blank" rel="noopener noreferrer" className="hover:text-on-surface transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}