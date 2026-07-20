import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/how-it-works', label: 'Cara Kerja' },
  { to: '/simulator', label: 'Simulator' },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-xl shadow-sm border-b border-outline-variant'
            : 'bg-background/70 backdrop-blur-md border-b border-outline-variant/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <motion.span
                className="font-display text-xl font-bold text-on-surface group-hover:text-primary transition-colors"
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                CipherFlow
              </motion.span>
            </Link>

            {/* Center Nav — desktop */}
            <div className="hidden md:flex items-center gap-1 bg-surface-container rounded-full px-2 py-1.5 border border-outline-variant">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'text-on-primary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {isActive(link.to) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Right — desktop */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/simulator"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary
                             rounded-full font-semibold text-sm hover:opacity-90 transition-all shadow-sm hover:shadow-md"
                >
                  Coba Simulator
                </Link>
              </motion.div>
            </div>

            {/* Mobile: theme + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl
                           bg-surface-container border border-outline-variant hover:bg-surface-container-high
                           transition-colors"
                whileTap={{ scale: 0.92 }}
                aria-label="Toggle menu"
              >
                <motion.span
                  className="block h-0.5 w-5 bg-on-surface rounded-full origin-center"
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                />
                <motion.span
                  className="block h-0.5 w-5 bg-on-surface rounded-full"
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-0.5 w-5 bg-on-surface rounded-full origin-center"
                  animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden sticky top-[57px] z-40 bg-background/98 backdrop-blur-xl
                       border-b border-outline-variant overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.25 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.to)
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22, duration: 0.25 }}
                className="pt-2"
              >
                <Link
                  to="/simulator"
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-on-primary
                             rounded-xl font-semibold text-sm w-full"
                >
                  <span className="material-symbols-outlined text-lg">science</span>
                  Mulai Simulasi
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
