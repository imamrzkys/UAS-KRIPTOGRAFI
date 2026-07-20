import { motion } from 'framer-motion';
import BitBox from '../ui/BitBox';
import './BitOutput.css';

/**
 * BitOutput - Read-only animated result bit row
 * @param {Object} props
 * @param {number[]} props.bits - Result bit array
 * @param {string} props.label - Output label
 * @param {'sm'|'md'|'lg'} props.size
 * @param {string} props.className
 */
export default function BitOutput({
  bits = [],
  label,
  size = 'md',
  className = '',
}) {
  if (!bits || bits.length === 0) {
    return (
      <div className={`bit-output bit-output--empty ${className}`}>
        {label && <label className="bit-output__label">{label}</label>}
        <div className="bit-output__placeholder">
          <span className="bit-output__waiting">Menunggu proses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bit-output ${className}`}>
      {label && <label className="bit-output__label">{label}</label>}
      <motion.div
        className="bit-output__row"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.06 }
          }
        }}
      >
        {bits.map((bit, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 10, scale: 0.8 },
              visible: { opacity: 1, y: 0, scale: 1 }
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <BitBox
              value={bit}
              size={size}
              animated
              readOnly
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
