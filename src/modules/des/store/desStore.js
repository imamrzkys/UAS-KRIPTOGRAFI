import { create } from 'zustand';
import { runDES } from '../services/desAlgorithm.js';
import { validateHex64, validateBin64, hexToBin, binToHex } from '../services/binaryUtils.js';

const DEFAULT_PLAINTEXT = '0123456789ABCDEF';
const DEFAULT_KEY = '133457799BBCDFF1';

export const useDESStore = create((set, get) => ({
  plaintext: '',
  key: '',
  mode: 'encrypt', // 'encrypt' | 'decrypt'
  plaintextFormat: 'hex', // 'hex' | 'bin'
  keyFormat: 'hex', // 'hex' | 'bin'
  
  result: null, // Detailed trace log from runDES
  currentRound: 1, // Currently viewed Feistel round (1-16)
  isAutoplay: false,
  autoplaySpeed: 1200, // ms
  
  isSimulating: false,
  pendingResult: null,

  validationErrors: {
    plaintext: null,
    key: null,
  },

  // Actions
  setPlaintext: (val) => {
    // Auto uppercase for hex
    const format = get().plaintextFormat;
    let cleanVal = val;
    if (format === 'hex') {
      cleanVal = val.toUpperCase().replace(/[^0-9A-FA-F]/g, '');
    } else {
      cleanVal = val.replace(/[^01]/g, '');
    }

    set({ plaintext: cleanVal });
    get().validateInputs();
  },

  setKey: (val) => {
    // Auto uppercase for hex
    const format = get().keyFormat;
    let cleanVal = val;
    if (format === 'hex') {
      cleanVal = val.toUpperCase().replace(/[^0-9A-FA-F]/g, '');
    } else {
      cleanVal = val.replace(/[^01]/g, '');
    }

    set({ key: cleanVal });
    get().validateInputs();
  },

  setMode: (mode) => {
    set({ mode });
    if (get().result) {
      get().runSimulation();
    }
  },

  togglePlaintextFormat: () => {
    const currentFormat = get().plaintextFormat;
    const currentVal = get().plaintext;
    const errors = get().validationErrors;

    let newVal = '';
    let newFormat = 'hex';

    if (currentFormat === 'hex') {
      newFormat = 'bin';
      // If hex was valid, convert to bin. Otherwise, default bin.
      if (validateHex64(currentVal)) {
        newVal = hexToBin(currentVal);
      } else {
        newVal = '0'.repeat(64);
      }
    } else {
      newFormat = 'hex';
      // If bin was valid, convert to hex. Otherwise, default hex.
      if (validateBin64(currentVal)) {
        newVal = binToHex(currentVal);
      } else {
        newVal = '0'.repeat(16);
      }
    }

    set({ 
      plaintextFormat: newFormat, 
      plaintext: newVal,
      validationErrors: { ...errors, plaintext: null }
    });
    get().validateInputs();
  },

  toggleKeyFormat: () => {
    const currentFormat = get().keyFormat;
    const currentVal = get().key;
    const errors = get().validationErrors;

    let newVal = '';
    let newFormat = 'hex';

    if (currentFormat === 'hex') {
      newFormat = 'bin';
      if (validateHex64(currentVal)) {
        newVal = hexToBin(currentVal);
      } else {
        newVal = '0'.repeat(64);
      }
    } else {
      newFormat = 'hex';
      if (validateBin64(currentVal)) {
        newVal = binToHex(currentVal);
      } else {
        newVal = '0'.repeat(16);
      }
    }

    set({ 
      keyFormat: newFormat, 
      key: newVal,
      validationErrors: { ...errors, key: null }
    });
    get().validateInputs();
  },

  validateInputs: () => {
    const { plaintext, key, plaintextFormat, keyFormat } = get();
    const errors = { plaintext: null, key: null };

    // Validate Plaintext
    if (plaintextFormat === 'hex') {
      if (plaintext.length === 0) {
        errors.plaintext = 'Plaintext wajib diisi';
      } else if (plaintext.length < 16) {
        errors.plaintext = `Plaintext terlalu pendek (${plaintext.length}/16 karakter hex)`;
      } else if (plaintext.length > 16) {
        errors.plaintext = `Plaintext terlalu panjang (${plaintext.length}/16 karakter hex)`;
      } else if (!validateHex64(plaintext)) {
        errors.plaintext = 'Plaintext hanya boleh berisi karakter Hex (0-9, A-F)';
      }
    } else {
      if (plaintext.length === 0) {
        errors.plaintext = 'Plaintext wajib diisi';
      } else if (plaintext.length < 64) {
        errors.plaintext = `Plaintext terlalu pendek (${plaintext.length}/64 bit)`;
      } else if (plaintext.length > 64) {
        errors.plaintext = `Plaintext terlalu panjang (${plaintext.length}/64 bit)`;
      } else if (!validateBin64(plaintext)) {
        errors.plaintext = 'Plaintext hanya boleh berisi angka biner (0 atau 1)';
      }
    }

    // Validate Key
    if (keyFormat === 'hex') {
      if (key.length === 0) {
        errors.key = 'Kunci wajib diisi';
      } else if (key.length < 16) {
        errors.key = `Kunci terlalu pendek (${key.length}/16 karakter hex)`;
      } else if (key.length > 16) {
        errors.key = `Kunci terlalu panjang (${key.length}/16 karakter hex)`;
      } else if (!validateHex64(key)) {
        errors.key = 'Kunci hanya boleh berisi karakter Hex (0-9, A-F)';
      }
    } else {
      if (key.length === 0) {
        errors.key = 'Kunci wajib diisi';
      } else if (key.length < 64) {
        errors.key = `Kunci terlalu pendek (${key.length}/64 bit)`;
      } else if (key.length > 64) {
        errors.key = `Kunci terlalu panjang (${key.length}/64 bit)`;
      } else if (!validateBin64(key)) {
        errors.key = 'Kunci hanya boleh berisi angka biner (0 atau 1)';
      }
    }

    set({ validationErrors: errors });
    return !errors.plaintext && !errors.key;
  },

  runSimulation: () => {
    const isValid = get().validateInputs();
    if (!isValid) return false;

    const { plaintext, key, mode, plaintextFormat, keyFormat } = get();
    
    try {
      const result = runDES(
        plaintext,
        key,
        mode,
        plaintextFormat === 'bin',
        keyFormat === 'bin'
      );
      set({ pendingResult: result, isSimulating: true });
      return true;
    } catch (error) {
      console.error(error);
      set({ isSimulating: false });
      return false;
    }
  },

  commitSimulationResult: () => {
    const { pendingResult } = get();
    if (pendingResult) {
      set({ 
        result: pendingResult, 
        pendingResult: null, 
        isSimulating: false, 
        currentRound: 1 
      });
    } else {
      set({ isSimulating: false });
    }
  },

  reset: () => {
    set({
      plaintext: '',
      key: '',
      mode: 'encrypt',
      plaintextFormat: 'hex',
      keyFormat: 'hex',
      result: null,
      currentRound: 1,
      isAutoplay: false,
      isSimulating: false,
      pendingResult: null,
      validationErrors: { plaintext: null, key: null }
    });
  },

  reEncrypt: () => {
    const result = get().result;
    if (!result) return;
    const finalHex = result.ciphertextHex;
    set({
      plaintext: finalHex,
      plaintextFormat: 'hex',
      mode: 'encrypt',
    });
    get().runSimulation();
  },

  setCurrentRound: (round) => {
    if (round < 1) round = 1;
    if (round > 16) round = 16;
    set({ currentRound: round });
  },

  setIsAutoplay: (isAutoplay) => {
    set({ isAutoplay });
  },

  setAutoplaySpeed: (speed) => {
    set({ autoplaySpeed: speed });
  }
}));
