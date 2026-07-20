/**
 * ConfigPanel.jsx — Input configuration for AES-128 simulator (Animated with Framer Motion)
 * Author: Imam Rizki Saputra (NIM 301230013)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSimulatorStore from '../../store/simulatorStore';

// Convert ASCII text (max 16 chars) → hex string (padded to 32 chars)
function textToHex(text) {
  const bytes = Array.from(text.slice(0, 16)).map((c) => c.charCodeAt(0));
  while (bytes.length < 16) bytes.push(0x00); // zero-pad
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function ConfigPanel() {
  const {
    runEncrypt,
    runDecrypt,
    reset,
    parseHexString,
    setInputText,
    setCipherKey,
    setInputHex,
    setKeyHex,
    inputHex: storeInputHex,
    keyHex:   storeKeyHex,
    isRunning,
  } = useSimulatorStore();

  const [localInputHex, setLocalInputHex] = useState(storeInputHex || '00112233445566778899aabbccddeeff');
  const [localKeyHex,   setLocalKeyHex]   = useState(storeKeyHex   || '000102030405060708090a0b0c0d0e0f');
  const [activeMode,    setActiveMode]     = useState('encrypt');
  const [inputType,     setInputType]      = useState('hex');
  const [localInputText, setLocalInputText] = useState('');

  const effectiveInputHex = inputType === 'text'
    ? textToHex(localInputText)
    : localInputHex;

  const isInputValid = inputType === 'text'
    ? localInputText.length > 0 && localInputText.length <= 16
    : localInputHex.replace(/[^0-9a-fA-F]/g, '').length === 32;

  const isKeyValid   = localKeyHex.replace(/[^0-9a-fA-F]/g, '').length === 32;
  const canRun       = isInputValid && isKeyValid && !isRunning;

  const handleRun = (modeOverride) => {
    const m = modeOverride ?? activeMode;
    const hexToSend = effectiveInputHex;
    const inputBytes = parseHexString(hexToSend);
    const keyBytes   = parseHexString(localKeyHex);
    setInputText(inputBytes);
    setCipherKey(keyBytes);
    setInputHex(hexToSend);
    setKeyHex(localKeyHex);
    if (m === 'encrypt') {
      runEncrypt();
    } else {
      runDecrypt();
    }
  };

  const handleReset = () => {
    reset();
    setLocalInputHex('00112233445566778899aabbccddeeff');
    setLocalKeyHex('000102030405060708090a0b0c0d0e0f');
    setLocalInputText('');
    setInputType('hex');
  };

  const loadFIPS = () => {
    setLocalInputHex('00112233445566778899aabbccddeeff');
    setLocalKeyHex('000102030405060708090a0b0c0d0e0f');
    setInputType('hex');
    setLocalInputText('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-surface-container rounded-2xl p-6 border border-outline-variant space-y-5"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-primary text-xl">settings</span>
          <h2 className="font-display text-xl font-semibold text-on-surface">Konfigurasi</h2>
        </div>
        <p className="text-xs text-on-surface-variant">
          Masukkan input 128-bit (16 byte) dan kunci rahasia 128-bit
        </p>
      </div>

      {/* Mode toggle: Encrypt / Decrypt */}
      <div className="flex rounded-xl overflow-hidden border-2 border-outline-variant relative bg-surface-container-low">
        {['encrypt', 'decrypt'].map((m) => (
          <button
            key={m}
            onClick={() => setActiveMode(m)}
            className="flex-1 py-2.5 text-sm font-semibold capitalize relative transition-colors duration-200 flex items-center justify-center gap-2 z-10"
          >
            {activeMode === m && (
              <motion.span
                layoutId="active-config-mode"
                className="absolute inset-0 bg-primary z-0"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            <span className={`material-symbols-outlined text-lg relative z-10 transition-colors duration-200 ${activeMode === m ? 'text-on-primary' : 'text-on-surface-variant'}`}>
              {m === 'encrypt' ? 'lock' : 'lock_open'}
            </span>
            <span className={`relative z-10 transition-colors duration-200 ${activeMode === m ? 'text-on-primary' : 'text-on-surface-variant'}`}>
              {m === 'encrypt' ? 'Enkripsi' : 'Dekripsi'}
            </span>
          </button>
        ))}
      </div>

      {/* Input fields */}
      <div className="space-y-4">

        {/* Plaintext / Ciphertext input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-on-surface">
              <span className="material-symbols-outlined text-base text-on-surface-variant">description</span>
              {activeMode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
            </label>
            
            {activeMode === 'encrypt' && (
              <div className="flex rounded-lg overflow-hidden border border-outline-variant text-[11px] font-bold bg-surface-container-low relative">
                {['text', 'hex'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setInputType(type)}
                    className="px-2.5 py-1 relative z-10 transition-colors duration-200"
                  >
                    {inputType === type && (
                      <motion.span
                        layoutId="active-input-type"
                        className="absolute inset-0 bg-secondary z-0"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 uppercase ${inputType === type ? 'text-on-secondary' : 'text-on-surface-variant'}`}>
                      {type === 'text' ? 'TEKS' : 'HEX'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {inputType === 'text' ? (
              <motion.div
                key="text-input"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                <input
                  type="text"
                  value={localInputText}
                  onChange={(e) => setLocalInputText(e.target.value.slice(0, 16))}
                  className="w-full px-4 py-3 bg-surface-container-low border-2 border-outline-variant
                             rounded-xl text-sm text-on-surface
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             placeholder:text-on-surface-variant transition-all"
                  placeholder="Ketik teks (maks. 16 karakter)"
                  maxLength={16}
                />
                <div className="flex items-center justify-between mt-1 px-1">
                  <span className={`text-xs ${isInputValid ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {localInputText.length}/16 karakter
                  </span>
                  {localInputText.length > 0 && (
                    <span className="text-[10px] sm:text-xs font-mono text-on-surface-variant/70 truncate max-w-[60%]">
                      hex: {textToHex(localInputText)}
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="hex-input"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
              >
                <input
                  type="text"
                  value={localInputHex}
                  onChange={(e) => setLocalInputHex(e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 32))}
                  className="w-full px-4 py-3 bg-surface-container-low border-2 border-outline-variant
                             rounded-xl font-mono text-sm text-on-surface
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             placeholder:text-on-surface-variant transition-all"
                  placeholder="00112233445566778899aabbccddeeff"
                  maxLength={32}
                  spellCheck={false}
                />
                <div className="flex items-center justify-between mt-1 px-1">
                  <span className={`text-xs ${isInputValid ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {localInputHex.replace(/[^0-9a-fA-F]/g, '').length}/32 karakter
                  </span>
                  {isInputValid && (
                    <span className="text-xs text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                      Valid
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Key input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-on-surface mb-2">
            <span className="material-symbols-outlined text-base text-on-surface-variant">key</span>
            Kunci Rahasia — Hex 32 karakter
          </label>
          <input
            type="text"
            value={localKeyHex}
            onChange={(e) => setLocalKeyHex(e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 32))}
            className="w-full px-4 py-3 bg-surface-container-low border-2 border-outline-variant
                       rounded-xl font-mono text-sm text-on-surface
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                       placeholder:text-on-surface-variant transition-all"
            placeholder="000102030405060708090a0b0c0d0e0f"
            maxLength={32}
            spellCheck={false}
          />
          <div className="flex items-center justify-between mt-1 px-1">
            <span className={`text-xs ${isKeyValid ? 'text-primary' : 'text-on-surface-variant'}`}>
              {localKeyHex.replace(/[^0-9a-fA-F]/g, '').length}/32 karakter
            </span>
            {isKeyValid && (
              <span className="text-xs text-primary flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                Valid
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick-load FIPS vector */}
      <button
        onClick={loadFIPS}
        className="w-full py-2 text-xs text-on-surface-variant border border-outline-variant
                   rounded-xl hover:bg-surface-container-high transition-colors
                   flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-sm">science</span>
        Muat Test Vector FIPS-197
      </button>

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <motion.button
          onClick={() => handleRun(activeMode)}
          disabled={!canRun}
          whileHover={canRun ? { scale: 1.02 } : {}}
          whileTap={canRun ? { scale: 0.98 } : {}}
          className={`
            flex-1 px-5 py-3.5 rounded-xl font-medium text-sm
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            shadow-lg flex items-center justify-center gap-2 transition-all
            ${canRun
              ? 'bg-primary text-on-primary hover:opacity-90 hover:shadow-xl'
              : 'bg-surface-container-low text-on-surface-variant cursor-not-allowed'
            }
          `}
        >
          {isRunning ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              Memproses…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">
                {activeMode === 'encrypt' ? 'lock' : 'lock_open'}
              </span>
              {activeMode === 'encrypt' ? 'ENKRIPSI' : 'DEKRIPSI'}
            </>
          )}
        </motion.button>

        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-3.5 border-2 border-outline text-on-surface rounded-xl
                     font-medium text-sm hover:bg-surface-container-high transition-all
                     focus:outline-none focus:ring-2 focus:ring-outline focus:ring-offset-2
                     flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Reset
        </motion.button>
      </div>
    </motion.div>
  );
}
