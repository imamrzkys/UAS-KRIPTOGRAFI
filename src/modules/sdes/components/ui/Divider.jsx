import './Divider.css';

/**
 * Divider - Horizontal divider with optional label
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.className
 */
export default function Divider({ label, className = '' }) {
  return (
    <div className={`divider ${label ? 'divider--labeled' : ''} ${className}`}>
      {label && <span className="divider__label">{label}</span>}
    </div>
  );
}
