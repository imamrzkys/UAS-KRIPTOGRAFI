import { motion } from 'framer-motion';

export default function StateMatrix({ matrix, title, highlightIndices = [], glowClass = '' }) {
  if (!matrix || !Array.isArray(matrix) || matrix.length !== 4) {
    return (
      <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant">
        <h3 className="font-mono text-xs text-on-surface-variant mb-4 uppercase tracking-wider">
          {title}
        </h3>
        <div className="text-on-surface-variant text-sm">Tidak ada data matriks</div>
      </div>
    );
  }

  const isHighlighted = (row, col) => {
    return highlightIndices.some(([r, c]) => r === row && c === col);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const cellVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 350, damping: 25 }
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-3 sm:p-6 border border-outline-variant 
                  hover:border-outline transition-all duration-300 hover:shadow-lg min-w-0">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="font-mono text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-wider truncate pr-2">
          {title}
        </h3>
        <span className="text-[10px] sm:text-xs text-on-surface-variant whitespace-nowrap">State 4×4</span>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-4 gap-1 sm:gap-2"
      >
        {matrix.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const active = isHighlighted(rowIndex, colIndex);
            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                variants={cellVariants}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className={`
                  aspect-square flex items-center justify-center
                  bg-surface-container border-2 border-outline-variant
                  font-mono text-[10px] sm:text-sm font-semibold text-on-surface
                  rounded-lg transition-all duration-300
                  hover:shadow-lg hover:bg-surface-container-high
                  cursor-default relative group
                  ${active ? glowClass + ' scale-105 animate-pulse-glow border-primary' : ''}
                `}
                title={`Baris ${rowIndex}, Kolom ${colIndex}: 0x${value.toString(16).toUpperCase().padStart(2, '0')}`}
              >
                {value.toString(16).toUpperCase().padStart(2, '0')}

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 
                              bg-inverse-surface text-inverse-on-surface text-[10px] rounded
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200
                              pointer-events-none whitespace-nowrap z-25">
                  [{rowIndex},{colIndex}]: 0x{value.toString(16).toUpperCase().padStart(2, '0')}
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-outline-variant">
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-on-surface-variant">
          <span>Tampilan Heksadesimal</span>
          <span className="font-mono">16 byte</span>
        </div>
      </div>
    </div>
  );
}
