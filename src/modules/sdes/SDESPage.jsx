import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { encrypt, decrypt, generateKeys } from './services/sdes.js';
import { bitArrayToPlain } from './utils/formatters.js';
import Navbar from '../../components/shared/Navbar';

/* ─── Constants ──────────────────────────────────────────────── */
const ACCENT  = '#5FE3C4';   // tosca S-DES
const S0_TABLE = [[1,0,3,2],[3,2,1,0],[0,2,1,3],[3,1,3,2]];
const S1_TABLE = [[0,1,2,3],[2,0,1,3],[3,0,1,0],[2,1,0,3]];

/* ─── Utility ────────────────────────────────────────────────── */
function parseBits(str, len) {
  const clean = str.replace(/[^01]/g, '');
  if (clean.length !== len) return null;
  return clean.split('').map(Number);
}

/* ─── Sub-components ─────────────────────────────────────────── */

/** Bit cell */
function BitCell({ bit, highlight }) {
  const bg = highlight === 'teal' ? ACCENT : highlight === 'yellow' ? '#FFE156' : highlight === 'pink' ? '#FF8FD8' : 'white';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '28px', height: '28px', border: '2px solid #111111',
      background: bg, fontFamily: '"Space Mono", monospace',
      fontSize: '12px', fontWeight: 700, color: '#111111', flexShrink: 0,
    }}>{bit}</span>
  );
}

/** Bit input row */
function BitInput({ label, bits, onChange, length, error }) {
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 900, fontSize: '11px', textTransform: 'uppercase',
        letterSpacing: '0.1em', color: '#111111', marginBottom: '8px',
      }}>{label}</label>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
        {Array.from({ length }).map((_, i) => (
          <BitCell key={i} bit={bits[i] ?? 0} highlight={bits[i] === 1 ? 'teal' : ''} />
        ))}
      </div>
      <input
        type="text"
        maxLength={length}
        value={bits.join('')}
        onChange={e => onChange(e.target.value)}
        placeholder={'0'.repeat(length)}
        style={{
          width: '100%', padding: '10px 12px',
          fontFamily: '"Space Mono", monospace', fontSize: '14px',
          border: `4px solid ${error ? '#FF5757' : '#111111'}`,
          boxShadow: error ? 'none' : '2px 2px 0px #111111',
          background: 'white', outline: 'none', letterSpacing: '0.2em',
        }}
      />
      {error && (
        <p style={{ color: '#FF5757', fontFamily: '"Space Mono",monospace', fontSize: '11px', marginTop: '4px' }}>
          ⚠ Harus tepat {length} digit biner (0 atau 1)
        </p>
      )}
    </div>
  );
}

