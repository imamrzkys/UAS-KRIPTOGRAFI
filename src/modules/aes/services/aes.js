/**
 * AES-128 Encryption and Decryption Service Layer
 * ─────────────────────────────────────────────────────────────────────────────
 * Author : Imam Rizki Saputra (NIM 301230013)
 *
 * IMPLEMENTATION STATUS:
 *   ✅  Module skeleton & onStep callback convention (agent — Fase 11)
 *   ✍️  gmul           → implement in galois.js first  (Fase 2)
 *   ✍️  subBytes       → implement here                (Fase 3)
 *   ✍️  invSubBytes    → implement here                (Fase 3)
 *   ✍️  shiftRows      → implement here                (Fase 4)
 *   ✍️  invShiftRows   → implement here                (Fase 4)
 *   ✍️  mixColumns     → implement here                (Fase 5)
 *   ✍️  invMixColumns  → implement here                (Fase 5)
 *   ✍️  addRoundKey    → implement here                (Fase 6)
 *   ✍️  keyExpansion   → implement here                (Fase 7)
 *   ✍️  encrypt        → wire everything together      (Fase 8)
 *   ✍️  decrypt        → wire everything together      (Fase 9)
 *
 * CALLING CONVENTION — onStep callback (Fase 11):
 *   encrypt(plaintext, key, onStep?)
 *   decrypt(ciphertext, key, onStep?)
 *
 *   onStep(label, stateMatrix) is called after EVERY individual operation.
 *   stateMatrix is a 4×4 array (row-major display, column-major storage).
 *
 *   Example labels you should emit from your own code:
 *     "Key Expansion — W[4] RotWord"
 *     "Initial Round — AddRoundKey"
 *     "Round 1 — SubBytes"
 *     "Round 1 — ShiftRows"
 *     "Round 1 — MixColumns"
 *     "Round 1 — AddRoundKey"
 *     ...
 *     "Round 10 — SubBytes"
 *     "Round 10 — ShiftRows"
 *     "Round 10 — AddRoundKey (Final)"
 *
 * STATE LAYOUT (column-major, matching slide Pertemuan 13 hal. 11):
 *   Flat index → (row, col):  index i → row = i%4, col = floor(i/4)
 *
 *   Byte 0 = row0,col0   Byte 4 = row0,col1   Byte  8 = row0,col2   Byte 12 = row0,col3
 *   Byte 1 = row1,col0   Byte 5 = row1,col1   Byte  9 = row1,col2   Byte 13 = row1,col3
 *   Byte 2 = row2,col0   Byte 6 = row2,col1   Byte 10 = row2,col2   Byte 14 = row2,col3
 *   Byte 3 = row3,col0   Byte 7 = row3,col1   Byte 11 = row3,col2   Byte 15 = row3,col3
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { SBOX, INV_SBOX } from './sbox.js';
import { RCON } from './rcon.js';
import { gmul } from './galois.js';

// ─── Utility: flat byte array ↔ 4×4 state matrix ────────────────────────────

/**
 * Convert a 16-byte flat array (column-major order) to a 4×4 matrix.
 * matrix[row][col]  where row = i%4, col = floor(i/4)
 * @param {number[]|Uint8Array} bytes - 16 bytes
 * @returns {number[][]} 4×4 matrix
 */
export function bytesToMatrix(bytes) {
  const m = Array.from({ length: 4 }, () => new Array(4).fill(0));
  for (let i = 0; i < 16; i++) {
    m[i % 4][Math.floor(i / 4)] = bytes[i];
  }
  return m;
}

/**
 * Convert a 4×4 matrix back to a 16-byte flat array (column-major order).
 * @param {number[][]} matrix - 4×4 matrix
 * @returns {number[]} 16 bytes
 */
export function matrixToBytes(matrix) {
  const bytes = new Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      bytes[col * 4 + row] = matrix[row][col];
    }
  }
  return bytes;
}

// ─────────────────────────────────────────────────────────────────────────────
//  AES CORE FUNCTIONS  — YOU implement the bodies (✍️)
//  Keep the signatures, JSDoc, and exports exactly as they are.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Expand the 128-bit key into 11 round keys (W[0..43], grouped into RK0..RK10).
 *
 * @param {number[]|Uint8Array} key - 16-byte cipher key
 * @returns {number[][]} Array of 11 round keys, each a 16-byte flat array
 *
 * Checkpoint: key = 2b7e151628aed2a6abf7158809cf4f3c
 *             → roundKeys[1].slice(0,4) hex must be "a0fafe17"
 */
