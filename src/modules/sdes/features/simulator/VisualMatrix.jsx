import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulator } from '../../context/SimulatorContext';
import GlassCard from '../../components/ui/GlassCard';
import SBoxMatrix from '../../components/simulator/SBoxMatrix';
import PillButton from '../../components/ui/PillButton';
import './VisualMatrix.css';

/** Kotak bit ukuran mini untuk Flow Navigator */
function MiniBitRow({ bits, color = 'cyan' }) {
  if (!bits || !Array.isArray(bits) || bits.length === 0) return null;
  return (
    <div className="vm-mini-bits">
      {bits.map((b, i) => (
        <span
          key={i}
          className={`vm-mini-bit vm-mini-bit--${color} ${b === 1 ? 'vm-mini-bit--on' : 'vm-mini-bit--off'}`}
        >
          {b}
        </span>
      ))}
    </div>
  );
}

/** Ikon penghubung antar tahapan flowchart */
function Connector() {
  return (
    <div className="vm-flow-connector">
      <div className="vm-flow-connector__line" />
      <div className="vm-flow-connector__arrow">▼</div>
    </div>
  );
}

/**
 * VisualMatrix — Panel kanan simulator:
 * Atas: S-Box interaktif
 * Bawah: Flow Navigator & Mini-Map Komputasi S-DES (Klik untuk scroll detail)
 */
