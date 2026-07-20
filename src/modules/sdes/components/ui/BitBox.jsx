import { motion } from 'framer-motion';
import './BitBox.css';

/**
 * BitBox - 40x40px bit display with glow animation
 * @param {Object} props
 * @param {0|1} props.value - Bit value
 * @param {Function} props.onClick - Click handler
 * @param {'sm'|'md'|'lg'} props.size - Size variant
 * @param {boolean} props.animated - Enable pulse animation
 * @param {boolean} props.readOnly - Disable interaction
 * @param {string} props.className - Additional classes
 */
export default function BitBox({
  value = 0,
  onClick,
  size = 'md',
  animated = false,
  readOnly = false,
  className = '',
}) {
  const handleKeyDown = (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && onClick && !readOnly) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.button
      className={`bitbox bitbox--${size} ${value === 1 ? 'bitbox--active' : 'bitbox--dim'} ${animated ? 'bitbox--animated' : ''} ${readOnly ? 'bitbox--readonly' : ''} ${className}`}
      onClick={!readOnly ? onClick : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={readOnly ? -1 : 0}
      aria-label={`Bit value ${value}`}
      aria-pressed={value === 1}
      whileTap={!readOnly ? { scale: 0.9 } : {}}
      initial={animated ? { scale: 0.8, opacity: 0 } : false}
      animate={animated ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <span className="bitbox__value">{value}</span>
    </motion.button>
  );
}
