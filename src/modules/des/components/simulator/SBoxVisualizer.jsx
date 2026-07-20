import React from 'react';
import { SBOXES } from '../../services/sbox.js';
import { motion } from 'framer-motion';

/**
 * Premium S-Box Substitution Visualizer component.
 * Renders all 8 S-Boxes with custom animations and precise row/column intersections.
 */
export function SBoxVisualizer({ sboxDetails }) {
  if (!sboxDetails || sboxDetails.length !== 8) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 font-mono text-xs">
      {sboxDetails.map((detail, idx) => {
        const boxNumber = idx + 1;
        const matrix = SBOXES[idx];
        const { input, row, col, decimalOutput, binaryOutput } = detail;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="border-3 border-black bg-brutal-white p-3 shadow-brutal-sm flex flex-col justify-between"
            style={{ borderRadius: '0px' }}
          >
            {/* Box title & details */}
            <div className="border-b-2 border-black pb-2 mb-3 bg-brutal-cream p-2 brutal-border">
              <div className="flex justify-between items-center font-grotesk font-black text-sm">
                <span>S-BOX {boxNumber}</span>
                <span className="bg-black text-brutal-yellow text-[9px] px-1.5 py-0.5 uppercase tracking-wide">
                  6-BIT ➔ 4-BIT
                </span>
              </div>
              <div className="text-[10px] mt-1.5 space-y-0.5 leading-none">
                <div className="flex justify-between">
                  <span>Input Chunk:</span>
                  <span className="font-extrabold text-brutal-coral">{input}</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>Row Bits (1&6):</span>
                  <span>
                    <strong className="text-brutal-purple">{input[0] + input[5]}</strong> ({row})
                  </span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>Col Bits (2-5):</span>
                  <span>
                    <strong className="text-brutal-orange">{input.slice(1, 5)}</strong> ({col})
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 border-t border-black/10 pt-1.5">
                  <span className="font-bold">Result Output:</span>
                  <span className="bg-brutal-green text-black font-extrabold px-1.5 py-0.5 font-mono border border-black shadow-brutal-sm text-[10px]">
                    {decimalOutput} ({binaryOutput})
                  </span>
                </div>
              </div>
            </div>

            {/* S-Box Matrix Grid */}
            <div className="overflow-x-auto w-full">
              <table className="table-fixed border-collapse mx-auto leading-none text-[8px] text-center w-full min-w-[220px]">
                <tbody>
                  {matrix.map((rowArr, rIdx) => {
                    const isRowSelected = row === rIdx;
                    
                    return (
                      <tr
                        key={rIdx}
                        className={isRowSelected ? 'bg-brutal-purple/20 font-bold border-y border-black/30' : ''}
                      >
                        {rowArr.map((val, cIdx) => {
                          const isColSelected = col === cIdx;
                          const isIntersection = isRowSelected && isColSelected;
                          
                          let cellClass = 'text-black/60 border border-black/10';
                          
                          if (isIntersection) {
                            cellClass = 'bg-brutal-green text-black font-black border-2 border-black scale-110 z-10 shadow-brutal-sm';
                          } else if (isColSelected) {
                            cellClass = 'bg-brutal-orange/15 text-black border-x border-black/20';
                          }

                          return (
                            <td
                              key={cIdx}
                              title={`Row ${rIdx}, Col ${cIdx}: ${val}`}
                              className={`p-1 select-none font-mono ${cellClass}`}
                            >
                              {val}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default SBoxVisualizer;
