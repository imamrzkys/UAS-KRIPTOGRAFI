/**
 * Formatting utilities for S-DES simulator display
 */

/**
 * Format a bit array as a spaced binary string
 * @param {number[]} bits - Bit array
 * @param {number} groupSize - Group size for spacing (default 4)
 * @returns {string} Formatted string like "1010 1010"
 */
export function bitArrayToString(bits, groupSize = 4) {
  if (!bits || bits.length === 0) return '';
  const groups = [];
  for (let i = 0; i < bits.length; i += groupSize) {
    groups.push(bits.slice(i, i + groupSize).join(''));
  }
  return groups.join(' ');
}

/**
 * Format a bit array as a plain string without spacing
 * @param {number[]} bits
 * @returns {string}
 */
export function bitArrayToPlain(bits) {
  return bits ? bits.join('') : '';
}

/**
 * Highlight specific positions in a bit string
 * @param {number[]} bits - Bit array
 * @param {number[]} positions - Positions to highlight (0-indexed)
 * @returns {Array<{value: number, highlighted: boolean}>}
 */
export function highlight(bits, positions = []) {
  return bits.map((value, index) => ({
    value,
    highlighted: positions.includes(index)
  }));
}

/**
 * Format a permutation table for display
 * @param {number[]} table - Permutation table
 * @returns {string}
 */
export function formatTable(table) {
  return table.join(', ');
}

/**
 * Format step number with leading zero
 * @param {number} step
 * @returns {string}
 */
export function formatStep(step) {
  return String(step).padStart(2, '0');
}
