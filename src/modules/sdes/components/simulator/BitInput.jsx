import BitBox from '../ui/BitBox';
import './BitInput.css';

/**
 * BitInput - Row of clickable BitBoxes for binary input
 * @param {Object} props
 * @param {number[]} props.bits - Array of bit values
 * @param {Function} props.onToggle - Called with (index) on click
 * @param {string} props.label - Input label
 * @param {'sm'|'md'|'lg'} props.size
 * @param {string} props.className
 */
export default function BitInput({
  bits = [],
  onToggle,
  label,
  size = 'md',
  className = '',
}) {
  return (
    <div className={`bit-input ${className}`}>
      {label && (
        <label className="bit-input__label">
          {label}
        </label>
      )}
      <div className="bit-input__row">
        {bits.map((bit, index) => (
          <BitBox
            key={index}
            value={bit}
            size={size}
            onClick={() => onToggle && onToggle(index)}
          />
        ))}
      </div>
    </div>
  );
}
