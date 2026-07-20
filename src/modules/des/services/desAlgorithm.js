import { hexToBin, binToHex, permute, xor } from './binaryUtils.js';
import { IP, IP_INV, E, P } from './permutation.js';
import { generateSubkeys } from './keySchedule.js';
import { lookupSBox } from './sbox.js';

/**
 * Runs the full DES encryption or decryption algorithm.
 * Logs all intermediate steps for visual simulation.
 * 
 * @param {string} plaintextHexOrBin - 64-bit plaintext
 * @param {string} keyHexOrBin - 64-bit key
 * @param {string} mode - 'encrypt' or 'decrypt'
 * @param {boolean} isBinaryInput - true if inputs are binary, false if hex
 * @returns {object} - Detailed log of all steps
 */
export function runDES(plaintextHexOrBin, keyHexOrBin, mode = 'encrypt', isPlaintextBinary = false, isKeyBinary = undefined) {
  const finalIsKeyBinary = isKeyBinary !== undefined ? isKeyBinary : isPlaintextBinary;

  // 1. Prepare binary inputs
  let plaintextBin = isPlaintextBinary 
    ? plaintextHexOrBin.replace(/\s+/g, '') 
    : hexToBin(plaintextHexOrBin.replace(/\s+/g, ''));
  
  let keyBin = finalIsKeyBinary 
    ? keyHexOrBin.replace(/\s+/g, '') 
    : hexToBin(keyHexOrBin.replace(/\s+/g, ''));

  if (plaintextBin.length !== 64) {
    throw new Error(`Plaintext must be 64 bits (found ${plaintextBin.length} bits)`);
  }
  if (keyBin.length !== 64) {
    throw new Error(`Key must be 64 bits (found ${keyBin.length} bits)`);
  }

  // 2. Generate Key Schedule
  const keySchedule = generateSubkeys(keyBin);
  const originalSubkeys = keySchedule.subkeys;
  
  // Decryption uses subkeys in reverse order
  const roundSubkeys = mode === 'encrypt' 
    ? [...originalSubkeys] 
    : [...originalSubkeys].reverse();

  // 3. Initial Permutation (IP)
  const ipResult = permute(plaintextBin, IP);
  let L = ipResult.slice(0, 32);
  let R = ipResult.slice(32, 64);

  const roundLogs = [];

  // 4. 16 Feistel Rounds
  for (let round = 1; round <= 16; round++) {
    const L_prev = L;
    const R_prev = R;

    // Subkey for this round
    const subkey = roundSubkeys[round - 1];
    
    // Find subkey index in original list for identification (1-16)
    const subkeyIndex = mode === 'encrypt' ? round : 17 - round;

    // A. Expansion (E-box)
    const expandedR = permute(R_prev, E);

    // B. XOR with subkey
    const xorResult = xor(expandedR, subkey);

    // C. S-Box substitution
    const sboxDetails = [];
    let sboxCombinedOutput = '';
    
    for (let b = 0; b < 8; b++) {
      const chunk = xorResult.slice(b * 6, (b + 1) * 6);
      const detail = lookupSBox(chunk, b);
      sboxDetails.push(detail);
      sboxCombinedOutput += detail.binaryOutput;
    }

    // D. Permutation (P-box)
    const pOutput = permute(sboxCombinedOutput, P);

    // E. XOR with L_prev
    const xorLp = xor(L_prev, pOutput);

    // Swap for the next round
    // L_i = R_{i-1}
    // R_i = L_{i-1} XOR f(R_{i-1}, K_i)
    L = R_prev;
    R = xorLp;

    roundLogs.push({
      round,
      L_prev,
      R_prev,
      subkeyIndex,
      subkey,
      expandedR,
      xorResult,
      sboxDetails,
      sboxOutput: sboxCombinedOutput,
      pOutput,
      xorLp,
      L,
      R,
      L_hex: binToHex(L),
      R_hex: binToHex(R),
      subkey_hex: binToHex(subkey)
    });
  }

  // 5. Final Swap (R16 L16)
  // After Round 16, L and R contain L16 and R16.
  // But wait, the loop leaves L = R_15_next = R15, R = L15_next XOR f(R15) = R16?
  // Let's trace our loop variable swap:
  // At the end of round 16:
  // L becomes R_prev (which is R15) - wait!
  // No, in standard DES:
  // Round 16 produces L16 and R16.
  // In our loop, for round 16:
  // L_prev = L15, R_prev = R15.
  // L is set to R_prev (which is R15). But wait, R15 is equal to L16. So L is L16.
  // R is set to L_prev XOR f(R_prev, K16), which is L15 XOR f(R15, K16) = R16. So R is R16.
  // So at the end of round 16, L = L16, R = R16.
  // The final block passed to IP_INV is R16 + L16.
  // So we combine R + L (R16 followed by L16).
  const preOutput = R + L; 

  // 6. Inverse Initial Permutation (IP-1)
  const ciphertextBin = permute(preOutput, IP_INV);
  const ciphertextHex = binToHex(ciphertextBin);

  return {
    plaintextBin,
    keyBin,
    mode,
    ipInput: plaintextBin,
    ipOutput: ipResult,
    keySchedule,
    rounds: roundLogs,
    preOutput,
    ciphertextBin,
    ciphertextHex
  };
}
