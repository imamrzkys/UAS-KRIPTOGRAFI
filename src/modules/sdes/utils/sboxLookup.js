/**
 * S-Box Lookup Tables for S-DES
 */

// S0 Box: 4x4 matrix
export const S0 = [
  [1, 0, 3, 2],
  [3, 2, 1, 0],
  [0, 2, 1, 3],
  [3, 1, 3, 2]
];

// S1 Box: 4x4 matrix
export const S1 = [
  [0, 1, 2, 3],
  [2, 0, 1, 3],
  [3, 0, 1, 0],
  [2, 1, 0, 3]
];

/**
 * Look up a value in an S-Box
 * @param {number[][]} sbox - The S-box matrix (S0 or S1)
 * @param {number[]} bits - 4-bit input [b0, b1, b2, b3]
 * @returns {{ row: number, col: number, value: number, output: number[] }}
 */
export function sboxLookup(sbox, bits) {
  // Row is determined by bits 0 and 3 (first and last)
  const row = (bits[0] << 1) | bits[3];
  // Column is determined by bits 1 and 2 (middle two)
  const col = (bits[1] << 1) | bits[2];
  const value = sbox[row][col];
  // Convert value to 2-bit array
  const output = [(value >> 1) & 1, value & 1];
  return { row, col, value, output };
}
