import { NavLink } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${className}`}>
      <div className="navbar__inner container">

        {/* ── Brand ── */}
        <NavLink to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-wrap">
            {/* Dark mode logo */}
            <svg className="navbar__logo-icon navbar__logo-icon--dark" width="20" height="20"
              viewBox="0 0 24 24" fill="none" stroke="url(#lg-dark)" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="lg-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D4FF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {/* Light mode logo */}
            <svg className="navbar__logo-icon navbar__logo-icon--light" width="20" height="20"
              viewBox="0 0 24 24" fill="none" stroke="#006f9a" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <span className="navbar__brand-text">
            <span className="navbar__title">S-DES</span>
            <span className="navbar__subtitle">Simulator</span>
          </span>
        </NavLink>

        {/* ── Center Nav Links ── */}
        <div className="navbar__links">
          <div className="navbar__links-pill">
            <NavLink to="/"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Simulator
            </NavLink>
            <NavLink to="/docs"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Dokumentasi
            </NavLink>
            <NavLink to="/algorithms"
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              Algoritma
            </NavLink>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="navbar__actions">
          <button
            className="navbar__theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Mode Terang' : 'Mode Gelap'}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span>{isDark ? 'Terang' : 'Gelap'}</span>
          </button>

          {/* Hamburger */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="navbar__hamburger-icon" />
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer (inside navbar) ── */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`} aria-hidden={!menuOpen}>
        <NavLink to="/" className={({ isActive }) => `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`} onClick={() => setMenuOpen(false)}>Simulator</NavLink>
        <NavLink to="/docs" className={({ isActive }) => `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`} onClick={() => setMenuOpen(false)}>Dokumentasi</NavLink>
        <NavLink to="/algorithms" className={({ isActive }) => `navbar__drawer-link ${isActive ? 'navbar__drawer-link--active' : ''}`} onClick={() => setMenuOpen(false)}>Algoritma</NavLink>
      </div>
    </nav>
  );
}
