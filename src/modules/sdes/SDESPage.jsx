import { Link } from 'react-router-dom';
import { SimulatorProvider } from './context/SimulatorContext';
import SimulatorPanel from './features/simulator/SimulatorPanel';
import ResultPanel from './features/simulator/ResultPanel';
import SolutionTrace from './features/simulator/SolutionTrace';
import VisualMatrix from './features/simulator/VisualMatrix';
import SimulatorLayout from './layout/SimulatorLayout';

// Import S-DES specific styles
import './index.css';

/* ── Neobrutalism Teal Navbar for S-DES ─────────────────── */
function SDESNavbar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#5FE3C4',
        borderBottom: '4px solid #111111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        padding: '0 1.5rem',
        gap: '1rem',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', border: '4px solid #111111',
          background: '#111111', color: '#5FE3C4',
          fontFamily: '"Space Mono", monospace', fontSize: '11px', fontWeight: 700,
        }}>CF</span>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', color: '#111111' }}>
          CryptoFlow <span style={{ color: '#111', opacity: 0.4, fontWeight: 400 }}>/</span> S-DES
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
          border: '2px solid #111111', boxShadow: '2px 2px 0px #111111',
          fontFamily: '"Space Mono", monospace', fontSize: '11px', fontWeight: 700,
          background: '#111111', color: '#5FE3C4', textTransform: 'uppercase',
        }}>8-BIT</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
          border: '2px solid #111111', boxShadow: '2px 2px 0px #111111',
          fontFamily: '"Space Mono", monospace', fontSize: '11px', fontWeight: 700,
          background: 'white', color: '#111111', textTransform: 'uppercase',
        }}>2 Rounds</span>
        <Link to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', padding: '6px 12px',
            border: '4px solid #111111', boxShadow: '2px 2px 0px #111111',
            fontFamily: '"Space Grotesk", sans-serif', fontSize: '12px', fontWeight: 900,
            background: 'white', color: '#111111', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'none'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px #111111'; }}
        >
          ← Home
        </Link>
      </div>
    </nav>
  );
}

/* ── Hero Banner ─────────────────────────────────────────── */
function SDESHero() {
  return (
    <div style={{
      background: '#CCFAF0',
      borderBottom: '4px solid #111111',
      padding: '1.5rem 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 900, fontSize: '2.5rem', textTransform: 'uppercase', color: '#111111', margin: 0, lineHeight: 1 }}>
            S-DES
          </h1>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.75rem', fontWeight: 700, color: '#111111', opacity: 0.5, textTransform: 'uppercase', marginTop: '4px' }}>
            Simplified Data Encryption Standard · 8-bit Block · 10-bit Key
          </p>
          <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '10px', color: '#111', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>
            Imam Rizki Saputra · 301230013 · Kriptografi 2026
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['K1 & K2 Generation', 'Initial Permutation', '2 Feistel Rounds', 'S-Box Lookup', 'Final Permutation'].map(f => (
            <span key={f} style={{
              border: '2px solid #111111', padding: '2px 8px', boxShadow: '2px 2px 0px #111111',
              fontFamily: '"Space Mono", monospace', fontSize: '10px', fontWeight: 700,
              background: '#5FE3C4', textTransform: 'uppercase', color: '#111111',
            }}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Content ─────────────────────────────────────────── */
function SDESContent() {
  const mainContent = (
    <>
      <SimulatorPanel />
      <ResultPanel />
      <SolutionTrace />
    </>
  );

  const sidebarContent = (
    <VisualMatrix />
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F0FDFB' }}>
      <SDESNavbar />
      <SDESHero />
      <div className="simulator-page animate-fade-in">
        <SimulatorLayout main={mainContent} sidebar={sidebarContent} />
      </div>
      {/* Footer */}
      <div style={{
        borderTop: '4px solid #111111', padding: '1rem 2rem',
        background: '#5FE3C4', textAlign: 'center',
        fontFamily: '"Space Mono", monospace', fontSize: '11px', fontWeight: 700,
        textTransform: 'uppercase', color: '#111111',
      }}>
        <strong>imam rizki saputra · 301230013</strong> | S-DES Simulator — Teknik Informatika UNIBBA · Kriptografi 2026
      </div>
    </div>
  );
}

export default function SDESPage() {
  return (
    <SimulatorProvider>
      <SDESContent />
    </SimulatorProvider>
  );
}
