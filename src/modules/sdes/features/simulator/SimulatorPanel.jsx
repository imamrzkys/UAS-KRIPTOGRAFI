import { useSimulator } from '../../context/SimulatorContext';
import GlassCard from '../../components/ui/GlassCard';
import BitInput from '../../components/simulator/BitInput';
import PillButton from '../../components/ui/PillButton';
import './SimulatorPanel.css';

/**
 * SimulatorPanel - Top deck with 3 cards: Plaintext, Key, Controls
 */
export default function SimulatorPanel({ className = '' }) {
  const { state, dispatch, process } = useSimulator();
  const { plaintext, key, mode, isProcessing } = state;

  const handleTogglePlaintext = (index) => {
    dispatch({ type: 'TOGGLE_PLAINTEXT_BIT', payload: index });
  };

  const handleToggleKey = (index) => {
    dispatch({ type: 'TOGGLE_KEY_BIT', payload: index });
  };

  const handleModeChange = (selectedMode) => {
    dispatch({ type: 'SET_MODE', payload: selectedMode });
  };

  return (
    <div className={`simulator-panel ${className}`}>
      {/* Plaintext Card */}
      <GlassCard className="simulator-panel__card">
        <BitInput
          bits={plaintext}
          onToggle={handleTogglePlaintext}
          label={`${mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} (8-Bit)`}
        />
      </GlassCard>

      {/* Key Card */}
      <GlassCard className="simulator-panel__card">
        <BitInput
          bits={key}
          onToggle={handleToggleKey}
          label="Kunci (10-Bit)"
        />
      </GlassCard>

      {/* Controls Card */}
      <GlassCard className="simulator-panel__card simulator-panel__controls">
        <label className="simulator-panel__label">Kontrol</label>
        <div className="simulator-panel__btn-group">
          <PillButton
            variant={mode === 'encrypt' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => {
              // Jika mode berubah, clear hasil dulu
              if (mode !== 'encrypt') {
                handleModeChange('encrypt');
              } else {
                // Jika sudah di mode yang sama, langsung proses
                process();
              }
            }}
            disabled={isProcessing}
          >
            Enkripsi
          </PillButton>
          <PillButton
            variant={mode === 'decrypt' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => {
              // Jika mode berubah, clear hasil dulu
              if (mode !== 'decrypt') {
                handleModeChange('decrypt');
              } else {
                // Jika sudah di mode yang sama, langsung proses
                process();
              }
            }}
            disabled={isProcessing}
          >
            Dekripsi
          </PillButton>
        </div>
      </GlassCard>
    </div>
  );
}
