// AES Round Constants (Rcon) for AES-128 Key Expansion
// Source: FIPS-197 Specification, Section 5.2
//
// RCON[i] = x^(i-1) mod (x^8 + x^4 + x^3 + x + 1) in GF(2^8)
// Index 0 is unused (padding). Use RCON[1] through RCON[10] for AES-128.
//
// During Key Expansion, only the first byte of the Rcon word matters:
//   Rcon word = [RCON[i], 0x00, 0x00, 0x00]
// The XOR is applied only to byte 0 of the temp word.
//
// Sequence:
//   RCON[1]  = 0x01  (x^0 = 1)
//   RCON[2]  = 0x02  (x^1 = x)
//   RCON[3]  = 0x04  (x^2)
//   RCON[4]  = 0x08  (x^3)
//   RCON[5]  = 0x10  (x^4)
//   RCON[6]  = 0x20  (x^5)
//   RCON[7]  = 0x40  (x^6)
//   RCON[8]  = 0x80  (x^7)
//   RCON[9]  = 0x1b  (x^8 mod poly → 0x1b)
//   RCON[10] = 0x36  (x^9 mod poly → 0x36)

export const RCON = [
  0x00, // index 0 — unused (placeholder)
  0x01, // round 1
  0x02, // round 2
  0x04, // round 3
  0x08, // round 4
  0x10, // round 5
  0x20, // round 6
  0x40, // round 7
  0x80, // round 8
  0x1b, // round 9
  0x36, // round 10
];

// Sanity check logs
console.log('Rcon verification: RCON[1] =', '0x' + RCON[1].toString(16).toUpperCase(), '(expected: 0x01)');
console.log('Rcon check [1]:', RCON[1] === 0x01 ? '✅ PASS' : '❌ FAIL');
console.log('Rcon check [10]:', RCON[10] === 0x36 ? '✅ PASS (0x36)' : '❌ FAIL — expected 0x36, got 0x' + RCON[10].toString(16));
