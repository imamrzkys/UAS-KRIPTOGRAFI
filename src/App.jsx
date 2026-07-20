import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './pages/Landing';
import DESPage from './modules/des/DESPage';
import SDESPage from './modules/sdes/SDESPage';
import AESPage from './modules/aes/AESPage';
import SAESPage from './modules/saes/SAESPage';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"     element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/des"  element={<PageTransition><DESPage /></PageTransition>} />
        <Route path="/sdes" element={<PageTransition><SDESPage /></PageTransition>} />
        <Route path="/aes"  element={<PageTransition><AESPage /></PageTransition>} />
        <Route path="/saes" element={<PageTransition><SAESPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#FFF8F0', color: '#111111' }}>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
