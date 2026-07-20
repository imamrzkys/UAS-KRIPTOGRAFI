import { motion } from 'framer-motion';
import StatusChip from '../ui/StatusChip';
import './KeyDisplay.css';

/**
 * KeyDisplay - Shows K1 and K2 subkey chips
 * @param {Object} props
 * @param {number[]} props.K1
 * @param {number[]} props.K2
 * @param {string} props.className
 */
export default function KeyDisplay({ K1, K2, className = '' }) {
  if (!K1 || !K2) return null;

  return (
    <motion.div
      className={`key-display ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <StatusChip variant="cyan" dot>
        K1: {K1.join('')}
      </StatusChip>
      <StatusChip variant="purple" dot>
        K2: {K2.join('')}
      </StatusChip>
    </motion.div>
  );
}
