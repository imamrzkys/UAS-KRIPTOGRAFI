/**
 * Bit Manipulation Utilities for S-DES
 */

/**
 * Convert a string of '0' and '1' to an array of integers
 * @param {string} str - Binary string like "10101010"
 * @returns {number[]} Array of 0s and 1s
 */
export function toBitArray(str) {
  return str.split('').map(Number);
}

/**
 * Convert an array of bits to a binary string
 * @param {number[]} bits - Array of 0s and 1s
 * @returns {string} Binary string
 */
export function fromBitArray(bits) {
  return bits.join('');
}

/**
 * Apply a permutation table to a bit array
 * @param {number[]} bits - Input bit array
 * @param {number[]} table - Permutation table (1-indexed)
 * @returns {number[]} Permuted bit array
 */
export function permute(bits, table) {
  return table.map(pos => bits[pos - 1]);
}

/**
 * XOR two bit arrays of equal length
 * @param {number[]} a - First bit array
 * @param {number[]} b - Second bit array
 * @returns {number[]} XOR result
 */
export function xor(a, b) {
  return a.map((bit, i) => bit ^ b[i]);
}

/**
 * Circular left shift of a bit array by n positions
 * @param {number[]} bits - Input bit array
 * @param {number} n - Number of positions to shift
 * @returns {number[]} Shifted bit array
 */
export function leftShift(bits, n) {
  const len = bits.length;
  const shift = n % len;
  return [...bits.slice(shift), ...bits.slice(0, shift)];
}

/**
 * Split a bit array into left and right halves
 * @param {number[]} bits - Input bit array
 * @returns {[number[], number[]]} [left, right]
 */
export function splitHalves(bits) {
  const mid = Math.floor(bits.length / 2);
  return [bits.slice(0, mid), bits.slice(mid)];
}

/**
 * Combine two bit arrays
 * @param {number[]} left - Left half
 * @param {number[]} right - Right half
 * @returns {number[]} Combined array
 */
export function combine(left, right) {
  return [...left, ...right];
}

/**
 * Convert a 2-bit array to a decimal number (row/col for S-box)
 * @param {number[]} bits - 2-bit array
 * @returns {number} Decimal value
 */
export function bitsToDecimal(bits) {
  return bits.reduce((acc, bit) => (acc << 1) | bit, 0);
}

/**
 * Convert a decimal number to a 2-bit array
 * @param {number} num - Decimal number (0-3)
 * @returns {number[]} 2-bit array
 */
export function decimalTo2Bits(num) {
  return [(num >> 1) & 1, num & 1];
}
