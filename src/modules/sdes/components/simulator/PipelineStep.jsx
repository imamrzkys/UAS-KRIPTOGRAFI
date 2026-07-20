import { motion } from 'framer-motion';
import { S0, S1 } from '../../utils/sboxLookup';
import './PipelineStep.css';

/** Render satu bit sebagai kotak berwarna */
function BitBox({ value, color = 'cyan', delay = 0, labelAbove, labelBelow }) {
  const isOne = value === 1;
  return (
    <div className="ps-bit-wrapper">
      {labelAbove && <span className="ps-bit-label-above">{labelAbove}</span>}
      <motion.span
        className={`ps-bit ps-bit--${color} ${isOne ? 'ps-bit--on' : 'ps-bit--off'}`}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay }}
      >
        {value}
      </motion.span>
      {labelBelow && <span className="ps-bit-label-below">{labelBelow}</span>}
    </div>
  );
}

/** Render array bit sebagai deretan kotak */
function BitRow({ bits, indices, color = 'cyan', baseDelay = 0 }) {
  if (!bits || !Array.isArray(bits)) return null;
  return (
    <div className="ps-bitrow">
      <div className="ps-bitrow__bits">
        {bits.map((b, i) => (
          <BitBox
            key={i}
            value={b}
            color={color}
            delay={baseDelay + i * 0.03}
            labelBelow={indices ? String(indices[i]) : null}
          />
        ))}
      </div>
    </div>
  );
}

/** Tampilkan input bisa berupa array atau object {left, right} atau {K1, K2} dll */
function InputOutput({ label, val, color = 'cyan', baseDelay = 0 }) {
  if (val === undefined || val === null) return null;

  if (Array.isArray(val)) {
    return <BitRow bits={val} color={color} baseDelay={baseDelay} />;
  }

  if (typeof val === 'object') {
    // {K1, K2}
    if (val.K1 && val.K2) {
      return (
        <div className="ps-io-group">
          {label && <span className="ps-io-group__title">{label}</span>}
          <BitRow bits={val.K1} color="purple" baseDelay={baseDelay} />
          <BitRow bits={val.K2} color="cyan" baseDelay={baseDelay + 0.1} />
        </div>
      );
    }
    // {left, right}
    if (val.left !== undefined && val.right !== undefined) {
      return (
        <div className="ps-io-group">
          {label && <span className="ps-io-group__title">{label}</span>}
          <BitRow bits={val.left} color="cyan" baseDelay={baseDelay} />
          <BitRow bits={val.right} color="purple" baseDelay={baseDelay + 0.1} />
        </div>
      );
    }
    // {ep, key}
    if (val.ep && val.key) {
      return (
        <div className="ps-io-group">
          {label && <span className="ps-io-group__title">{label}</span>}
          <BitRow bits={val.ep} color="cyan" baseDelay={baseDelay} />
          <BitRow bits={val.key} color="purple" baseDelay={baseDelay + 0.1} />
        </div>
      );
    }
    // {left, p4}
    if (val.left && val.p4) {
      return (
        <div className="ps-io-group">
          {label && <span className="ps-io-group__title">{label}</span>}
          <BitRow bits={val.left} color="cyan" baseDelay={baseDelay} />
          <BitRow bits={val.p4} color="purple" baseDelay={baseDelay + 0.1} />
        </div>
      );
    }
  }

  return null;
}

/** Visualizer khusus untuk langkah Permutasi */
function PermutationVisualizer({ input, output, table, delay }) {
  const inputIndices = Array.from({ length: input.length }, (_, i) => i + 1);
  const outputIndices = table;

  return (
    <div className="ps-visualizer ps-permutation">
      <div className="ps-vis-row">
        <span className="ps-vis-label">Sebelum Permutasi:</span>
        <BitRow bits={input} indices={inputIndices} color="cyan" baseDelay={delay} />
      </div>
      <div className="ps-vis-table-info">
        <span className="ps-table-badge">Tabel Permutasi: [{table.join(', ')}]</span>
      </div>
      <div className="ps-vis-row">
        <span className="ps-vis-label">Hasil Permutasi:</span>
        <BitRow bits={output} indices={outputIndices} color="purple" baseDelay={delay + 0.1} />
      </div>
    </div>
  );
}

