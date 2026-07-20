import React from 'react';
import { Play, RotateCcw, ShieldAlert, Download } from 'lucide-react';
import { useDESStore } from '../../store/desStore.js';
import { NeoButton } from '../common/NeoButton.jsx';

/**
 * Neubrutalist Action Controls footer bar (Mobile sticky + Desktop inline)
 */
export function FooterActions() {
  const { runSimulation, reset, reEncrypt, result } = useDESStore();

  const handleExportJSON = () => {
    if (!result) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `des_simulation_${result.mode}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportTXT = () => {
    if (!result) return;
    
    let text = `DES SIMULATOR RUN SUMMARY\n`;
    text += `==========================================\n`;
    text += `Mode: ${result.mode.toUpperCase()}\n`;
    text += `Input (Bin):  ${result.plaintextBin}\n`;
    text += `Key (Bin):    ${result.keyBin}\n`;
    text += `Output (Bin): ${result.ciphertextBin}\n`;
    text += `Output (Hex): ${result.ciphertextHex}\n\n`;
    
    text += `16 FEISTEL ROUND DETAIL TRACE\n`;
    text += `==========================================\n`;
    result.rounds.forEach((r) => {
      text += `ROUND ${r.round.toString().padStart(2, '0')} (Subkey K${r.subkeyIndex})\n`;
      text += `  L_prev:      ${r.L_prev}\n`;
      text += `  R_prev:      ${r.R_prev}\n`;
      text += `  Subkey:      ${r.subkey}\n`;
      text += `  Expanded R:  ${r.expandedR}\n`;
      text += `  XOR Result:  ${r.xorResult}\n`;
      text += `  Sbox Output: ${r.sboxOutput}\n`;
      text += `  P Output:    ${r.pOutput}\n`;
      text += `  New L:       ${r.L}\n`;
      text += `  New R:       ${r.R}\n`;
      text += `------------------------------------------\n`;
    });

    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `des_simulation_${result.mode}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <>
      {/* Mobile Sticky Bottom Bar - ONLY visible on mobile (< md) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-brutal-yellow border-t-4 border-black px-2 py-2 sm:px-4 sm:py-3 flex items-center justify-around gap-1 sm:gap-2 shadow-[0_-4px_0_#000]">
        <button
          onClick={runSimulation}
          className="flex flex-col items-center justify-center bg-black text-brutal-yellow border-3 border-black py-1 px-1 sm:px-2 flex-1 max-w-[80px] sm:max-w-[100px] active:translate-x-[2px] active:translate-y-[2px]"
        >
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3px]" />
          <span className="font-grotesk font-black text-[8px] sm:text-[9px] uppercase tracking-wider mt-0.5">MULAI</span>
        </button>

        <button
          onClick={reset}
          className="flex flex-col items-center justify-center bg-brutal-white text-black border-3 border-black py-1 px-1 sm:px-2 flex-1 max-w-[80px] sm:max-w-[100px] active:translate-x-[2px] active:translate-y-[2px]"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3px]" />
          <span className="font-grotesk font-black text-[8px] sm:text-[9px] uppercase tracking-wider mt-0.5">ULANG</span>
        </button>

        <button
          onClick={reEncrypt}
          disabled={!result}
          className="flex flex-col items-center justify-center bg-brutal-purple text-black border-3 border-black py-1 px-1 sm:px-2 flex-1 max-w-[105px] sm:max-w-[120px] disabled:opacity-40 active:translate-x-[2px] active:translate-y-[2px]"
        >
          <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3px]" />
          <span className="font-grotesk font-black text-[8px] sm:text-[9px] uppercase tracking-wider mt-0.5">RE-ENKRIPSI</span>
        </button>

        <button
          onClick={handleExportTXT}
          disabled={!result}
          className="flex flex-col items-center justify-center bg-brutal-orange text-black border-3 border-black py-1 px-1 sm:px-2 flex-1 max-w-[80px] sm:max-w-[100px] disabled:opacity-40 active:translate-x-[2px] active:translate-y-[2px]"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3px]" />
          <span className="font-grotesk font-black text-[8px] sm:text-[9px] uppercase tracking-wider mt-0.5">EKSPOR</span>
        </button>
      </div>

      {/* Desktop Action Bar - ONLY visible on desktop (>= md), inline at the bottom of configurations */}
      <div className="hidden md:flex flex-wrap items-center gap-4 bg-brutal-surface p-4 border-3 border-black shadow-brutal-sm">
        <NeoButton variant="yellow" onClick={runSimulation} className="flex-1 min-w-[120px]">
          <Play className="w-4 h-4 stroke-[3px]" />
          Jalankan Simulasi
        </NeoButton>
        <NeoButton variant="white" onClick={reset} className="flex-1 min-w-[100px]">
          <RotateCcw className="w-4 h-4 stroke-[3px]" />
          Reset / Ulangi
        </NeoButton>
        <NeoButton variant="purple" onClick={reEncrypt} disabled={!result} className="flex-1 min-w-[120px]">
          <ShieldAlert className="w-4 h-4 stroke-[3px]" />
          Enkripsi Ulang Output
        </NeoButton>

        {result && (
          <div className="flex gap-2 w-full lg:w-auto mt-2 lg:mt-0">
            <NeoButton variant="orange" onClick={handleExportTXT} className="flex-1 text-xs">
              <Download className="w-3.5 h-3.5 stroke-[3px]" />
              EKSPOR TXT
            </NeoButton>
            <NeoButton variant="cream" onClick={handleExportJSON} className="flex-1 text-xs">
              <Download className="w-3.5 h-3.5 stroke-[3px]" />
              EKSPOR JSON
            </NeoButton>
          </div>
        )}
      </div>
    </>
  );
}

export default FooterActions;