export function keyExpansion(key, onStep) {
  const w = [];
  
  // First 4 words are from the cipher key
  for (let i = 0; i < 4; i++) {
    const word = [key[i * 4], key[i * 4 + 1], key[i * 4 + 2], key[i * 4 + 3]];
    w.push(word);
    onStep?.(`Key Expansion — W[${i}] Result`, [word, [0,0,0,0], [0,0,0,0], [0,0,0,0]]);
  }

  for (let i = 4; i < 44; i++) {
    let temp = [...w[i - 1]];
    if (i % 4 === 0) {
      // RotWord
      const rot = [temp[1], temp[2], temp[3], temp[0]];
      onStep?.(`Key Expansion — W[${i}] RotWord`, [rot, [0,0,0,0], [0,0,0,0], [0,0,0,0]]);
      
      // SubWord
      const sub = [SBOX[rot[0]], SBOX[rot[1]], SBOX[rot[2]], SBOX[rot[3]]];
      onStep?.(`Key Expansion — W[${i}] SubWord`, [sub, [0,0,0,0], [0,0,0,0], [0,0,0,0]]);
      
      // XOR Rcon
      const rconVal = RCON[i / 4];
      temp = [sub[0] ^ rconVal, sub[1], sub[2], sub[3]];
      onStep?.(`Key Expansion — W[${i}] XOR Rcon`, [temp, [0,0,0,0], [0,0,0,0], [0,0,0,0]]);
    }
    
    const resultWord = [
      w[i - 4][0] ^ temp[0],
      w[i - 4][1] ^ temp[1],
      w[i - 4][2] ^ temp[2],
      w[i - 4][3] ^ temp[3],
    ];
    w.push(resultWord);
    onStep?.(`Key Expansion — W[${i}] Result`, [resultWord, [0,0,0,0], [0,0,0,0], [0,0,0,0]]);
  }

  const roundKeys = [];
  for (let r = 0; r < 11; r++) {
    const flatKey = [];
    for (let c = 0; c < 4; c++) {
      flatKey.push(...w[r * 4 + c]);
    }
    roundKeys.push(flatKey);
  }
  return roundKeys;
}

/**
 * Apply the SubBytes transformation: substitute every byte via SBOX lookup.
 *
 * @param {number[][]} state - 4×4 state matrix (mutated in place AND returned)
 * @param {Function} [onStep] - optional callback: onStep(label, stateCopy)
 * @returns {number[][]} transformed state
 *
 * Checkpoint: SBOX[0x63] = 0xFB
 */
export function subBytes(state, onStep) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      state[r][c] = SBOX[state[r][c]];
    }
  }
  return state;
}

/**
 * Apply the inverse SubBytes transformation: substitute every byte via INV_SBOX.
 *
 * @param {number[][]} state - 4×4 state matrix
 * @param {Function} [onStep]
 * @returns {number[][]} transformed state
 */
export function invSubBytes(state, onStep) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      state[r][c] = INV_SBOX[state[r][c]];
    }
  }
  return state;
}

/**
 * Apply the ShiftRows transformation (cyclic left shift of rows).
 *
 * Row 0: no shift
 * Row 1: shift left 1
 * Row 2: shift left 2
 * Row 3: shift left 3
 *
 * @param {number[][]} state - 4×4 state matrix
 * @param {Function} [onStep]
 * @returns {number[][]} transformed state
 *
 * ⚠️ state is column-major but ShiftRows operates on rows!
 *    state[row][col] — row is first index, already correct for row access.
 */
export function shiftRows(state, onStep) {
  const r1 = [state[1][1], state[1][2], state[1][3], state[1][0]];
  const r2 = [state[2][2], state[2][3], state[2][0], state[2][1]];
  const r3 = [state[3][3], state[3][0], state[3][1], state[3][2]];
  state[1] = r1;
  state[2] = r2;
  state[3] = r3;
  return state;
}

/**
 * Apply the inverse ShiftRows transformation (cyclic right shift of rows).
 *
 * Row 0: no shift
 * Row 1: shift right 1
 * Row 2: shift right 2
 * Row 3: shift right 3
 *
 * @param {number[][]} state - 4×4 state matrix
 * @param {Function} [onStep]
 * @returns {number[][]} transformed state
 */
