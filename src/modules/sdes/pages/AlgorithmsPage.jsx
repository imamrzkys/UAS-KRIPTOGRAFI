import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import Divider from '../components/ui/Divider';
import PillButton from '../components/ui/PillButton';
import MonoValue from '../components/ui/MonoValue';
import BitBox from '../components/ui/BitBox';
import './AlgorithmsPage.css';

const COMPONENTS = [
  {
    id: 'p10',
    name: 'Permutasi P10',
    type: 'Pembangkitan Kunci',
    table: [3, 5, 2, 7, 4, 10, 1, 9, 8, 6],
    description: 'Mengambil 10-bit kunci input dan mengacak urutannya sesuai tabel P10. Digunakan di awal proses pembangkitan kunci.',
    formula: 'P10(k₁, k₂, ..., k₁₀) = (k₃, k₅, k₂, k₇, k₄, k₁₀, k₁, k₉, k₈, k₆)',
    exampleInput: [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    exampleOutput: [1, 0, 0, 0, 0, 0, 1, 1, 0, 0]
  },
  {
    id: 'p8',
    name: 'Permutasi P8',
    type: 'Pembangkitan Kunci',
    table: [6, 3, 7, 4, 8, 5, 10, 9],
    description: 'Mengambil 10-bit input (setelah digeser ke kiri) dan memilih 8-bit secara acak untuk membentuk subkey (K1 atau K2).',
    formula: 'P8(k₁, k₂, ..., k₁₀) = (k₆, k₃, k₇, k₄, k₈, k₅, k₁₀, k₉)',
    exampleInput: [0, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    exampleOutput: [0, 0, 0, 0, 1, 0, 0, 1]
  },
  {
    id: 'ip',
    name: 'Permutasi Awal (IP)',
    type: 'Feistel Cipher',
    table: [2, 6, 3, 1, 4, 8, 5, 7],
    description: 'Mengacak bit dari 8-bit plaintext asal sebelum dimasukkan ke Putaran 1.',
    formula: 'IP(b₁, b₂, ..., b₈) = (b₂, b₆, b₃, b₁, b₄, b₈, b₅, b₇)',
    exampleInput: [1, 0, 1, 0, 1, 0, 1, 0],
    exampleOutput: [0, 0, 1, 1, 0, 0, 1, 1]
  },
  {
    id: 'ip_inv',
    name: 'Permutasi Balik (IP⁻¹)',
    type: 'Feistel Cipher',
    table: [4, 1, 3, 5, 7, 2, 8, 6],
    description: 'Permutasi akhir untuk mengembalikan urutan bit ke bentuk Ciphertext setelah Putaran 2 selesai.',
    formula: 'IP⁻¹(b₁, b₂, ..., b₈) = (b₄, b₁, b₃, b₅, b₇, b₂, b₈, b₆)',
    exampleInput: [0, 0, 1, 1, 0, 0, 1, 1],
    exampleOutput: [1, 0, 1, 0, 1, 0, 1, 0]
  },
  {
    id: 'ep',
    name: 'Ekspansi Permutasi (EP)',
    type: 'Feistel Cipher',
    table: [4, 1, 2, 3, 2, 3, 4, 1],
    description: 'Melakukan ekspansi 4-bit data menjadi 8-bit dengan menduplikasi beberapa bit tertentu. Digunakan dalam fungsi fK.',
    formula: 'EP(r₁, r₂, r₃, r₄) = (r₄, r₁, r₂, r₃, r₂, r₃, r₄, r₁)',
    exampleInput: [1, 1, 0, 0],
    exampleOutput: [0, 1, 1, 0, 1, 0, 0, 1]
  },
  {
    id: 'p4',
    name: 'Permutasi P4',
    type: 'Feistel Cipher',
    table: [2, 4, 3, 1],
    description: 'Mengacak urutan 4-bit output gabungan dari S-Box S0 dan S1 sebelum di-XOR dengan bagian kiri.',
    formula: 'P4(s₁, s₂, s₃, s₄) = (s₂, s₄, s₃, s₁)',
    exampleInput: [0, 1, 1, 0],
    exampleOutput: [1, 0, 1, 0]
  }
];

export default function AlgorithmsPage() {
  const [selectedId, setSelectedId] = useState('p10');
  const comp = COMPONENTS.find(c => c.id === selectedId);

  // Custom interactive test bed for selected component
  const [testInput, setTestInput] = useState([...comp.exampleInput]);

  const handleToggleTestBit = (index) => {
    const nextInput = testInput.map((b, i) => i === index ? (b === 0 ? 1 : 0) : b);
    setTestInput(nextInput);
  };

  // Perform permutation logic dynamically
  const runPermutation = (bits, table) => {
    return table.map(pos => bits[pos - 1]);
  };

  const currentResult = runPermutation(testInput, comp.table);

  // Synchronize state when selected component changes
  const handleSelectComp = (id) => {
    setSelectedId(id);
    const newComp = COMPONENTS.find(c => c.id === id);
    setTestInput([...newComp.exampleInput]);
  };

  return (
    <div className="algorithms-page container animate-fade-in">
      <div className="algorithms-page__grid">
        {/* Left Side: Sidebar Selection */}
        <aside className="algorithms-page__sidebar">
          <GlassCard className="algorithms-page__sidebar-card">
            <h3 className="algorithms-page__sidebar-title uppercase">Komponen S-DES</h3>
            <div className="algorithms-page__list">
              {COMPONENTS.map(c => (
                <button
                  key={c.id}
                  className={`algorithms-page__item ${c.id === selectedId ? 'algorithms-page__item--active' : ''}`}
                  onClick={() => handleSelectComp(c.id)}
                >
                  <span className="algorithms-page__item-name">{c.name}</span>
                  <span className="algorithms-page__item-type text-xs">{c.type}</span>
                </button>
              ))}
            </div>
          </GlassCard>
        </aside>

        {/* Right Side: Component Detail View */}
        <main className="algorithms-page__detail">
          <GlassCard className="algorithms-page__detail-card" variant="accent">
            <h2 className="algorithms-page__detail-name">{comp.name}</h2>
            <div className="algorithms-page__badge">
              <span className="text-xs uppercase">{comp.type}</span>
            </div>

            <p className="algorithms-page__description">{comp.description}</p>

            <Divider label="Fungsi Matematika & Permutasi" />

            <div className="algorithms-page__formula-box">
              <MonoValue label="Formula:" value={comp.formula} size="md" />
            </div>

            <div className="algorithms-page__table-view">
              <h4 className="algorithms-page__section-title">Urutan Indeks Tabel:</h4>
              <div className="algorithms-page__table-row">
                {comp.table.map((val, idx) => (
                  <div key={idx} className="algorithms-page__table-cell">
                    <span className="algorithms-page__cell-idx text-xs">{idx + 1}</span>
                    <span className="algorithms-page__cell-val mono">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <Divider label="Uji Coba Interaktif" />

            <div className="algorithms-page__interactive">
              <p className="text-sm text-var">Klik kotak bit input di bawah ini untuk melihat hasil permutasi secara langsung.</p>

              <div className="algorithms-page__bits-group">
                <div className="algorithms-page__bits-input">
                  <label className="text-xs uppercase font-semibold text-var">Input ({testInput.length}-Bit)</label>
                  <div className="algorithms-page__bitboxes">
                    {testInput.map((val, idx) => (
                      <BitBox
                        key={idx}
                        value={val}
                        size="md"
                        onClick={() => handleToggleTestBit(idx)}
                      />
                    ))}
                  </div>
                </div>

                <div className="algorithms-page__arrow">→</div>

                <div className="algorithms-page__bits-output">
                  <label className="text-xs uppercase font-semibold text-var">Output ({currentResult.length}-Bit)</label>
                  <div className="algorithms-page__bitboxes">
                    {currentResult.map((val, idx) => (
                      <BitBox
                        key={idx}
                        value={val}
                        size="md"
                        readOnly
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
