/**
 * Convert a hexadecimal string to a binary string.
 * Each hex character maps to a 4-bit binary representation.
 */
export function hexToBin(hex) {
  return hex.split('').map(char => {
    const dec = parseInt(char, 16);
    return dec.toString(2).padStart(4, '0');
  }).join('');
}

/**
 * Convert a binary string to a hexadecimal string.
 * Each group of 4 bits maps to a hex character.
 */
export function binToHex(bin) {
  let hex = '';
  for (let i = 0; i < bin.length; i += 4) {
    const chunk = bin.slice(i, i + 4);
    const dec = parseInt(chunk, 2);
    hex += dec.toString(16).toUpperCase();
  }
  return hex;
}

/**
 * Validates whether a string is a valid 64-bit hexadecimal string.
 * Exactly 16 characters, containing only 0-9, A-F, a-f.
 */
export function validateHex64(hex) {
  const clean = hex.replace(/\s+/g, '');
  if (clean.length !== 16) return false;
  return /^[0-9A-Fa-f]{16}$/.test(clean);
}

/**
 * Validates whether a string is a valid 64-bit binary string.
 * Exactly 64 characters, containing only 0 and 1.
 */
export function validateBin64(bin) {
  const clean = bin.replace(/\s+/g, '');
  if (clean.length !== 64) return false;
  return /^[01]{64}$/.test(clean);
}

/**
 * Formats a binary string into groups of N bits separated by spaces.
 * Default grouping is 4 bits.
 */
export function formatBin(bin, groupSize = 4) {
  const regex = new RegExp(`.{1,${groupSize}}`, 'g');
  return bin.match(regex)?.join(' ') || bin;
}

/**
 * Per-bit XOR of two binary strings of the same length.
 */
export function xor(binA, binB) {
  let result = '';
  for (let i = 0; i < binA.length; i++) {
    result += binA[i] === binB[i] ? '0' : '1';
  }
  return result;
}

/**
 * Left cyclic shift (rotation) of a binary string by a shift amount.
 */
export function shiftLeft(bin, shiftAmount) {
  const shifts = shiftAmount % bin.length;
  return bin.slice(shifts) + bin.slice(0, shifts);
}

/**
 * General permutation function.
 * Matches 1-indexed tables.
 */
export function permute(inputBin, table) {
  return table.map(pos => inputBin[pos - 1]).join('');
}

/**
 * Formats a key hex with standard DES parity layout,
 * adding spaces every 2 hex characters.
 */
export function formatHexSpacing(hex) {
  const clean = hex.replace(/\s+/g, '').toUpperCase();
  return clean.match(/.{1,2}/g)?.join(' ') || clean;
}