/** Visualizer khusus untuk langkah Split (Pembagian Kiri/Kanan) */
function SplitVisualizer({ input, output, delay }) {
  const is10Bit = input.length === 10;
  const inputIndices = Array.from({ length: input.length }, (_, i) => i + 1);
  const leftBits = output.left;
  const rightBits = output.right;

  const leftIndices = is10Bit ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
  const rightIndices = is10Bit ? [6, 7, 8, 9, 10] : [5, 6, 7, 8];

  return (
    <div className="ps-visualizer ps-split">
      <div className="ps-vis-row">
        <span className="ps-vis-label">Sebelum Dipecah:</span>
        <BitRow bits={input} indices={inputIndices} color="cyan" baseDelay={delay} />
      </div>
      <div className="ps-split-container">
        <div className="ps-split-half">
          <span className="ps-split-title">HASIL KIRI (L)</span>
          <BitRow bits={leftBits} indices={leftIndices} color="cyan" baseDelay={delay + 0.08} />
        </div>
        <div className="ps-split-divider">|</div>
        <div className="ps-split-half">
          <span className="ps-split-title">HASIL KANAN (R)</span>
          <BitRow bits={rightBits} indices={rightIndices} color="purple" baseDelay={delay + 0.12} />
        </div>
      </div>
    </div>
  );
}

/** Visualizer khusus untuk langkah Geser Kiri (Left Shift) */
function ShiftVisualizer({ label, input, output, delay }) {
  const isLS1 = label.includes('LS-1') || label.includes('1 Posisi');
  
  const leftInIndices = isLS1 ? [1, 2, 3, 4, 5] : [2, 3, 4, 5, 1];
  const rightInIndices = isLS1 ? [6, 7, 8, 9, 10] : [7, 8, 9, 10, 6];

  const leftOutIndices = isLS1 ? [2, 3, 4, 5, 1] : [4, 5, 1, 2, 3];
  const rightOutIndices = isLS1 ? [7, 8, 9, 10, 6] : [9, 10, 6, 7, 8];

  return (
    <div className="ps-visualizer ps-shift">
      <div className="ps-shift-container">
        <div className="ps-shift-half">
          <span className="ps-shift-title">Kiri Sebelum Digeser:</span>
          <BitRow bits={input.left} indices={leftInIndices} color="cyan" baseDelay={delay} />
        </div>
        <div className="ps-shift-half">
          <span className="ps-shift-title">Kanan Sebelum Digeser:</span>
          <BitRow bits={input.right} indices={rightInIndices} color="cyan" baseDelay={delay + 0.05} />
        </div>
      </div>
      
      <div className="ps-shift-arrows">
        <span className="ps-shift-badge">Geser Kiri {isLS1 ? '1' : '2'} Posisi Sirkuler</span>
      </div>

      <div className="ps-shift-container">
        <div className="ps-shift-half">
          <span className="ps-shift-title">Hasil Geser Kiri (L):</span>
          <BitRow bits={output.slice(0, 5)} indices={leftOutIndices} color="purple" baseDelay={delay + 0.1} />
        </div>
        <div className="ps-shift-half">
          <span className="ps-shift-title">Hasil Geser Kiri (R):</span>
          <BitRow bits={output.slice(5)} indices={rightOutIndices} color="purple" baseDelay={delay + 0.15} />
        </div>
      </div>
    </div>
  );
}

