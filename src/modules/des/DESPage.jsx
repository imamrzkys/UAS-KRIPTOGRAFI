import React, { useEffect, useState } from 'react';
import { useDESStore } from './store/desStore.js';
import Navbar from '../../components/shared/Navbar';
import { FooterActions } from './components/layout/FooterActions.jsx';
import { StickyTabs } from './components/common/StickyTabs.jsx';
import { HeroSection } from './components/simulator/HeroSection.jsx';
import { InputPanel } from './components/simulator/InputPanel.jsx';
import { KeySchedule } from './components/simulator/KeySchedule.jsx';
import { InitialPermutation } from './components/simulator/InitialPermutation.jsx';
import { FeistelRounds } from './components/simulator/FeistelRounds.jsx';
import { InversePermutation } from './components/simulator/InversePermutation.jsx';
import { FinalCipher } from './components/simulator/FinalCipher.jsx';
import { ProcessingEngine } from './components/simulator/ProcessingEngine.jsx';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import DES-specific styles (globals.css without @tailwind directives - those are in global index.css)

export default function DESPage() {
  const { result } = useDESStore();
  const [activeSection, setActiveSection] = useState('input');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      const sections = ['input', 'keysched', 'ip', 'rounds', 'ipinv', 'result'];
      const scrollPos = window.scrollY + 250;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brutal-cream pb-24 md:pb-8 overflow-x-hidden">
      <ProcessingEngine />
      <Navbar accentColor="#7EC8FF" moduleLabel="DES" />

      <div className="flex-1 flex relative overflow-x-hidden">
        <main className="flex-1 min-w-0 overflow-x-hidden">
          <HeroSection />

          {result && (
            <StickyTabs
              tabs={[
                { id: 'input',   label: 'Initialization' },
                { id: 'keysched',label: 'Key Schedule' },
                { id: 'ip',      label: 'Initial IP' },
                { id: 'rounds',  label: 'Feistel Rounds' },
                { id: 'ipinv',   label: 'Inverse IP-1' },
                { id: 'result',  label: 'Final Result' },
              ]}
              activeTab={activeSection}
              onTabClick={handleSectionClick}
            />
          )}

          <div className="p-4 sm:p-6 md:p-12 space-y-12 max-w-7xl mx-auto">
            <div id="input"><InputPanel /></div>
            <div className="hidden md:block"><FooterActions /></div>
            {result && <div id="keysched"><KeySchedule /></div>}
            {result && <div id="ip"><InitialPermutation /></div>}
            {result && <div id="rounds"><FeistelRounds /></div>}
            {result && <div id="ipinv"><InversePermutation /></div>}
            {result && <div id="result"><FinalCipher /></div>}

            <div className="border-3 border-black p-4 bg-brutal-yellow font-mono text-center text-xs uppercase text-black">
              <strong>imam rizki saputra · 301230013</strong> | DES Simulator — Teknik Informatika UNIBBA · Kriptografi 2026
            </div>
          </div>
        </main>
      </div>

      <div className="md:hidden"><FooterActions /></div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 md:bottom-8 right-6 z-40 bg-black text-white w-12 h-12 border-3 border-white flex items-center justify-center shadow-brutal"
            style={{ borderRadius: '9999px' }}
          >
            <ChevronUp className="w-6 h-6 stroke-[3px]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
