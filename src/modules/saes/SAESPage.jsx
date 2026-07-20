import { Link } from 'react-router-dom';
import SAESSimulator from './pages/Simulator/index';
import './index.css';

/* ─── Neobrutalism Kuning Navbar untuk S-AES ──────────────── */
function SAESNavbar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#FFE156',
        borderBottom: '4px solid #111111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
        padding: '0 1.5rem',
        gap: '1rem',
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '32px', height: '32px', border: '4px solid #111111',
          background: '#111111', color: '#FFE156',
          fontFamily: '"Space Mono", monospace', fontSize: '11px', fontWeight: 700,
        }}>CF</span>
        <span style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase', color: '#111111', letterSpacing: '-0.02em' }}>
          CryptoFlow <span style={{ opacity: 0.35, fontWeight: 400, marginInline: '4px' }}>/</span> S-AES
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {[['16-BIT', '#111111', '#FFE156'], ['2 Rounds', '#FFFFFF', '#111111']].map(([t, bg, c]) => (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
            border: '2px solid #111111', boxShadow: '2px 2px 0px #111111',
            fontFamily: '"Space Mono", monospace', fontSize: '11px', fontWeight: 700,
            background: bg, color: c, textTransform: 'uppercase',
          }}>{t}</span>
        ))}
        <Link to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', padding: '6px 14px',
            border: '4px solid #111111', boxShadow: '2px 2px 0px #111111',
            fontSize: '12px', fontWeight: 900, background: 'white', color: '#111111',
            textTransform: 'uppercase', textDecoration: 'none',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'none'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0px #111111'; }}
        >
          ← Home
        </Link>
      </div>
    </nav>
  );
}

/* ─── S-AES Page ──────────────────────────────────────────── */
export default function SAESPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF5FB' }}>
      <SAESNavbar />
      <SAESSimulator />
      <footer style={{
        borderTop: '4px solid #111111', padding: '1rem 2rem',
        background: '#FFE156', textAlign: 'center',
        fontFamily: '"Space Mono", monospace', fontSize: '11px',
        fontWeight: 700, textTransform: 'uppercase', color: '#111111',
      }}>
        <strong>imam rizki saputra · 301230013</strong> | S-AES Simulator — Teknik Informatika UNIBBA · Kriptografi 2026
      </footer>
    </div>
  );
}
