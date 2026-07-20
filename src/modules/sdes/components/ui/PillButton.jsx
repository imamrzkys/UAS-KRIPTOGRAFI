import { motion } from 'framer-motion';
import './PillButton.css';

/**
 * PillButton - Rounded pill-shaped button
 * @param {Object} props
 * @param {'primary'|'ghost'|'cyan'} props.variant
 * @param {'sm'|'md'|'lg'} props.size
 * @param {Function} props.onClick
 * @param {React.ReactNode} props.icon
 * @param {boolean} props.loading
 * @param {boolean} props.disabled
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 */
export default function PillButton({
  variant = 'primary',
  size = 'md',
  onClick,
  icon,
  loading = false,
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  return (
    <motion.button
      className={`pill-btn pill-btn--${variant} pill-btn--${size} ${loading ? 'pill-btn--loading' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {loading && <span className="pill-btn__spinner" />}
      {icon && !loading && <span className="pill-btn__icon">{icon}</span>}
      <span className="pill-btn__label">{children}</span>
    </motion.button>
  );
}
