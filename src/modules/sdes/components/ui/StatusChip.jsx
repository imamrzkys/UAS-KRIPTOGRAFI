import './StatusChip.css';

/**
 * StatusChip - Small status indicator with optional dot
 * @param {Object} props
 * @param {'blue'|'cyan'|'purple'|'green'} props.variant
 * @param {boolean} props.dot
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 */
export default function StatusChip({
  variant = 'blue',
  dot = false,
  children,
  className = '',
}) {
  return (
    <span className={`status-chip status-chip--${variant} ${className}`}>
      {dot && <span className="status-chip__dot" />}
      <span className="status-chip__label">{children}</span>
    </span>
  );
}
