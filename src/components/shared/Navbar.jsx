import { Link, useLocation } from 'react-router-dom';

const modules = [
  { path: '/des',  label: 'DES',   color: '#7EC8FF', bit: '64-bit' },
  { path: '/sdes', label: 'S-DES', color: '#5FE3C4', bit: '8-bit'  },
  { path: '/aes',  label: 'AES',   color: '#FF8FD8', bit: '128-bit'},
  { path: '/saes', label: 'S-AES', color: '#FFE156', bit: '16-bit' },
];

export default function Navbar({ accentColor = '#FFE156', moduleLabel = null }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav
      className="sticky top-0 z-50 border-b-4 border-nb-text"
      style={{ background: accentColor }}
    >
      <div className="nb-container flex items-center justify-between h-14 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-black text-nb-text text-lg uppercase tracking-tight hover:opacity-80 transition-opacity shrink-0"
        >
          <span
            className="inline-flex items-center justify-center w-8 h-8 border-4 border-nb-text font-mono text-xs font-bold"
            style={{ background: '#111111', color: accentColor }}
          >
            CF
          </span>
          <span className="hidden sm:inline">CryptoFlow</span>
          {moduleLabel && (
            <>
              <span className="text-nb-text/40 font-normal">/</span>
              <span className="text-nb-text">{moduleLabel}</span>
            </>
          )}
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
          {modules.map((m) => {
            const active = location.pathname === m.path;
            return (
              <Link
                key={m.path}
                to={m.path}
                className="inline-flex items-center justify-center px-1.5 sm:px-3 py-1 sm:py-1.5 font-display font-black text-[9px] sm:text-xs uppercase border-[3px] sm:border-4 border-nb-text transition-all"
                style={{
                  background: active ? '#111111' : m.color,
                  color: active ? m.color : '#111111',
                  boxShadow: active ? 'none' : '2px 2px 0px #111111',
                  transform: active ? 'translate(2px, 2px)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.transform = 'translate(1.5px, 1.5px)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '2px 2px 0px #111111';
                  }
                }}
              >
                {m.label}
              </Link>
            );
          })}

          {!isHome && (
            <Link
              to="/"
              className="inline-flex items-center justify-center px-1.5 sm:px-3 py-1 sm:py-1.5 font-display font-black text-[9px] sm:text-xs uppercase border-[3px] sm:border-4 border-nb-text bg-white text-black transition-all"
              style={{
                boxShadow: '2px 2px 0px #111111',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(1.5px, 1.5px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '2px 2px 0px #111111';
              }}
            >
              ← Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