export function invShiftRows(state, onStep) {
  const r1 = [state[1][3], state[1][0], state[1][1], state[1][2]];
  const r2 = [state[2][2], state[2][3], state[2][0], state[2][1]];
  const r3 = [state[3][1], state[3][2], state[3][3], state[3][0]];
  state[1] = r1;
  state[2] = r2;
  state[3] = r3;
  return state;
}

/**
 * Apply the MixColumns transformation using GF(2^8) arithmetic.
 *
 * Mix matrix:
 *   [ 02 03 01 01 ]
 *   [ 01 02 03 01 ]
 *   [ 01 01 02 03 ]
 *   [ 03 01 01 02 ]
 *
 * @param {number[][]} state - 4×4 state matrix
 * @param {Function} [onStep]
 * @returns {number[][]} transformed state
 *
 * Checkpoint: column [0xDB, 0x13, 0x53, 0x45] → [0x8E, 0x4D, 0xA1, 0xBC]
 */
export function mixColumns(state, onStep) {
  for (let c = 0; c < 4; c++) {
    const s0 = state[0][c];
    const s1 = state[1][c];
    const s2 = state[2][c];
    const s3 = state[3][c];

    state[0][c] = gmul(s0, 2) ^ gmul(s1, 3) ^ s2 ^ s3;
    state[1][c] = s0 ^ gmul(s1, 2) ^ gmul(s2, 3) ^ s3;
    state[2][c] = s0 ^ s1 ^ gmul(s2, 2) ^ gmul(s3, 3);
    state[3][c] = gmul(s0, 3) ^ s1 ^ s2 ^ gmul(s3, 2);
  }
  return state;
}

/**
 * Apply the inverse MixColumns transformation.
 *
 * Inverse mix matrix (FIPS-197 standard):
 *   [ 0E 0B 0D 09 ]
 *   [ 09 0E 0B 0D ]
 *   [ 0D 09 0E 0B ]
 *   [ 0B 0D 09 0E ]
 *
 * @param {number[][]} state - 4×4 state matrix
 * @param {Function} [onStep]
 * @returns {number[][]} transformed state
 */
export function invMixColumns(state, onStep) {
  for (let c = 0; c < 4; c++) {
    const s0 = state[0][c];
    const s1 = state[1][c];
    const s2 = state[2][c];
    const s3 = state[3][c];

    state[0][c] = gmul(s0, 0x0e) ^ gmul(s1, 0x0b) ^ gmul(s2, 0x0d) ^ gmul(s3, 0x09);
    state[1][c] = gmul(s0, 0x09) ^ gmul(s1, 0x0e) ^ gmul(s2, 0x0b) ^ gmul(s3, 0x0d);
    state[2][c] = gmul(s0, 0x0d) ^ gmul(s1, 0x09) ^ gmul(s2, 0x0e) ^ gmul(s3, 0x0b);
    state[3][c] = gmul(s0, 0x0b) ^ gmul(s1, 0x0d) ^ gmul(s2, 0x09) ^ gmul(s3, 0x0e);
  }
  return state;
}

/**
 * Apply the AddRoundKey transformation: XOR each state byte with the round key.
 *
 * The round key is a 16-byte flat array in column-major order,
 * matching 1-to-1 with matrixToBytes(state).
 *
 * @param {number[][]} state    - 4×4 state matrix
 * @param {number[]}   roundKey - 16-byte round key (flat, column-major)
 * @param {Function}  [onStep]
 * @returns {number[][]} transformed state (same object, mutated)
 *
 * XOR is self-inverse: InvAddRoundKey === AddRoundKey
 */
export function addRoundKey(state, roundKey, onStep) {
  for (let i = 0; i < 16; i++) {
    const row = i % 4;
    const col = Math.floor(i / 4);
    state[row][col] ^= roundKey[i];
  }
  return state;
}

// ─────────────────────────────────────────────────────────────────────────────
//  TOP-LEVEL encrypt / decrypt — YOU wire everything (✍️ Fase 8 & 9)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Encrypt a 16-byte plaintext block using AES-128.
 *
 * Flow (Fase 8):
 *   1. roundKeys = keyExpansion(key)                         → 11 round keys
 *   2. state = bytesToMatrix(plaintext)
 *   3. Initial round:  addRoundKey(state, roundKeys[0])
 *   4. Rounds 1-9:     subBytes → shiftRows → mixColumns → addRoundKey(roundKeys[r])
 *   5. Round 10:       subBytes → shiftRows → addRoundKey(roundKeys[10])  ← NO mixColumns
 *   6. return Uint8Array(matrixToBytes(state))
 *
 * @param {number[]|Uint8Array} plaintext  - 16 bytes
 * @param {number[]|Uint8Array} key        - 16 bytes
 * @param {Function}           [onStep]    - optional callback(label, stateMatrix)
 * @returns {Uint8Array} 16-byte ciphertext
 */