/** Single step trace card */
function StepCard({ step, index, accentColor }) {
  const [open, setOpen] = useState(true);
  const inArr  = Array.isArray(step.input) ? step.input : (step.input?.left ? [...step.input.left, ...(step.input.right ?? []), ...(step.input.ep ?? [])] : null);
  const outArr = Array.isArray(step.output) ? step.output : (step.output?.left ? [...step.output.left, ...(step.output.right ?? [])] : null);

  return (
    <div style={{ border: '4px solid #111111', boxShadow: '4px 4px 0px #111111', background: 'white', marginBottom: '12px' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '12px', padding: '12px 16px', border: 'none', background: 'white', cursor: 'pointer',
          borderBottom: open ? '4px solid #111111' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '28px', height: '28px', border: '3px solid #111111',
            background: accentColor, fontFamily: '"Space Mono",monospace', fontSize: '12px', fontWeight: 700,
            flexShrink: 0,
          }}>{index + 1}</span>
          <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', textAlign: 'left' }}>
            {step.label}
          </span>
        </div>
        <span style={{ fontSize: '16px', flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '16px' }}>
          {/* Description */}
          <p style={{
            fontFamily: '"Space Grotesk",sans-serif', fontSize: '13px', lineHeight: 1.7,
            color: '#333333', marginBottom: '14px',
            padding: '10px 12px', background: '#F5F5F5', border: '2px solid #E0E0E0',
          }}>
            {step.description}
          </p>

          {/* Input / Output visual */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {inArr && (
              <div>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '6px' }}>Input</span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {inArr.map((b, i) => <BitCell key={i} bit={b} highlight={b === 1 ? 'teal' : ''} />)}
                </div>
              </div>
            )}
            {outArr && (
              <div>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '6px' }}>Output</span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {outArr.map((b, i) => <BitCell key={i} bit={b} highlight={b === 1 ? 'yellow' : ''} />)}
                </div>
              </div>
            )}
            {step.table && (
              <div>
                <span style={{ fontFamily: '"Space Mono",monospace', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '6px' }}>Tabel Permutasi</span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {step.table.map((v, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '24px', height: '24px', border: '2px solid #111111',
                      background: '#FFE156', fontFamily: '"Space Mono",monospace', fontSize: '10px', fontWeight: 700,
                    }}>{v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** SBox reference table */
function SBoxTable({ data, label, accent }) {
  return (
    <div style={{ border: '4px solid #111111', boxShadow: '3px 3px 0px #111111', background: 'white', flex: 1, minWidth: '200px' }}>
      <div style={{ padding: '8px 12px', borderBottom: '3px solid #111111', background: accent }}>
        <span style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ padding: '12px', overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: '"Space Mono",monospace', fontSize: '12px' }}>
          <thead>
            <tr>
              {['', 'col00', 'col01', 'col10', 'col11'].map(h => (
                <th key={h} style={{ padding: '4px 8px', textAlign: 'center', fontWeight: 700, color: '#666', fontSize: '10px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri}>
                <td style={{ padding: '4px 8px', fontWeight: 700, color: '#666', fontSize: '10px' }}>row{ri.toString(2).padStart(2,'0')}</td>
                {row.map((v, ci) => (
                  <td key={ci} style={{ padding: '4px 8px', textAlign: 'center', border: '2px solid #111111', background: 'white', fontWeight: 700 }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function SDESPage() {
  const [mode, setMode]           = useState('encrypt'); // 'encrypt' | 'decrypt'
  const [plainStr, setPlainStr]   = useState('00000000');
  const [keyStr, setKeyStr]       = useState('0000000000');
  const [result, setResult]       = useState(null);
  const [errors, setErrors]       = useState({});
  const [showSteps, setShowSteps] = useState(false);

  const plainBits = parseBits(plainStr, 8)  ?? Array(8).fill(0);
  const keyBits   = parseBits(keyStr,  10) ?? Array(10).fill(0);

  const handleProcess = useCallback(() => {
    const pb = parseBits(plainStr, 8);
    const kb = parseBits(keyStr, 10);
    const newErrors = {};
    if (!pb) newErrors.plain = true;
    if (!kb) newErrors.key   = true;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    const keyData = generateKeys(kb);
    let encData;
    if (mode === 'encrypt') {
      encData = encrypt(pb, kb);
    } else {
      encData = decrypt(pb, kb);
    }

    setResult({
      input: pb,
      output: encData.result,
      keyTrace: keyData.trace,
      encTrace: encData.trace,
      K1: keyData.K1,
      K2: keyData.K2,
    });
    setShowSteps(false);
  }, [plainStr, keyStr, mode]);

  const handleReset = () => {
    setPlainStr('00000000');
    setKeyStr('0000000000');
    setResult(null);
    setErrors({});
    setShowSteps(false);
  };

  const inputLabel  = mode === 'encrypt' ? 'Plaintext (8-bit)' : 'Ciphertext (8-bit)';
  const outputLabel = mode === 'encrypt' ? 'Ciphertext (Hasil Enkripsi)' : 'Plaintext (Hasil Dekripsi)';

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', fontFamily: '"Space Grotesk", sans-serif' }}>
      <Navbar accentColor={ACCENT} moduleLabel="S-DES" />

      {/* ── Hero ─────────────────────────────────── */}
      <div style={{ background: '#CCFAF0', borderBottom: '4px solid #111111', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ padding: '3px 10px', border: '3px solid #111111', boxShadow: '2px 2px 0px #111111', background: ACCENT, fontFamily: '"Space Mono",monospace', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>S-DES</span>
              <span style={{ padding: '3px 10px', border: '3px solid #111111', background: 'white', fontFamily: '"Space Mono",monospace', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Tugas UAS · Sem 6</span>
            </div>
            <h1 style={{ margin: 0, fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3rem)', textTransform: 'uppercase', lineHeight: 1, color: '#111111' }}>
              Simplified DES
            </h1>
            <p style={{ margin: '6px 0 0', fontFamily: '"Space Mono",monospace', fontSize: '11px', color: '#111111', opacity: 0.5, textTransform: 'uppercase' }}>
              8-Bit Block · 10-Bit Key · 2 Feistel Rounds · Imam Rizki Saputra · 301230013
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['K1 & K2 Generation','IP','Feistel Round 1','Feistel Round 2','SW (Swap)','FP'].map(f => (
              <span key={f} style={{
                padding: '3px 8px', border: '2px solid #111111', boxShadow: '2px 2px 0px #111111',
                fontFamily: '"Space Mono",monospace', fontSize: '10px', fontWeight: 700,
                background: ACCENT, textTransform: 'uppercase', color: '#111111',
              }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>

            {/* ── Input Card ── */}
            <div style={{ border: '4px solid #111111', boxShadow: '6px 6px 0px #111111', background: 'white' }}>
              <div style={{ padding: '12px 16px', borderBottom: '4px solid #111111', background: ACCENT, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', color: '#111111' }}>📥 Input Simulator</span>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Mode Toggle */}
                <div>
                  <span style={{ display: 'block', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', color: '#111111' }}>Mode Operasi</span>
                  <div style={{ display: 'inline-flex', border: '4px solid #111111', overflow: 'hidden' }}>
                    {[['encrypt','🔒 Enkripsi'],['decrypt','🔓 Dekripsi']].map(([v, l]) => (
                      <button key={v} onClick={() => setMode(v)}
                        style={{
                          padding: '8px 20px', border: 'none', cursor: 'pointer',
                          fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '13px',
                          textTransform: 'uppercase', letterSpacing: '0.03em',
                          background: mode === v ? '#111111' : 'white',
                          color: mode === v ? ACCENT : '#111111',
                          borderRight: v === 'encrypt' ? '4px solid #111111' : 'none',
                          transition: 'background 0.1s, color 0.1s',
                        }}
                      >{l}</button>
                    ))}
                  </div>
                </div>

                {/* Bit inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <BitInput
                    label={inputLabel}
                    bits={parseBits(plainStr, 8) ?? Array(8).fill(0)}
                    length={8}
                    error={errors.plain}
                    onChange={v => { setPlainStr(v.replace(/[^01]/g,'')); setErrors(e => ({...e, plain: false})); }}
                  />
                  <BitInput
                    label="Kunci Enkripsi (10-bit)"
                    bits={parseBits(keyStr, 10) ?? Array(10).fill(0)}
                    length={10}
                    error={errors.key}
                    onChange={v => { setKeyStr(v.replace(/[^01]/g,'')); setErrors(e => ({...e, key: false})); }}
                  />
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={handleProcess} style={{
                    flex: 1, minWidth: '120px', padding: '12px 24px', border: '4px solid #111111',
                    boxShadow: '4px 4px 0px #111111', background: ACCENT, color: '#111111',
                    fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '14px',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0px #111111'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #111111'; }}
                  >▶ Proses S-DES</button>

                  <button onClick={handleReset} style={{
                    padding: '12px 20px', border: '4px solid #111111', boxShadow: '4px 4px 0px #111111',
                    background: 'white', color: '#111111',
                    fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '14px',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0px #111111'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #111111'; }}
                  >↺ Reset</button>

                  <button onClick={() => { setPlainStr('01110010'); setKeyStr('1010000010'); setErrors({}); }} style={{
                    padding: '12px 20px', border: '4px solid #111111', boxShadow: '4px 4px 0px #111111',
                    background: '#FFE156', color: '#111111',
                    fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '14px',
                    textTransform: 'uppercase', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0px #111111'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px #111111'; }}
                  >⚗ Test Vector</button>
                </div>
              </div>
            </div>

            {/* ── Result Card ── */}
            <AnimatePresence>
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ border: '4px solid #111111', boxShadow: '6px 6px 0px #111111', background: 'white' }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '4px solid #111111', background: '#111111', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', color: ACCENT }}>
                      ✅ {outputLabel}
                    </span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    {/* Subkeys */}
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                      {[['K1', result.K1], ['K2', result.K2]].map(([label, bits]) => (
                        <div key={label} style={{ flex: 1, minWidth: '200px', border: '3px solid #111111', boxShadow: '2px 2px 0px #111111' }}>
                          <div style={{ padding: '6px 12px', borderBottom: '3px solid #111111', background: ACCENT }}>
                            <span style={{ fontFamily: '"Space Mono",monospace', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Subkunci {label}</span>
                          </div>
                          <div style={{ padding: '12px', display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                            {bits.map((b, i) => <BitCell key={i} bit={b} highlight={b === 1 ? 'teal' : ''} />)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input → Output */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center justify-items-center md:justify-items-stretch mb-5">
                      <div style={{ border: '3px solid #111111', boxShadow: '2px 2px 0px #111111' }}>
                        <div style={{ padding: '6px 12px', borderBottom: '3px solid #111111', background: '#E0E0E0' }}>
                          <span style={{ fontFamily: '"Space Mono",monospace', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} Input</span>
                        </div>
                        <div style={{ padding: '12px', display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                          {result.input.map((b, i) => <BitCell key={i} bit={b} />)}
                        </div>
                        <div style={{ padding: '4px 12px', borderTop: '2px solid #E0E0E0' }}>
                          <code style={{ fontFamily: '"Space Mono",monospace', fontSize: '12px', fontWeight: 700 }}>
                            {result.input.join('')} = 0x{parseInt(result.input.join(''),2).toString(16).toUpperCase().padStart(2,'0')}
                          </code>
                        </div>
                      </div>

                      <div className="text-xl md:text-2xl font-black rotate-90 md:rotate-0">→</div>

                      <div style={{ border: '4px solid #111111', boxShadow: '4px 4px 0px #111111' }}>
                        <div style={{ padding: '6px 12px', borderBottom: '4px solid #111111', background: ACCENT }}>
                          <span style={{ fontFamily: '"Space Mono",monospace', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>{mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'} Output</span>
                        </div>
                        <div style={{ padding: '12px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {result.output.map((b, i) => <BitCell key={i} bit={b} highlight={b === 1 ? 'teal' : 'yellow'} />)}
                        </div>
                        <div style={{ padding: '8px 12px', borderTop: '3px solid #111111', background: '#CCFAF0' }}>
                          <code style={{ fontFamily: '"Space Mono",monospace', fontSize: '14px', fontWeight: 900 }}>
                            {result.output.join('')} = 0x{parseInt(result.output.join(''),2).toString(16).toUpperCase().padStart(2,'0')}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Show steps toggle */}
                    <button
                      onClick={() => setShowSteps(s => !s)}
                      style={{
                        width: '100%', padding: '12px 16px', border: '4px solid #111111',
                        boxShadow: showSteps ? 'none' : '4px 4px 0px #111111',
                        transform: showSteps ? 'translate(2px,2px)' : 'none',
                        background: showSteps ? '#FFE156' : 'white', color: '#111111',
                        fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '13px',
                        textTransform: 'uppercase', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      <span>📋 {showSteps ? 'Sembunyikan' : 'Tampilkan'} Solusi Penyelesaian Step-by-Step</span>
                      <span>{showSteps ? '▲' : '▼'}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ border: '4px solid #111111', boxShadow: '4px 4px 0px #111111', background: 'white', padding: '3rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                  <h3 style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '1.25rem', textTransform: 'uppercase', marginBottom: '8px' }}>Simulator Siap</h3>
                  <p style={{ fontFamily: '"Space Grotesk",sans-serif', color: '#666', fontSize: '0.9rem' }}>
                    Masukkan plaintext 8-bit dan kunci 10-bit, lalu tekan <strong>Proses S-DES</strong> untuk memulai.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Step-by-step Trace ── */}
            <AnimatePresence>
              {showSteps && result && (
                <motion.div key="steps" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                  {/* Key Generation */}
                  <div style={{ border: '4px solid #111111', boxShadow: '4px 4px 0px #111111', background: 'white', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '4px solid #111111', background: ACCENT }}>
                      <span style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase' }}>🗝️ Fase 1: Pembangkitan Kunci (K1 & K2)</span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <p style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '13px', color: '#555', marginBottom: '1rem', padding: '10px', background: '#F0FDF9', border: '2px solid #5FE3C4' }}>
                        Kunci 10-bit diolah menggunakan permutasi P10, pergeseran kiri (LS-1 & LS-2), dan permutasi P8 untuk menghasilkan dua subkunci K1 dan K2 yang masing-masing berukuran 8-bit.
                      </p>
                      {result.keyTrace.map((step, i) => (
                        <StepCard key={i} step={step} index={i} accentColor={ACCENT} />
                      ))}
                    </div>
                  </div>

                  {/* Encryption/Decryption */}
                  <div style={{ border: '4px solid #111111', boxShadow: '4px 4px 0px #111111', background: 'white' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '4px solid #111111', background: '#111111' }}>
                      <span style={{ fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', color: ACCENT }}>
                        {mode === 'encrypt' ? '🔒 Fase 2: Proses Enkripsi' : '🔓 Fase 2: Proses Dekripsi'}
                      </span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <p style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: '13px', color: '#555', marginBottom: '1rem', padding: '10px', background: '#F5F5F5', border: '2px solid #DDD' }}>
                        {mode === 'encrypt'
                          ? 'Plaintext 8-bit diproses melalui IP → Putaran Feistel 1 (K1) → SW (Swap) → Putaran Feistel 2 (K2) → IP⁻¹ → Ciphertext.'
                          : 'Ciphertext 8-bit diproses melalui IP → Putaran Feistel 1 (K2) → SW (Swap) → Putaran Feistel 2 (K1) → IP⁻¹ → Plaintext. (Urutan kunci dibalik dari enkripsi).'}
                      </p>
                      {result.encTrace.map((step, i) => (
                        <StepCard key={i} step={step} index={i} accentColor="#FFE156" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar ─── S-Box Reference */}
          <div className="w-full lg:w-[300px] flex flex-col gap-4 lg:sticky lg:top-[72px] shrink-0">
            <div style={{ border: '4px solid #111111', boxShadow: '4px 4px 0px #111111', background: 'white' }}>
              <div style={{ padding: '12px 16px', borderBottom: '4px solid #111111', background: ACCENT }}>
                <span style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase' }}>📊 Referensi S-Box</span>
              </div>
              <div className="p-4 flex flex-col sm:flex-row lg:flex-col gap-4">
                <SBoxTable data={S0_TABLE} label="S-Box S0" accent="#CCFAF0" />
                <SBoxTable data={S1_TABLE} label="S-Box S1" accent="#FFF3CC" />
              </div>
            </div>

            {/* Algorithm info card */}
            <div style={{ border: '4px solid #111111', boxShadow: '4px 4px 0px #111111', background: '#CCFAF0' }}>
              <div style={{ padding: '12px 16px', borderBottom: '4px solid #111111' }}>
                <span style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}>ℹ️ Cara Kerja S-DES</span>
              </div>
              <div style={{ padding: '1rem' }}>
                {[
                  ['1', 'Key Gen', 'P10 → LS-1 → P8 → K1; LS-2 → P8 → K2'],
                  ['2', 'IP', 'Permutasi awal plaintext 8-bit'],
                  ['3', 'Round 1', 'Feistel dengan K1 (EP, XOR, S-Box, P4)'],
                  ['4', 'SW', 'Tukar bagian kiri dan kanan (Swap)'],
                  ['5', 'Round 2', 'Feistel dengan K2 (EP, XOR, S-Box, P4)'],
                  ['6', 'IP⁻¹', 'Permutasi invers → Ciphertext'],
                ].map(([n, step, desc]) => (
                  <div key={n} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '22px', height: '22px', border: '2px solid #111111', background: ACCENT,
                      fontFamily: '"Space Mono",monospace', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                    }}>{n}</span>
                    <div>
                      <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}>{step}</div>
                      <div style={{ fontFamily: '"Space Mono",monospace', fontSize: '10px', color: '#555', lineHeight: 1.4 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────── */}
      <footer style={{
        marginTop: '3rem', borderTop: '4px solid #111111', padding: '1.25rem 1.5rem',
        background: ACCENT, textAlign: 'center',
        fontFamily: '"Space Mono", monospace', fontSize: '11px', fontWeight: 700,
        textTransform: 'uppercase', color: '#111111',
      }}>
        <strong>Imam Rizki Saputra · 301230013</strong> | S-DES Simulator · Teknik Informatika UNIBBA · Kriptografi 2026
        &nbsp;|&nbsp;
        <a href="https://github.com/imamrzkys/UAS-KRIPTOGRAFI" target="_blank" rel="noreferrer" style={{ color: '#111111', textDecoration: 'underline' }}>GitHub</a>
      </footer>
    </div>
  );
}
