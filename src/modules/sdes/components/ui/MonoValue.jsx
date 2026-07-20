import './MonoValue.css';

/**
 * MonoValue - JetBrains Mono styled value display
 * @param {Object} props
 * @param {string|number} props.value
 * @param {string} props.label
 * @param {'sm'|'md'|'lg'} props.size
 * @param {string} props.className
 */
export default function MonoValue({
  value,
  label,
  size = 'md',
  className = '',
}) {
  return (
    <span className={`mono-value mono-value--${size} ${className}`}>
      {label && <span className="mono-value__label">{label}</span>}
      <span className="mono-value__text">{value}</span>
    </span>
  );
}
