/**
 * ResultPanel.jsx — Displays final encryption/decryption output with copy button
 * Author: Imam Rizki Saputra (NIM 301230013)
 */

import { useState } from 'react';
import useSimulatorStore from '../../store/simulatorStore';

export default function ResultPanel() {
  const { hasResult, resultHex, mode, inputHex, keyHex } = useSimulatorStore();
  const [copied, setCopied] = useState(false);

  if (!hasResult || !resultHex) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultHex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = resultHex;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isEncrypt = mode === 'encrypt';
  const colorBase = isEncrypt ? 'emerald' : 'sky';

  // Format hex into groups of 2 for readability
  const formatted = resultHex.match(/.{2}/g)?.join(' ').toUpperCase() ?? resultHex.toUpperCase();

  return (
    <div className={`rounded-2xl border-2 p-5 space-y-4 
      ${isEncrypt
        ? 'bg-emerald-500/5 border-emerald-500/30'
        : 'bg-sky-500/5 border-sky-500/30'
      }
      opacity-0 animate-slideUp`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center
            ${isEncrypt ? 'bg-emerald-500/15' : 'bg-sky-500/15'}`}>
            <span className={`material-symbols-outlined text-xl
              ${isEncrypt ? 'text-emerald-500' : 'text-sky-500'}`}>
              {isEncrypt ? 'lock' : 'lock_open'}
            </span>
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-on-surface">
              Hasil {isEncrypt ? 'Enkripsi' : 'Dekripsi'}
            </h3>
            <p className="text-[11px] text-on-surface-variant font-mono">
              {isEncrypt ? 'Ciphertext' : 'Plaintext'} · 128-bit · {resultHex.length / 2} byte
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          title="Salin ke clipboard"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
            transition-all duration-200 border
            ${copied
              ? 'bg-emerald-500 text-white border-emerald-500'
              : `border-outline-variant text-on-surface-variant 
                 hover:bg-surface-container-high hover:text-on-surface`
            }`}
        >
          <span className="material-symbols-outlined text-base">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Tersalin!' : 'Salin'}
        </button>
      </div>

      {/* Hex Output */}
      <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant">
        <p className="font-mono text-sm font-bold text-on-surface tracking-wider break-all leading-relaxed">
          {formatted}
        </p>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div className="bg-surface-container rounded-xl p-3 border border-outline-variant">
          <p className="text-on-surface-variant mb-0.5 uppercase tracking-wide font-semibold">Input</p>
          <p className="font-mono text-on-surface truncate">{inputHex.toUpperCase()}</p>
        </div>
        <div className="bg-surface-container rounded-xl p-3 border border-outline-variant">
          <p className="text-on-surface-variant mb-0.5 uppercase tracking-wide font-semibold">Kunci</p>
          <p className="font-mono text-on-surface truncate">{keyHex.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
