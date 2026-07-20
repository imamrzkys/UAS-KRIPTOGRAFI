import SAESSimulator from './pages/Simulator/index';
import Navbar from '../../components/shared/Navbar';
import './index.css';

/* ─── S-AES Page ──────────────────────────────────────────── */
export default function SAESPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FFF5FB' }}>
      <Navbar accentColor="#FFE156" moduleLabel="S-AES" />
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