export function encrypt(plaintext, key, onStep) {
  const deepCopy = (s) => s.map((row) => [...row]);

  // 1. Key Expansion
  const roundKeys = keyExpansion(key, onStep);

  // 2. Initial state
  let state = bytesToMatrix(plaintext);

  // 3. Initial AddRoundKey
  addRoundKey(state, roundKeys[0]);
  onStep?.('Initial Round — AddRoundKey', deepCopy(state));

  // 4. Rounds 1–9
  for (let r = 1; r <= 9; r++) {
    subBytes(state);
    onStep?.(`Round ${r} — SubBytes`, deepCopy(state));

    shiftRows(state);
    onStep?.(`Round ${r} — ShiftRows`, deepCopy(state));

    mixColumns(state);
    onStep?.(`Round ${r} — MixColumns`, deepCopy(state));

    addRoundKey(state, roundKeys[r]);
    onStep?.(`Round ${r} — AddRoundKey`, deepCopy(state));
  }

  // 5. Final Round (Round 10 — no MixColumns)
  subBytes(state);
  onStep?.('Round 10 — SubBytes', deepCopy(state));

  shiftRows(state);
  onStep?.('Round 10 — ShiftRows', deepCopy(state));

  addRoundKey(state, roundKeys[10]);
  onStep?.('Round 10 — AddRoundKey (Final)', deepCopy(state));

  // 6. Return ciphertext
  return new Uint8Array(matrixToBytes(state));
}

/**
 * Decrypt a 16-byte ciphertext block using AES-128.
 *
 * Flow (Fase 9):
 *   1. roundKeys = keyExpansion(key)                         → 11 round keys
 *   2. state = bytesToMatrix(ciphertext)
 *   3. state = addRoundKey(state, roundKeys[10])
 *   4. Rounds 9 down to 1:
 *        invShiftRows → invSubBytes → addRoundKey(roundKeys[r]) → invMixColumns
 *   5. Final:
 *        invShiftRows → invSubBytes → addRoundKey(roundKeys[0])  ← NO invMixColumns
 *   6. return Uint8Array(matrixToBytes(state))
 *
 * ⚠️ Off-by-one: roundKeys[10] already used in step 3.
 *    Loop uses roundKeys[9] down to roundKeys[1] (9 iterations).
 *
 * @param {number[]|Uint8Array} ciphertext - 16 bytes
 * @param {number[]|Uint8Array} key        - 16 bytes
 * @param {Function}           [onStep]    - optional callback(label, stateMatrix)
 * @returns {Uint8Array} 16-byte plaintext
 */
export function decrypt(ciphertext, key, onStep) {
  const deepCopy = (s) => s.map((row) => [...row]);

  // 1. Key Expansion
  const roundKeys = keyExpansion(key, onStep);

  // 2. Initial state from ciphertext
  let state = bytesToMatrix(ciphertext);

  // 3. Initial AddRoundKey with RK10
  addRoundKey(state, roundKeys[10]);
  onStep?.('Initial Round — AddRoundKey', deepCopy(state));

  // 4. Rounds 9 down to 1
  for (let r = 9; r >= 1; r--) {
    invShiftRows(state);
    onStep?.(`Round ${10 - r} — InvShiftRows`, deepCopy(state));

    invSubBytes(state);
    onStep?.(`Round ${10 - r} — InvSubBytes`, deepCopy(state));

    addRoundKey(state, roundKeys[r]);
    onStep?.(`Round ${10 - r} — AddRoundKey`, deepCopy(state));

    invMixColumns(state);
    onStep?.(`Round ${10 - r} — InvMixColumns`, deepCopy(state));
  }

  // 5. Final round (no InvMixColumns)
  invShiftRows(state);
  onStep?.('Round 10 — InvShiftRows', deepCopy(state));

  invSubBytes(state);
  onStep?.('Round 10 — InvSubBytes', deepCopy(state));

  addRoundKey(state, roundKeys[0]);
  onStep?.('Round 10 — AddRoundKey (Final)', deepCopy(state));

  // 6. Return plaintext
  return new Uint8Array(matrixToBytes(state));
}
