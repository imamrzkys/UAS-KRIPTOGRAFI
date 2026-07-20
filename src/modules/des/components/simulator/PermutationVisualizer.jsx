import React, { useState } from 'react';

/**
 * Interactive Permutation Grid Visualizer
 * Shows how bits are mapped from input indexes to output indexes based on the matrix.
 */
export function PermutationVisualizer({
  title,
  table,
  inputBin,
  outputBin,
  colorTheme = 'purple'
}) {
  const [hoveredOutIdx, setHoveredOutIdx] = useState(null); // 0-based output index
  const [hoveredInIdx, setHoveredInIdx] = useState(null);   // 0-based input index

  if (!inputBin || !outputBin) return null;

  // Colors mapping
  const bgClasses = {
    purple: {
      active: 'bg-brutal-purple text-black font-black scale-105 border-black',
      dim: 'bg-brutal-white text-black/40 border-black/20',
      normal: 'bg-brutal-white text-black border-black',
      header: 'bg-brutal-purple/15 border-brutal-purple'
    },
    orange: {
      active: 'bg-brutal-orange text-black font-black scale-105 border-black',
      dim: 'bg-brutal-white text-black/40 border-black/20',
      normal: 'bg-brutal-white text-black border-black',
      header: 'bg-brutal-orange/15 border-brutal-orange'
    },
    green: {
      active: 'bg-brutal-green text-black font-black scale-105 border-black',
      dim: 'bg-brutal-white text-black/40 border-black/20',
      normal: 'bg-brutal-white text-black border-black',
      header: 'bg-brutal-green/15 border-brutal-green'
    },
    yellow: {
      active: 'bg-brutal-yellow text-black font-black scale-105 border-black',
      dim: 'bg-brutal-white text-black/40 border-black/20',
      normal: 'bg-brutal-white text-black border-black',
      header: 'bg-brutal-yellow/15 border-brutal-yellow'
    }
  };

  const theme = bgClasses[colorTheme] || bgClasses.purple;

  // When output cell is hovered:
  // It pulls bit from input index: `table[outIdx] - 1`
  const getSourceIdx = (outIdx) => {
    if (outIdx === null) return null;
    return table[outIdx] - 1;
  };

  // When input cell is hovered:
  // Find which output cell(s) pull from it.
  const getTargetIdx = (inIdx) => {
    if (inIdx === null) return null;
    return table.indexOf(inIdx + 1);
  };

  const activeInputHighlight = hoveredOutIdx !== null ? getSourceIdx(hoveredOutIdx) : hoveredInIdx;
  const activeOutputHighlight = hoveredInIdx !== null ? getTargetIdx(hoveredInIdx) : hoveredOutIdx;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* INPUT GRID CARD */}
      <div className="border-3 border-black p-5 bg-brutal-white shadow-brutal-sm flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
          <span className="font-grotesk font-black text-sm uppercase">INPUT BLOCK (64 BITS)</span>
          {activeInputHighlight !== null && (
            <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 animate-pulse">
              BIT #{activeInputHighlight + 1} SELECTED
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-8 gap-1 mx-auto select-none">
          {inputBin.split('').map((bit, idx) => {
            const isTarget = activeInputHighlight === idx;
            const isDimmed = activeInputHighlight !== null && !isTarget;
            
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredInIdx(idx)}
                onMouseLeave={() => setHoveredInIdx(null)}
                className={`
                  w-9 h-9 border-2 flex flex-col items-center justify-center font-mono relative transition-all duration-75 cursor-crosshair
                  ${isTarget ? theme.active : isDimmed ? theme.dim : theme.normal}
                `}
                style={{ borderRadius: '0px' }}
              >
                <span className="text-sm font-bold">{bit}</span>
                <span className="absolute bottom-0.5 right-1 text-[7px] opacity-40 font-bold leading-none">{idx + 1}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] font-mono text-black/40 mt-3 text-center uppercase">
          Hover over cells to trace bit pathways
        </p>
      </div>

      {/* OUTPUT GRID CARD */}
      <div className="border-3 border-black p-5 bg-brutal-white shadow-brutal-sm flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
          <span className="font-grotesk font-black text-sm uppercase">PERMUTED OUTPUT (64 BITS)</span>
          {activeOutputHighlight !== null && (
            <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5 animate-pulse">
              PULLED FROM INPUT BIT #{table[activeOutputHighlight]}
            </span>
          )}
        </div>

        <div className="grid grid-cols-8 gap-1 mx-auto select-none">
          {outputBin.split('').map((bit, idx) => {
            const isTarget = activeOutputHighlight === idx;
            const isDimmed = activeOutputHighlight !== null && !isTarget;
            const sourceBitNum = table[idx];

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredOutIdx(idx)}
                onMouseLeave={() => setHoveredOutIdx(null)}
                className={`
                  w-9 h-9 border-2 flex flex-col items-center justify-center font-mono relative transition-all duration-75 cursor-crosshair
                  ${isTarget ? theme.active : isDimmed ? theme.dim : theme.normal}
                `}
                style={{ borderRadius: '0px' }}
              >
                <span className="text-sm font-bold">{bit}</span>
                <span className="absolute bottom-0.5 right-1 text-[7px] opacity-40 font-bold leading-none">{sourceBitNum}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] font-mono text-black/40 mt-3 text-center uppercase">
          Numbers show original 64-bit input index
        </p>
      </div>
    </div>
  );
}

export default PermutationVisualizer;
