import { permute, shiftLeft, binToHex } from './binaryUtils.js';
import { PC1, PC2, SHIFT_SCHEDULE } from './permutation.js';

/**
 * Generates 16 subkeys for DES with a step-by-step trace log.
 * @param {string} key64Bin - 64-bit key binary string
 * @returns {object} - { subkeys: Array(16), PC1_C0, PC1_D0, steps: Array(16) }
 */
export function generateSubkeys(key64Bin) {
  if (key64Bin.length !== 64) {
    throw new Error('Key must be exactly 64 bits binary');
  }

  // Permute key with PC-1
  const key56Bin = permute(key64Bin, PC1);
  const C0 = key56Bin.slice(0, 28);
  const D0 = key56Bin.slice(28, 56);

  const steps = [];
  const subkeys = [];

  let C = C0;
  let D = D0;

  for (let round = 1; round <= 16; round++) {
    const shiftAmount = SHIFT_SCHEDULE[round - 1];
    
    const C_prev = C;
    const D_prev = D;

    // Shift registers
    C = shiftLeft(C, shiftAmount);
    D = shiftLeft(D, shiftAmount);

    // Combine C and D
    const combined = C + D;

    // Permute combined with PC-2 to get 48-bit subkey
    const subkey = permute(combined, PC2);
    subkeys.push(subkey);

    // Log step details
    steps.push({
      round,
      shiftAmount,
      C_prev,
      D_prev,
      C,
      D,
      K: subkey,
      K_hex: binToHex(subkey)
    });
  }

  return {
    PC1_C0: C0,
    PC1_D0: D0,
    subkeys,
    steps
  };
}