/** Visualizer khusus untuk hitungan XOR Vertikal */
function XorVisualizer({ input, output, delay }) {
  const hasEp = input.ep !== undefined;
  const in1 = hasEp ? input.ep : input.left;
  const in2 = hasEp ? input.key : input.p4;
  const label1 = hasEp ? 'EP (Sebelum XOR)' : 'Kiri (L)';
  const label2 = hasEp ? 'Subkunci (K)' : 'Hasil P4';

  return (
    <div className="ps-visualizer ps-xor">
      <div className="ps-xor-table">
        <div className="ps-xor-row">
          <span className="ps-xor-row-label">{label1}</span>
          <div className="ps-xor-row-bits">
            {in1.map((b, i) => (
              <span key={i} className={`ps-xor-bit ps-xor-bit--cyan ${b === 1 ? 'ps-xor-bit--on' : ''}`}>
                {b}
              </span>
            ))}
          </div>
        </div>
        <div className="ps-xor-row ps-xor-row--second">
          <span className="ps-xor-row-label">{label2}</span>
          <div className="ps-xor-row-bits">
            {in2.map((b, i) => (
              <span key={i} className={`ps-xor-bit ps-xor-bit--purple ${b === 1 ? 'ps-xor-bit--on' : ''}`}>
                {b}
              </span>
            ))}
          </div>
          <span className="ps-xor-symbol">⊕</span>
        </div>
        <div className="ps-xor-divider-line" />
        <div className="ps-xor-row ps-xor-row--result">
          <span className="ps-xor-row-label">Hasil XOR</span>
          <div className="ps-xor-row-bits">
            {output.map((b, i) => (
              <span key={i} className={`ps-xor-bit ps-xor-bit--result ${b === 1 ? 'ps-xor-bit--on' : ''}`}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Visualizer khusus untuk Lookup S-Box beserta Grid 4x4 Mini */
function SBoxVisualizer({ input, output, sboxInfo, delay }) {
  const { name, row, col, value } = sboxInfo;
  const matrix = name === 'S0' ? S0 : S1;

  return (
    <div className="ps-visualizer ps-sbox">
      <div className="ps-sbox-header-bits">
        <span className="ps-sbox-label">Masukan S-Box (4-bit):</span>
        <div className="ps-sbox-bit-row">
          <div className="ps-sbox-bit-container ps-sbox-bit-container--row">
            <BitBox value={input[0]} color="amber" delay={delay} />
            <span className="ps-sbox-bit-tag">b1 (Baris)</span>
          </div>
          <div className="ps-sbox-bit-container ps-sbox-bit-container--col">
            <BitBox value={input[1]} color="cyan" delay={delay + 0.03} />
            <span className="ps-sbox-bit-tag">b2 (Kolom)</span>
          </div>
          <div className="ps-sbox-bit-container ps-sbox-bit-container--col">
            <BitBox value={input[2]} color="cyan" delay={delay + 0.06} />
            <span className="ps-sbox-bit-tag">b3 (Kolom)</span>
          </div>
          <div className="ps-sbox-bit-container ps-sbox-bit-container--row">
            <BitBox value={input[3]} color="amber" delay={delay + 0.09} />
            <span className="ps-sbox-bit-tag">b4 (Baris)</span>
          </div>
        </div>
      </div>

      <div className="ps-sbox-content">
        <div className="ps-sbox-math">
          <div className="ps-sbox-math-card ps-sbox-math-card--row">
            <span className="ps-math-title">Pecah Koordinat Baris (b1, b4):</span>
            <span className="ps-math-expr">
              (b1, b4) = ({input[0]}, {input[3]})₂
            </span>
            <span className="ps-math-calc">
              2 × {input[0]} + {input[3]} = <strong>{row}</strong> (Desimal)
            </span>
          </div>

          <div className="ps-sbox-math-card ps-sbox-math-card--col">
            <span className="ps-math-title">Pecah Koordinat Kolom (b2, b3):</span>
            <span className="ps-math-expr">
              (b2, b3) = ({input[1]}, {input[2]})₂
            </span>
            <span className="ps-math-calc">
              2 × {input[1]} + {input[2]} = <strong>{col}</strong> (Desimal)
            </span>
          </div>
        </div>

        <div className="ps-sbox-grid-container">
          <span className="ps-sbox-grid-title">Pencarian pada Tabel Matriks {name}:</span>
          <div className="ps-sbox-table-wrapper">
            <table className="ps-sbox-mini-table">
              <thead>
                <tr>
                  <th className="corner">Row\Col</th>
                  <th className={col === 0 ? 'header-active' : ''}>00 (0)</th>
                  <th className={col === 1 ? 'header-active' : ''}>01 (1)</th>
                  <th className={col === 2 ? 'header-active' : ''}>10 (2)</th>
                  <th className={col === 3 ? 'header-active' : ''}>11 (3)</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((r, ri) => (
                  <tr key={ri} className={ri === row ? 'row-active' : ''}>
                    <td className="row-header">
                      {ri.toString(2).padStart(2, '0')} ({ri})
                    </td>
                    {r.map((val, ci) => {
                      const isTarget = ri === row && ci === col;
                      return (
                        <td
                          key={ci}
                          className={`mini-cell ${isTarget ? 'cell-active' : ''}`}
                        >
                          {val.toString(2).padStart(2, '0')}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="ps-sbox-result-desc">
            Hasil Keluaran S-Box (2-bit):
            <div className="ps-sbox-output-bits">
              <BitBox value={output[0]} color="purple" delay={delay + 0.15} />
              <BitBox value={output[1]} color="purple" delay={delay + 0.18} />
            </div>
            (Nilai koordinat S-Box [{row}][{col}] = <strong>{value}</strong> desimal)
          </div>
        </div>
      </div>
    </div>
  );
}

/** Visualizer khusus untuk langkah Penukaran (Swap) */
function SwapVisualizer({ input, output, delay }) {
  const leftIn = input.slice(0, 4);
  const rightIn = input.slice(4);
  const leftOut = output.slice(0, 4);
  const rightOut = output.slice(4);

  return (
    <div className="ps-visualizer ps-swap">
      <div className="ps-swap-container">
        <div className="ps-swap-block">
          <span className="ps-swap-tag">KIRI</span>
          <BitRow bits={leftIn} color="cyan" baseDelay={delay} />
        </div>
        <div className="ps-swap-divider">➔</div>
        <div className="ps-swap-block">
          <span className="ps-swap-tag">KANAN</span>
          <BitRow bits={rightIn} color="purple" baseDelay={delay + 0.03} />
        </div>
      </div>
      
      <div className="ps-swap-arrows">
        <span className="ps-swap-badge">Tukar Posisi Kiri & Kanan</span>
      </div>

      <div className="ps-swap-container">
        <div className="ps-swap-block">
          <span className="ps-swap-tag">Kiri Baru (Hasil Swap)</span>
          <BitRow bits={leftOut} color="purple" baseDelay={delay + 0.1} />
        </div>
        <div className="ps-swap-divider">➔</div>
        <div className="ps-swap-block">
          <span className="ps-swap-tag">Kanan Baru (Hasil Swap)</span>
          <BitRow bits={rightOut} color="cyan" baseDelay={delay + 0.13} />
        </div>
      </div>
    </div>
  );
}

/**
 * PipelineStep - Satu langkah dalam trace S-DES.
 * Menampilkan deskripsi + bit boxes untuk input dan output secara interaktif & edukatif.
 */
export default function PipelineStep({
  stepNumber,
  label,
  description,
  input,
  output,
  table,
  sbox,
  delay = 0,
  className = '',
}) {
  let visualizer = null;

  if (sbox) {
    visualizer = <SBoxVisualizer input={input} output={output} sboxInfo={sbox} delay={delay} />;
  } else if (table) {
    visualizer = <PermutationVisualizer input={input} output={output} table={table} delay={delay} />;
  } else if (label.includes('Split') || label.includes('Pembagian')) {
    visualizer = <SplitVisualizer input={input} output={output} delay={delay} />;
  } else if (label.includes('LS-') || label.includes('Geser Kiri')) {
    visualizer = <ShiftVisualizer label={label} input={input} output={output} delay={delay} />;
  } else if (label.includes('XOR')) {
    visualizer = <XorVisualizer input={input} output={output} delay={delay} />;
  } else if (label.includes('SW') || label.includes('Penukaran')) {
    visualizer = <SwapVisualizer input={input} output={output} delay={delay} />;
  } else {
    // Default fallback
    visualizer = (
      <div className="pipeline-step__io">
        <div className="pipeline-step__io-block pipeline-step__io-block--input">
          <span className="pipeline-step__io-tag pipeline-step__io-tag--in">INPUT DATA</span>
          <InputOutput val={input} color="cyan" baseDelay={delay + 0.05} />
        </div>
        <div className="pipeline-step__io-arrow">→</div>
        <div className="pipeline-step__io-block pipeline-step__io-block--output">
          <span className="pipeline-step__io-tag pipeline-step__io-tag--out">OUTPUT DATA</span>
          <InputOutput val={output} color="purple" baseDelay={delay + 0.1} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`pipeline-step ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {/* Nomor & garis vertikal */}
      <div className="pipeline-step__marker">
        <span className="pipeline-step__number">{String(stepNumber).padStart(2, '0')}</span>
        <div className="pipeline-step__line" />
      </div>

      {/* Konten */}
      <div className="pipeline-step__content">
        {/* Label langkah */}
        <h4 className="pipeline-step__label">{label}</h4>

        {/* Penjelasan teks */}
        <p className="pipeline-step__desc">{description}</p>

        {/* Visualizer khusus */}
        {visualizer}
      </div>
    </motion.div>
  );
}
