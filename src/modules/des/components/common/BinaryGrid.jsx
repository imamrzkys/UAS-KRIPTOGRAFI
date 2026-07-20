import React from 'react';

/**
 * Neubrutalist Binary String Grid Renderer
 * Displays binary data as sets of individual bordered boxes.
 * 
 * @param {string} binaryString - The binary string to display (e.g. '10101111...')
 * @param {Array<number>} highlightIndices - 0-based indices of bits to highlight
 * @param {string} highlightColor - 'yellow' | 'purple' | 'orange' | 'green' | 'coral' | 'cream'
 * @param {Array<number>} dimIndices - 0-based indices of bits to dim (e.g. key parity bits)
 * @param {number} groupSize - Number of bits to group together (4 or 8)
 * @param {Array<string|number>} bitIndices - Original bit indices to print under/above each bit (1-indexed labels)
 */
export function BinaryGrid({
  binaryString = '',
  highlightIndices = [],
  highlightColor = 'yellow',
  dimIndices = [],
  groupSize = 4,
  bitIndices = null,
  interactive = false,
  onBitHover = null,
  className = ''
}) {
  if (!binaryString) return null;

  const bits = binaryString.split('');

  const colorClasses = {
    yellow: 'bg-brutal-yellow text-black border-black',
    purple: 'bg-brutal-purple text-black border-black',
    orange: 'bg-brutal-orange text-black border-black',
    green: 'bg-brutal-green text-black border-black',
    coral: 'bg-brutal-coral text-black border-black',
    cream: 'bg-brutal-cream text-black border-black',
    white: 'bg-brutal-white text-black border-black',
  };

  const selectedHighlightColor = colorClasses[highlightColor] || colorClasses.yellow;

  return (
    <div className={`flex flex-wrap items-center gap-y-3 gap-x-4 ${className}`}>
      {/* Grouping calculations */}
      {Array.from({ length: Math.ceil(bits.length / groupSize) }).map((_, groupIdx) => {
        const startIndex = groupIdx * groupSize;
        const groupBits = bits.slice(startIndex, startIndex + groupSize);

        return (
          <div key={groupIdx} className="flex items-center gap-1 select-none">
            {groupBits.map((bit, localIdx) => {
              const globalIdx = startIndex + localIdx;
              const isHighlighted = highlightIndices.includes(globalIdx);
              const isDimmed = dimIndices.includes(globalIdx);
              const originalBitNum = bitIndices ? bitIndices[globalIdx] : null;

              let bitClass = 'bg-brutal-white text-black';
              
              if (isHighlighted) {
                bitClass = selectedHighlightColor;
              } else if (isDimmed) {
                bitClass = 'bg-brutal-surface text-black/30 border-black/30';
              }

              return (
                <div
                  key={globalIdx}
                  onMouseEnter={() => onBitHover && onBitHover(globalIdx)}
                  onMouseLeave={() => onBitHover && onBitHover(null)}
                  className={`
                    bit-box text-sm font-mono relative group transition-all duration-75
                    ${bitClass}
                    hover:scale-110 hover:-translate-y-0.5 hover:shadow-brutal-sm hover:z-20 cursor-crosshair
                    ${isHighlighted ? 'scale-105 z-10' : ''}
                  `}
                >
                  {bit}
                  
                  {/* Floating tooltip/label for bit index */}
                  {originalBitNum !== null && (
                    <span className="
                      absolute -bottom-6 left-1/2 -translate-x-1/2 
                      text-[8px] font-mono font-black bg-black text-white px-1 border border-black z-30
                      opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap
                    ">
                      #{originalBitNum}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default BinaryGrid;
