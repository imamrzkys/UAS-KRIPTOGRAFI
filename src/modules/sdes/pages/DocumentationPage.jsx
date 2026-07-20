import GlassCard from '../components/ui/GlassCard';
import Divider from '../components/ui/Divider';
import StatusChip from '../components/ui/StatusChip';
import './DocumentationPage.css';

export default function DocumentationPage() {
  return (
    <div className="docs-page container animate-fade-in">
      <div className="docs-page__hero">
        <h1 className="docs-page__title">S-DES (Simplified DES)</h1>
        <p className="docs-page__subtitle">Teori Operasi, Struktur Algoritma, & Skema Jalur Data</p>
      </div>

      <div className="docs-page__grid">
        <main className="docs-page__main">
          {/* Section 1: Introduction */}
          <GlassCard className="docs-page__card" variant="accent">
            <h2 className="docs-page__section-title">Apa itu S-DES?</h2>
            <p>
              <strong>Simplified Data Encryption Standard (S-DES)</strong> adalah versi pembelajaran
              dari algoritma kriptografi kunci simetris <em>Data Encryption Standard (DES)</em> asli.
              Algoritma ini dikembangkan oleh Ronald L. Rivest untuk membantu mahasiswa memahami
              struktur internal dan prinsip Feistel Cipher tanpa kerumitan ukuran blok dan kunci yang besar.
            </p>
            <p>
              S-DES bekerja pada blok data berukuran <strong>8-bit</strong> menggunakan kunci internal
              berukuran <strong>10-bit</strong>. Dari kunci 10-bit tersebut, algoritma membangkitkan
              dua subkey masing-masing berukuran <strong>8-bit</strong> (disebut K₁ dan K₂) untuk digunakan
              pada putaran Feistel (Round 1 dan Round 2).
            </p>
          </GlassCard>

          {/* Section 2: Flow diagram */}
          <GlassCard className="docs-page__card">
            <h2 className="docs-page__section-title">Diagram Alir Algoritma</h2>
            <p className="text-sm text-var margin-bottom">
              Di bawah ini merupakan visualisasi skema enkripsi dan dekripsi pada S-DES menggunakan pure SVG.
            </p>
            <div className="docs-page__diagram-box">
              <svg className="docs-page__svg-flow" viewBox="0 0 400 450">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--outline)" />
                  </marker>
                </defs>
                
                {/* Flow boxes */}
                <rect x="130" y="20" width="140" height="30" rx="6" fill="var(--glass-bg)" stroke="var(--cyan)" strokeWidth="1" />
                <text x="200" y="40" fill="var(--on-surface)" textAnchor="middle" fontSize="10" fontWeight="bold">PLAINTEXT (8-BIT)</text>

                <path d="M 200 50 L 200 80" stroke="var(--outline)" strokeWidth="1.5" markerEnd="url(#arrow)" />

                <rect x="130" y="80" width="140" height="30" rx="6" fill="var(--glass-bg)" stroke="var(--glass-border)" strokeWidth="1" />
                <text x="200" y="98" fill="var(--on-surface)" textAnchor="middle" fontSize="10">INITIAL PERMUTATION (IP)</text>

                <path d="M 200 110 L 200 140" stroke="var(--outline)" strokeWidth="1.5" markerEnd="url(#arrow)" />

                <rect x="110" y="140" width="180" height="40" rx="6" fill="rgba(79, 142, 247, 0.1)" stroke="var(--electric-blue)" strokeWidth="1" />
                <text x="200" y="158" fill="var(--on-surface)" textAnchor="middle" fontSize="10" fontWeight="bold">ROUND 1 (Key: K1)</text>
                <text x="200" y="172" fill="var(--on-surface-var)" textAnchor="middle" fontSize="8">EP → XOR K1 → S-Boxes → P4 → XOR Left</text>

                <path d="M 200 180 L 200 210" stroke="var(--outline)" strokeWidth="1.5" markerEnd="url(#arrow)" />

                <rect x="130" y="210" width="140" height="30" rx="6" fill="var(--glass-bg)" stroke="var(--glass-border)" strokeWidth="1" />
                <text x="200" y="228" fill="var(--on-surface)" textAnchor="middle" fontSize="10">SWAP HALVES (SW)</text>

                <path d="M 200 240 L 200 270" stroke="var(--outline)" strokeWidth="1.5" markerEnd="url(#arrow)" />

                <rect x="110" y="270" width="180" height="40" rx="6" fill="rgba(139, 92, 246, 0.1)" stroke="var(--purple)" strokeWidth="1" />
                <text x="200" y="288" fill="var(--on-surface)" textAnchor="middle" fontSize="10" fontWeight="bold">ROUND 2 (Key: K2)</text>
                <text x="200" y="302" fill="var(--on-surface-var)" textAnchor="middle" fontSize="8">EP → XOR K2 → S-Boxes → P4 → XOR Left</text>

                <path d="M 200 310 L 200 340" stroke="var(--outline)" strokeWidth="1.5" markerEnd="url(#arrow)" />

                <rect x="130" y="340" width="140" height="30" rx="6" fill="var(--glass-bg)" stroke="var(--glass-border)" strokeWidth="1" />
                <text x="200" y="358" fill="var(--on-surface)" textAnchor="middle" fontSize="10">INVERSE PERMUTATION (IP⁻¹)</text>

                <path d="M 200 370 L 200 400" stroke="var(--outline)" strokeWidth="1.5" markerEnd="url(#arrow)" />

                <rect x="130" y="400" width="140" height="30" rx="6" fill="var(--glass-bg)" stroke="var(--cyan)" strokeWidth="1" />
                <text x="200" y="419" fill="var(--cyan)" textAnchor="middle" fontSize="10" fontWeight="bold">CIPHERTEXT (8-BIT)</text>
              </svg>
            </div>
          </GlassCard>
        </main>

        <aside className="docs-page__sidebar">
          {/* Step list summary cards */}
          <GlassCard className="docs-page__sidebar-card">
            <h3 className="docs-page__sidebar-title uppercase">Tahap Operasi</h3>
            <ul className="docs-page__step-list">
              <li>
                <StatusChip variant="cyan">K1 / K2</StatusChip>
                <p className="text-xs text-var mt-1">Pembangkitan subkey K₁ dan K₂ dari kunci 10-bit.</p>
              </li>
              <Divider />
              <li>
                <StatusChip variant="blue">IP</StatusChip>
                <p className="text-xs text-var mt-1">Permutasi awal (IP) pada blok plaintext 8-bit.</p>
              </li>
              <Divider />
              <li>
                <StatusChip variant="purple">Round fK</StatusChip>
                <p className="text-xs text-var mt-1">Fungsi putaran Feistel menggunakan ekspansi (EP), pemetaan S-Box, permutasi P4, dan operasi XOR.</p>
              </li>
              <Divider />
              <li>
                <StatusChip variant="green">IP⁻¹</StatusChip>
                <p className="text-xs text-var mt-1">Permutasi balikan (IP⁻¹) untuk merilis output akhir.</p>
              </li>
            </ul>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
