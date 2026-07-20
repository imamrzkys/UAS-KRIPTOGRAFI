import { useSimulator } from '../../context/SimulatorContext';
import GlassCard from '../../components/ui/GlassCard';
import BitOutput from '../../components/simulator/BitOutput';
import KeyDisplay from '../../components/simulator/KeyDisplay';
import PillButton from '../../components/ui/PillButton';
import './ResultPanel.css';

/**
 * ResultPanel - Menampilkan hasil enkripsi/dekripsi beserta subkunci
 */
export default function ResultPanel({ className = '' }) {
  const { state, process, reset } = useSimulator();
  const { result, K1, K2, mode, isProcessing, plaintext, key } = state;

  // Konversi bit array ke nilai desimal dan hex untuk info tambahan
  const toDecimal = (bits) => bits ? parseInt(bits.join(''), 2) : null;
  const toHex     = (bits) => bits ? parseInt(bits.join(''), 2).toString(16).toUpperCase().padStart(2, '0') : null;

  const inputBits = plaintext;
  const resultDec = toDecimal(result);
  const resultHex = toHex(result);
  const inputDec  = toDecimal(inputBits);
  const inputHex  = toHex(inputBits);

  return (
    <GlassCard className={`result-panel ${className}`} variant="accent">
      <div className="result-panel__header">
        <h2 className="result-panel__title uppercase">
          Hasil {mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi'}
        </h2>
        {result && (
          <span className="result-panel__badge">
            {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}
          </span>
        )}
      </div>

      <div className="result-panel__content">
        {/* Bit output hasil */}
        <BitOutput
          bits={result}
          size="lg"
          className="result-panel__bits"
        />

        {/* Tabel ringkasan nilai jika sudah ada hasil */}
        {result && (
          <div className="result-panel__summary">
            <div className="result-panel__summary-row">
              <span className="result-panel__summary-label">
                {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} Awal
              </span>
              <span className="result-panel__summary-val mono">
                {inputBits?.join('')}
                <span className="result-panel__summary-meta">
                  &nbsp;(Des: {inputDec}, Hex: {inputHex})
                </span>
              </span>
            </div>
            <div className="result-panel__summary-row result-panel__summary-row--highlight">
              <span className="result-panel__summary-label">
                {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'} Hasil
              </span>
              <span className="result-panel__summary-val mono">
                {result.join('')}
                <span className="result-panel__summary-meta">
                  &nbsp;(Des: {resultDec}, Hex: {resultHex})
                </span>
              </span>
            </div>
            <div className="result-panel__summary-row">
              <span className="result-panel__summary-label">Kunci 10-bit</span>
              <span className="result-panel__summary-val mono">
                {key?.join('')}
              </span>
            </div>
          </div>
        )}

        {/* Subkunci K1 dan K2 */}
        <KeyDisplay K1={K1} K2={K2} className="result-panel__keys" />

        {/* Tombol proses atau ulangi */}
        {!result && !isProcessing && (
          <div className="result-panel__actions">
            <PillButton
              variant="primary"
              size="lg"
              onClick={process}
              loading={isProcessing}
            >
              Proses Sekarang
            </PillButton>
          </div>
        )}

        {result && (
          <div className="result-panel__actions">
            <PillButton
              variant="ghost"
              size="md"
              onClick={reset}
            >
              Ulangi / Reset
            </PillButton>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
