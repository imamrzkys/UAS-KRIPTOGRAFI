import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/shared/Navbar';

const modules = [
  {
    path: '/des',
    label: 'DES',
    fullName: 'Data Encryption Standard',
    bit: '64-bit',
    keyBit: '64-bit Key',
    rounds: '16 Feistel Rounds',
    color: '#7EC8FF',
    description: 'Algoritma block cipher simetris klasik dengan 16 ronde Feistel. Visualisasi lengkap PC-1, PC-2, IP, S-Box, dan FP.',
    features: ['Generate Keys PC-1/PC-2', 'Initial Permutation', '16 Ronde Feistel', 'S-Box Substitusi', 'Final Permutation'],
    icon: '🔐',
  },
  {
    path: '/sdes',
    label: 'S-DES',
    fullName: 'Simplified DES',
    bit: '8-bit',
    keyBit: '10-bit Key',
    rounds: '2 Feistel Rounds',
    color: '#5FE3C4',
    description: 'Versi sederhana DES untuk pembelajaran. Operasi 8-bit dengan 2 ronde dan visualisasi K1/K2 secara detail.',
    features: ['Generate K1 & K2', 'Initial Permutation', 'Round Function 1 & 2', 'SW (Swap)', 'Final Permutation'],
    icon: '🔑',
  },
  {
    path: '/aes',
    label: 'AES-128',
    fullName: 'Advanced Encryption Standard 128',
    bit: '128-bit',
    keyBit: '128-bit Key',
    rounds: '10 Rounds',
    color: '#FF8FD8',
    description: 'Standar enkripsi modern dengan 10 ronde SubBytes, ShiftRows, MixColumns, dan AddRoundKey. Expansi kunci 11 round key.',
    features: ['Key Expansion 11 round key', 'Initial Round (AddRoundKey)', 'Ronde 1-9 + MixColumns', 'Ronde 10 tanpa MixColumns', 'State Matrix Visualisasi'],
    icon: '🛡️',
  },
  {
    path: '/saes',
    label: 'S-AES',
    fullName: 'Simplified AES (CipherFlow)',
    bit: '16-bit',
    keyBit: '16-bit Key',
    rounds: '2 Rounds',
    color: '#FFE156',
    description: 'Versi mini AES untuk 16-bit blok. Visualisasi penuh Key Expansion, Initial Round, 2 ronde, dan dekripsi invers.',
    features: ['Key Expansion w0-w5 (K0-K2)', 'Initial Round', 'Ronde 1 + MixColumns', 'Ronde 2 tanpa MixColumns', 'Enkripsi & Dekripsi'],
    icon: '⚡',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' } }),
};

function AlgoCard({ module, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div
        className="h-full border-4 border-nb-text flex flex-col"
        style={{ boxShadow: '6px 6px 0px #111111', background: 'white' }}
      >
        {/* Card Header */}
        <div
          className="p-5 border-b-4 border-nb-text"
          style={{ background: module.color }}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-3xl">{module.icon}</span>
            <div className="flex flex-col items-end gap-1">
              <span className="nb-badge" style={{ background: '#111111', color: module.color }}>
                {module.bit}
              </span>
              <span className="nb-badge bg-white text-nb-text text-[10px]">
                {module.rounds}
              </span>
            </div>
          </div>
          <h2 className="font-display font-black text-2xl text-nb-text uppercase leading-tight">
            {module.label}
          </h2>
          <p className="font-mono text-xs text-nb-text/70 mt-1 font-bold uppercase">
            {module.fullName}
          </p>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-1 gap-4">
          <p className="font-body text-sm text-nb-text/80 leading-relaxed">
            {module.description}
          </p>

          {/* Features List */}
          <div className="space-y-1.5">
            <p className="font-display font-black text-xs uppercase text-nb-text/50 tracking-wider">
              Fitur Simulator:
            </p>
            {module.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-4 h-4 shrink-0 border-2 border-nb-text inline-flex items-center justify-center"
                  style={{ background: module.color }}
                >
                  <span className="text-[8px] font-black">✓</span>
                </span>
                <span className="font-mono text-xs text-nb-text">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-auto pt-4">
            <Link
              to={module.path}
              className="nb-btn nb-btn-yellow w-full justify-center text-nb-text"
              style={{ background: module.color, boxShadow: '4px 4px 0px #111111' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = '2px 2px 0px #111111';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '4px 4px 0px #111111';
              }}
            >
              Buka Simulator {module.label} →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      <Navbar accentColor="#FFE156" />

      {/* Hero Section */}
      <section className="nb-container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="nb-badge" style={{ background: '#FF8FD8' }}>
              Kriptografi Simetris
            </span>
            <span className="nb-badge bg-white">
              Tugas UAS • Sem 6
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-black text-5xl md:text-7xl uppercase leading-none tracking-tight mb-6">
            Crypto
            <br />
            <span
              className="border-b-8 border-nb-text"
              style={{ display: 'inline-block' }}
            >
              Flow
            </span>
            <br />
            <span className="text-3xl md:text-5xl font-black text-nb-text/40">
              Unified Simulator
            </span>
          </h1>

          <p className="font-body text-lg text-nb-text/70 mb-8 max-w-xl leading-relaxed">
            Simulator kriptografi terpadu: <strong>DES</strong>, <strong>S-DES</strong>, <strong>AES-128</strong>, dan <strong>S-AES</strong> dengan visualisasi step-by-step lengkap. Enkripsi & dekripsi bit-per-bit.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { label: 'Algoritma', value: '4' },
              { label: 'Visualisasi Tahapan', value: '50+' },
              { label: 'Bit Support', value: '8–128' },
              { label: 'Mahasiswa', value: 'Imam Rizki Saputra · 301230013' },
            ].map((s, i) => (
              <div key={i} className="nb-card-sm px-4 py-2 bg-white flex flex-col">
                <span className="font-display font-black text-xl text-nb-text">{s.value}</span>
                <span className="font-mono text-[10px] text-nb-text/50 uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Decorative separator */}
        <div className="border-t-4 border-nb-text mb-12 relative">
          <span
            className="absolute -top-5 left-0 font-display font-black text-sm uppercase px-4 py-2 border-4 border-nb-text"
            style={{ background: '#5FE3C4' }}
          >
            Pilih Simulator
          </span>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {modules.map((m, i) => (
            <AlgoCard key={m.path} module={m} index={i} />
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 p-6 border-4 border-nb-text bg-white"
          style={{ boxShadow: '4px 4px 0px #111111' }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-display font-black text-lg uppercase mb-1">
                Tentang Aplikasi
              </h3>
              <p className="font-body text-sm text-nb-text/70">
                Aplikasi ini menggabungkan 4 simulator kriptografi simetris yang dikerjakan selama Semester 6 
                menjadi satu unified platform. Setiap modul memiliki visualisasi lengkap semua tahapan algoritma 
                tanpa pengurangan — logika DES, S-DES, AES-128, dan S-AES tetap identik dengan versi aslinya.
              </p>
            </div>
            <div className="shrink-0 flex gap-2">
              {modules.map(m => (
                <Link
                  key={m.path}
                  to={m.path}
                  className="w-10 h-10 border-4 border-nb-text flex items-center justify-center font-display font-black text-xs uppercase transition-all"
                  style={{ background: m.color, boxShadow: '3px 3px 0px #111111' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translate(2px, 2px)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '3px 3px 0px #111111';
                  }}
                  title={m.label}
                >
                  {m.label[0]}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
