import MonoValue from '../../components/ui/MonoValue';
import StatusChip from '../../components/ui/StatusChip';
import './SubkeyDisplay.css';

/**
 * SubkeyDisplay - Renders generated subkeys K1 and K2 in detailed format
 * @param {Object} props
 * @param {number[]} props.K1
 * @param {number[]} props.K2
 */
export default function SubkeyDisplay({ K1, K2 }) {
  if (!K1 || !K2) return null;

  return (
    <div className="subkey-display animate-fade-in">
      <div className="subkey-display__item">
        <StatusChip variant="cyan" dot>Subkey K1</StatusChip>
        <MonoValue value={K1.join('')} size="lg" />
      </div>
      <div className="subkey-display__item">
        <StatusChip variant="purple" dot>Subkey K2</StatusChip>
        <MonoValue value={K2.join('')} size="lg" />
      </div>
    </div>
  );
}
