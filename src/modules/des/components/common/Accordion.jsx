import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Neubrutalist Accordion Panel
 */
export function Accordion({
  isOpen,
  onToggle,
  title,
  headerBadge = null,
  headerSummary = null,
  children,
  variant = 'white',
  className = '',
  id = ''
}) {
  const bgColors = {
    white: 'bg-brutal-white',
    yellow: 'bg-brutal-yellow',
    purple: 'bg-brutal-purple',
    orange: 'bg-brutal-orange',
    green: 'bg-brutal-green',
    cream: 'bg-brutal-cream',
    surface: 'bg-brutal-surface',
  };

  const selectedBg = bgColors[variant] || bgColors.white;

  return (
    <div
      id={id}
      className={`
        border-3 border-black
        ${selectedBg}
        shadow-brutal
        transition-all duration-100
        ${className}
      `}
      style={{ borderRadius: '0px' }}
    >
      {/* Header trigger */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b-3 border-black bg-brutal-surface select-none outline-none focus-visible:bg-brutal-purple/20 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-3">
          {headerBadge && (
            <div className="px-2 py-0.5 border-2 border-black bg-black text-white font-mono text-xs font-bold uppercase">
              {headerBadge}
            </div>
          )}
          <span className="font-grotesk font-extrabold text-base tracking-wider uppercase text-black">
            {title}
          </span>
          {headerSummary && (
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-black/60 pl-3">
              {headerSummary}
            </div>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="w-7 h-7 flex items-center justify-center border-2 border-black bg-brutal-white shadow-brutal-sm"
        >
          <ChevronDown className="w-4 h-4 text-black stroke-[3px]" />
        </motion.div>
      </button>

      {/* Body content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 border-t-0 bg-brutal-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Accordion;
