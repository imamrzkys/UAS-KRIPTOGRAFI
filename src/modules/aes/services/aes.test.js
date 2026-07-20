/**
 * AES-128 CipherFlow Simulator — Test Harness
 * Author : Imam Rizki Saputra (NIM 301230013)
 *
 * Test vector source: FIPS-197 Appendix B / C
 * https://csrc.nist.gov/publications/detail/fips/197/final
 *
 * ⚠️  DO NOT add encrypt/decrypt implementations here.
 *     This file only contains test scaffolding.
 *     Run with:  npx vitest run src/services/aes.test.js
 */

import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './aes.js';

// ─── Helper: hex string ↔ Uint8Array ────────────────────────────────────────

function hexToBytes(hex) {
  const clean = hex.replace(/\s+/g, '').toLowerCase();
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Official FIPS-197 AES-128 Test Vector ───────────────────────────────────
// Source: FIPS-197, Appendix B (single-block, 128-bit key)

const FIPS_KEY        = '000102030405060708090a0b0c0d0e0f';
const FIPS_PLAINTEXT  = '00112233445566778899aabbccddeeff';
const FIPS_CIPHERTEXT = '69c4e0d86a7b0430d8cdb78070b4c55a';

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('AES-128 — FIPS-197 Official Test Vector', () => {

  it('encrypt(plaintext, key) should match FIPS-197 ciphertext', () => {
    const key        = hexToBytes(FIPS_KEY);
    const plaintext  = hexToBytes(FIPS_PLAINTEXT);
    const expected   = FIPS_CIPHERTEXT;

    let result;
    try {
      result = encrypt(plaintext, key);
    } catch (err) {
      throw new Error(
        `encrypt() threw an error: ${err.message}\n` +
        `→ Have you implemented encrypt() in aes.js?`
      );
    }

    const resultHex = bytesToHex(result);
    expect(resultHex).toBe(expected);
  });

  it('decrypt(ciphertext, key) should recover original FIPS-197 plaintext', () => {
    const key        = hexToBytes(FIPS_KEY);
    const ciphertext = hexToBytes(FIPS_CIPHERTEXT);
    const expected   = FIPS_PLAINTEXT;

    let result;
    try {
      result = decrypt(ciphertext, key);
    } catch (err) {
      throw new Error(
        `decrypt() threw an error: ${err.message}\n` +
        `→ Have you implemented decrypt() in aes.js?`
      );
    }

    const resultHex = bytesToHex(result);
    expect(resultHex).toBe(expected);
  });

});

describe('AES-128 — Round-Trip Consistency Tests', () => {

  it('decrypt(encrypt(X, key), key) === X for FIPS vector', () => {
    const key       = hexToBytes(FIPS_KEY);
    const plaintext = hexToBytes(FIPS_PLAINTEXT);

    let encrypted, decrypted;
    try {
      encrypted = encrypt(plaintext, key);
      decrypted = decrypt(encrypted, key);
    } catch (err) {
      throw new Error(`Round-trip threw: ${err.message}`);
    }

    expect(bytesToHex(decrypted)).toBe(FIPS_PLAINTEXT);
  });

  it('decrypt(encrypt(X, key), key) === X for all-zeros block', () => {
    const key       = hexToBytes('00000000000000000000000000000000');
    const plaintext = hexToBytes('00000000000000000000000000000000');

    const encrypted = encrypt(plaintext, key);
    const decrypted = decrypt(encrypted, key);

    expect(bytesToHex(decrypted)).toBe(bytesToHex(plaintext));
  });

  it('decrypt(encrypt(X, key), key) === X for all-ones block', () => {
    const key       = hexToBytes('ffffffffffffffffffffffffffffffff');
    const plaintext = hexToBytes('ffffffffffffffffffffffffffffffff');

    const encrypted = encrypt(plaintext, key);
    const decrypted = decrypt(encrypted, key);

    expect(bytesToHex(decrypted)).toBe(bytesToHex(plaintext));
  });

  it('decrypt(encrypt(X, key), key) === X for random-ish block', () => {
    // Fixed "random" block — same every run so failures are reproducible
    const key       = hexToBytes('2b7e151628aed2a6abf7158809cf4f3c');
    const plaintext = hexToBytes('6bc1bee22e409f96e93d7e117393172a');

    const encrypted = encrypt(plaintext, key);
    const decrypted = decrypt(encrypted, key);

    expect(bytesToHex(decrypted)).toBe(bytesToHex(plaintext));
  });

});

describe('AES-128 — Key Expansion Smoke Test', () => {
  /**
   * FIPS-197 Appendix A.1 — First derived word:
   *   Key = 2b7e151628aed2a6abf7158809cf4f3c
   *   W[4] (first word of RK1) = a0fafe17
   *
   * This test imports keyExpansion directly so you can verify it
   * independently before wiring encrypt/decrypt.
   */
  it('keyExpansion W[4] matches FIPS-197 Appendix A.1 (a0fafe17)', async () => {
    let keyExpansion;
    try {
      ({ keyExpansion } = await import('./aes.js'));
    } catch {
      throw new Error('Could not import keyExpansion from aes.js');
    }

    if (!keyExpansion || typeof keyExpansion !== 'function') {
      throw new Error('keyExpansion is not exported or not a function in aes.js');
    }

    const key = hexToBytes('2b7e151628aed2a6abf7158809cf4f3c');
    let roundKeys;
    try {
      roundKeys = keyExpansion(key);
    } catch (err) {
      throw new Error(`keyExpansion() threw: ${err.message}`);
    }

    // roundKeys[1] = RK1 = W[4..7], first 4 bytes = W[4]
    const rk1 = roundKeys[1];
    const w4hex = bytesToHex(rk1.slice(0, 4));
    expect(w4hex).toBe('a0fafe17');
  });
});