export default function VisualMatrix({ className = '' }) {
  const { state, dispatch } = useSimulator();
  const { trace, result, mode } = state;
  const [activeTab, setActiveTab]   = useState('S0');
  const [highlightS0, setHighlightS0] = useState(null);
  const [highlightS1, setHighlightS1] = useState(null);

  // Auto-highlight koordinat S-Box dari trace hasil perhitungan
  useEffect(() => {
    if (!trace) { setHighlightS0(null); setHighlightS1(null); return; }
    let s0 = null, s1 = null;
    for (const step of trace) {
      if (step.subTrace) {
        for (const sub of step.subTrace) {
          if (sub.sbox?.name === 'S0' && !s0) s0 = sub.sbox;
          if (sub.sbox?.name === 'S1' && !s1) s1 = sub.sbox;
        }
      }
    }
    setHighlightS0(s0 ? { row: s0.row, col: s0.col } : null);
    setHighlightS1(s1 ? { row: s1.row, col: s1.col } : null);
  }, [trace]);

  // Ambil langkah-langkah utama dari trace untuk visual mini-map
  const keygenStep   = trace?.find(t => t.label === 'Pembangkitan Kunci');
  const ipStep       = trace?.find(t => t.label === 'Permutasi Awal (IP)');
  const round1Step   = trace?.find(t => t.label?.includes('Putaran 1'));
  const swapStep     = trace?.find(t => t.label?.includes('Penukaran'));
  const round2Step   = trace?.find(t => t.label?.includes('Putaran 2'));
  const ipInvStep    = trace?.find(t => t.label?.includes('IP⁻¹'));

  const hasTrace = !!result && !!trace;

  // Handler untuk klik navigasi (scroll ke target sebelah kiri)
  const handleStageClick = (targetId) => {
    // 1. Pastikan akordeon di sebelah kiri terbuka secara global
    dispatch({ type: 'SET_SHOW_TRACE', payload: true });

    // 2. Scroll ke target ID dengan sedikit delay
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Picu animasi pulse berdenyut
        el.classList.add('trace-step-pulse');
        setTimeout(() => {
          el.classList.remove('trace-step-pulse');
        }, 1500);
      }
    }, 150);
  };

  // Tahapan-tahapan alur komputasi
  const stages = [
    {
      num: '00',
      label: mode === 'encrypt' ? 'Plaintext Masukan (8-bit)' : 'Ciphertext Masukan (8-bit)',
      desc: 'Bit masukan awal sebelum diproses',
      bits: ipStep?.input,
      color: 'cyan',
      targetId: 'trace-step-2', // IP step is where input is shown
    },
    {
      num: '01',
      label: 'Pembangkitan Kunci',
      desc: 'Membongkar subkunci K1 & K2',
      custom: (
        <div className="vm-stage-keys">
          <div className="vm-stage-key-row">
            <span className="vm-key-label">K1:</span>
            <MiniBitRow bits={keygenStep?.output?.K1} color="purple" />
          </div>
          <div className="vm-stage-key-row">
            <span className="vm-key-label">K2:</span>
            <MiniBitRow bits={keygenStep?.output?.K2} color="cyan" />
          </div>
        </div>
      ),
      color: 'purple',
      targetId: 'trace-step-1',
    },
    {
      num: '02',
      label: 'Permutasi Awal (IP)',
      desc: 'Mengacak urutan bit masukan',
      bits: ipStep?.output,
      color: 'cyan',
      targetId: 'trace-step-2',
    },
    {
      num: '03',
      label: `Putaran 1 (${mode === 'encrypt' ? 'K1' : 'K2'})`,
      desc: 'Feistel cipher putaran pertama',
      bits: round1Step?.output,
      color: 'purple',
      targetId: 'trace-step-3',
    },
    {
      num: '04',
      label: 'Penukaran Posisi (SW)',
      desc: 'Menukar bit Kiri & Kanan',
      bits: swapStep?.output,
      color: 'cyan',
      targetId: 'trace-step-4',
    },
    {
      num: '05',
      label: `Putaran 2 (${mode === 'encrypt' ? 'K2' : 'K1'})`,
      desc: 'Feistel cipher putaran kedua',
      bits: round2Step?.output,
      color: 'purple',
      targetId: 'trace-step-5',
    },
    {
      num: '06',
      label: 'Permutasi Balik (IP⁻¹)',
      desc: 'Mengacak balik menjadi ciphertext',
      bits: ipInvStep?.output,
      color: 'cyan',
      targetId: 'trace-step-6',
    },
  ];

  return (
    <div className={`visual-matrix-panel ${className}`}>
      {/* S-Box interaktif */}
      <GlassCard className="visual-matrix-panel__sbox-card">
        <div className="visual-matrix-panel__tabs">
          <PillButton variant={activeTab === 'S0' ? 'cyan' : 'ghost'} size="sm" onClick={() => setActiveTab('S0')}>S-Box S0</PillButton>
          <PillButton variant={activeTab === 'S1' ? 'cyan' : 'ghost'} size="sm" onClick={() => setActiveTab('S1')}>S-Box S1</PillButton>
        </div>
        <div className="visual-matrix-panel__matrix-container">
          {activeTab === 'S0'
            ? <SBoxMatrix which="S0" highlight={highlightS0} />
            : <SBoxMatrix which="S1" highlight={highlightS1} />}
        </div>
      </GlassCard>

      {/* Panel Flow Navigator */}
      <GlassCard className="visual-matrix-panel__flow-card">
        <div className="visual-matrix-panel__flow-header">
          <span className="visual-matrix-panel__flow-title uppercase">
            {hasTrace ? `Peta Navigator — Klik Langkah` : 'Alur Komputasi'}
          </span>
        </div>

        <div className="visual-matrix-panel__flow-body">
          <AnimatePresence mode="wait">
            {!hasTrace ? (
              /* Placeholder sebelum pemrosesan */
              <motion.div
                key="placeholder"
                className="vm-placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <div className="vm-placeholder__icon">
                  <svg viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="28" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                    <path d="M20 30h20M30 20v20" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                  </svg>
                </div>
                <p className="vm-placeholder__text">Tekan <strong>Proses Sekarang</strong> untuk memicu simulasi alur navigasi bit di sini</p>
              </motion.div>
            ) : (
              /* Flow Navigator Aktif */
              <motion.div
                key="flow"
                className="vm-flow"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {stages.map((stage, idx) => (
                  <div key={idx} className="vm-stage-wrapper">
                    <div 
                      className={`vm-stage-card vm-stage-card--${stage.color}`}
                      onClick={() => handleStageClick(stage.targetId)}
                    >
                      <div className="vm-stage-card__header">
                        <span className="vm-stage-card__num">{stage.num}</span>
                        <div className="vm-stage-card__info">
                          <span className="vm-stage-card__label">{stage.label}</span>
                          <span className="vm-stage-card__desc">{stage.desc}</span>
                        </div>
                      </div>
                      
                      <div className="vm-stage-card__body">
                        {stage.custom ? stage.custom : <MiniBitRow bits={stage.bits} color={stage.color} />}
                      </div>
                    </div>
                    {idx < stages.length - 1 && <Connector />}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  );
}
