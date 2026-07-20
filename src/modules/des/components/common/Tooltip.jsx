import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Neubrutalist Custom Tooltip
 * Wraps an element and shows a brutalist-styled popup box on hover.
 */
export function Tooltip({
  content,
  children,
  position = 'top', // 'top' | 'bottom'
  className = ''
}) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2'
  };

  const selectedPosition = positionClasses[position] || positionClasses.top;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {visible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
            transition={{ duration: 0.08 }}
            className={`
              absolute ${selectedPosition} z-50
              bg-black text-white border-2 border-white px-3 py-1.5
              font-mono text-[10px] uppercase tracking-wider text-center
              shadow-[3px_3px_0_#000] border-black
              pointer-events-none select-none
              ${className}
            `}
            style={{ borderRadius: '0px' }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tooltip;
