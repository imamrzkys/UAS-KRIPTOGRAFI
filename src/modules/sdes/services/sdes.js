/**
 * S-DES (Simplified Data Encryption Standard) Implementation
 *
 * Implementasi murni algoritma S-DES dengan dukungan trace langkah demi langkah.
 * Semua tabel permutasi mengikuti spesifikasi standar S-DES.
 */

import { permute, xor, leftShift, splitHalves, combine } from '../utils/bitUtils.js';
import { S0, S1, sboxLookup } from '../utils/sboxLookup.js';
import { bitArrayToPlain } from '../utils/formatters.js';

// ─── Tabel Permutasi ────────────────────────────────────────────────
const P10    = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
const P8     = [6, 3, 7, 4, 8, 5, 10, 9];
const P4     = [2, 4, 3, 1];
const IP     = [2, 6, 3, 1, 4, 8, 5, 7];
const IP_INV = [4, 1, 3, 5, 7, 2, 8, 6];
const EP     = [4, 1, 2, 3, 2, 3, 4, 1];

// ─── Pembangkitan Kunci ──────────────────────────────────────────────

/**
 * Bangkitkan subkunci K1 dan K2 dari kunci 10-bit
 * @param {number[]} key10Bits - Array kunci 10-bit
 * @returns {{ K1: number[], K2: number[], trace: object[] }}
 */
export function generateKeys(key10Bits) {
  const trace = [];

  // Langkah 1: Permutasi P10
  const p10Result = permute(key10Bits, P10);
  trace.push({
    step: 1,
    label: 'Permutasi P10',
    input: [...key10Bits],
    output: [...p10Result],
    description:
      `Kunci 10-bit awal (${bitArrayToPlain(key10Bits)}) diacak posisinya menggunakan tabel P10 [${P10.join(', ')}]. ` +
      `Artinya: bit ke-1 hasil = bit ke-3 kunci, bit ke-2 hasil = bit ke-5 kunci, dst. ` +
      `Hasil setelah P10: ${bitArrayToPlain(p10Result)}.`,
    table: P10
  });

  // Langkah 2: Bagi dua bagian
  const [left1, right1] = splitHalves(p10Result);
  trace.push({
    step: 2,
    label: 'Pembagian Dua Bagian (Split)',
    input: [...p10Result],
    output: { left: [...left1], right: [...right1] },
    description:
      `Hasil P10 (${bitArrayToPlain(p10Result)}) dibagi menjadi dua bagian masing-masing 5-bit. ` +
      `Bagian KIRI (L): ${bitArrayToPlain(left1)}, Bagian KANAN (R): ${bitArrayToPlain(right1)}.`
  });

  // Langkah 3: Geser Kiri 1 (LS-1) pada kedua bagian
  const ls1Left  = leftShift(left1, 1);
  const ls1Right = leftShift(right1, 1);
  const ls1Combined = combine(ls1Left, ls1Right);
  trace.push({
    step: 3,
    label: 'Geser Kiri 1 Posisi (LS-1)',
    input: { left: [...left1], right: [...right1] },
    output: [...ls1Combined],
    description:
      `Setiap bagian digeser ke kiri sebanyak 1 posisi (bit paling kiri pindah ke paling kanan). ` +
      `L: ${bitArrayToPlain(left1)} → ${bitArrayToPlain(ls1Left)}, ` +
      `R: ${bitArrayToPlain(right1)} → ${bitArrayToPlain(ls1Right)}. ` +
      `Gabungan LS-1: ${bitArrayToPlain(ls1Combined)}.`
  });

  // Langkah 4: Permutasi P8 → K1
  const K1 = permute(ls1Combined, P8);
  trace.push({
    step: 4,
    label: 'Permutasi P8 → Subkunci K1',
    input: [...ls1Combined],
    output: [...K1],
    description:
      `Hasil LS-1 (${bitArrayToPlain(ls1Combined)}) dipermutasi dengan tabel P8 [${P8.join(', ')}], ` +
      `hanya mengambil 8 dari 10 bit. Ini menghasilkan Subkunci K1 = ${bitArrayToPlain(K1)}. ` +
      `K1 akan digunakan pada Putaran 1 saat enkripsi (atau Putaran 1 saat dekripsi).`,
    table: P8
  });

  // Langkah 5: Geser Kiri 2 (LS-2) pada hasil LS-1
  const ls2Left  = leftShift(ls1Left, 2);
  const ls2Right = leftShift(ls1Right, 2);
  const ls2Combined = combine(ls2Left, ls2Right);
  trace.push({
    step: 5,
    label: 'Geser Kiri 2 Posisi (LS-2)',
    input: { left: [...ls1Left], right: [...ls1Right] },
    output: [...ls2Combined],
    description:
      `Hasil LS-1 digeser kembali ke kiri sebanyak 2 posisi lagi. ` +
      `L: ${bitArrayToPlain(ls1Left)} → ${bitArrayToPlain(ls2Left)}, ` +
      `R: ${bitArrayToPlain(ls1Right)} → ${bitArrayToPlain(ls2Right)}. ` +
      `Gabungan LS-2: ${bitArrayToPlain(ls2Combined)}.`
  });

  // Langkah 6: Permutasi P8 → K2
  const K2 = permute(ls2Combined, P8);
  trace.push({
    step: 6,
    label: 'Permutasi P8 → Subkunci K2',
    input: [...ls2Combined],
    output: [...K2],
    description:
      `Hasil LS-2 (${bitArrayToPlain(ls2Combined)}) dipermutasi dengan tabel P8 [${P8.join(', ')}] ` +
      `untuk menghasilkan Subkunci K2 = ${bitArrayToPlain(K2)}. ` +
      `K2 akan digunakan pada Putaran 2 saat enkripsi (atau Putaran 1 saat dekripsi).`,
    table: P8
  });

  return { K1, K2, trace };
}

// ─── Fungsi Putaran Feistel ──────────────────────────────────────────

/**
 * Jalankan satu putaran fungsi Feistel
 * @param {number[]} bits8   - Input 8-bit
 * @param {number[]} subkey  - Subkunci 8-bit (K1 atau K2)
 * @param {string} roundLabel - Label putaran untuk trace
 * @param {string} keyLabel   - Label kunci yang dipakai (K1 / K2)
 * @returns {{ result: number[], trace: object[] }}
 */
function feistelRound(bits8, subkey, roundLabel, keyLabel) {
  const trace = [];
  const [left, right] = splitHalves(bits8);

  // Ekspansi EP: kanan 4-bit → 8-bit
  const epResult = permute(right, EP);
  trace.push({
    step: 1,
    label: `${roundLabel}: Ekspansi EP`,
    input: [...right],
    output: [...epResult],
    description:
      `Bagian KANAN (${bitArrayToPlain(right)}) yang berukuran 4-bit diperluas menjadi 8-bit ` +
      `menggunakan tabel EP [${EP.join(', ')}]. Beberapa bit diduplikasi agar ukurannya sama dengan subkunci. ` +
      `Hasil EP: ${bitArrayToPlain(epResult)}.`,
    table: EP
  });

  // XOR dengan subkunci
  const xorResult = xor(epResult, subkey);
  trace.push({
    step: 2,
    label: `${roundLabel}: XOR dengan ${keyLabel}`,
    input: { ep: [...epResult], key: [...subkey] },
    output: [...xorResult],
    description:
      `Hasil EP (${bitArrayToPlain(epResult)}) di-XOR bit per bit dengan subkunci ${keyLabel} (${bitArrayToPlain(subkey)}). ` +
      `Operasi XOR: bit bernilai sama → 0, bit berbeda → 1. ` +
      `Hasil XOR: ${bitArrayToPlain(xorResult)}.`
  });

  // Bagi hasil XOR untuk masuk S-Box
  const [sboxLeft, sboxRight] = splitHalves(xorResult);

  // Pencarian S-Box S0
  const s0Result = sboxLookup(S0, sboxLeft);
  trace.push({
    step: 3,
    label: `${roundLabel}: Lookup S-Box S0`,
    input: [...sboxLeft],
    output: [...s0Result.output],
    description:
      `4-bit kiri hasil XOR (${bitArrayToPlain(sboxLeft)}) dimasukkan ke S-Box S0. ` +
      `Bit ke-1 & ke-4 membentuk BARIS (${s0Result.row} = biner ${s0Result.row.toString(2).padStart(2,'0')}), ` +
      `bit ke-2 & ke-3 membentuk KOLOM (${s0Result.col} = biner ${s0Result.col.toString(2).padStart(2,'0')}). ` +
      `S0[baris=${s0Result.row}, kolom=${s0Result.col}] = ${s0Result.value}, diubah ke 2-bit: ${bitArrayToPlain(s0Result.output)}.`,
    sbox: { name: 'S0', row: s0Result.row, col: s0Result.col, value: s0Result.value }
  });

  // Pencarian S-Box S1
  const s1Result = sboxLookup(S1, sboxRight);
  trace.push({
    step: 4,
    label: `${roundLabel}: Lookup S-Box S1`,
    input: [...sboxRight],
    output: [...s1Result.output],
    description:
      `4-bit kanan hasil XOR (${bitArrayToPlain(sboxRight)}) dimasukkan ke S-Box S1. ` +
      `Bit ke-1 & ke-4 membentuk BARIS (${s1Result.row} = biner ${s1Result.row.toString(2).padStart(2,'0')}), ` +
      `bit ke-2 & ke-3 membentuk KOLOM (${s1Result.col} = biner ${s1Result.col.toString(2).padStart(2,'0')}). ` +
      `S1[baris=${s1Result.row}, kolom=${s1Result.col}] = ${s1Result.value}, diubah ke 2-bit: ${bitArrayToPlain(s1Result.output)}.`,
    sbox: { name: 'S1', row: s1Result.row, col: s1Result.col, value: s1Result.value }
  });

  // Gabungkan hasil S-Box
  const sboxCombined = combine(s0Result.output, s1Result.output);

  // Permutasi P4
  const p4Result = permute(sboxCombined, P4);
  trace.push({
    step: 5,
    label: `${roundLabel}: Permutasi P4`,
    input: [...sboxCombined],
    output: [...p4Result],
    description:
      `Gabungan output S0 (${bitArrayToPlain(s0Result.output)}) dan S1 (${bitArrayToPlain(s1Result.output)}) = ` +
      `${bitArrayToPlain(sboxCombined)} diacak menggunakan tabel P4 [${P4.join(', ')}]. ` +
      `Hasil P4: ${bitArrayToPlain(p4Result)}.`,
    table: P4
  });

  // XOR dengan bagian kiri
  const finalXor = xor(left, p4Result);
  trace.push({
    step: 6,
    label: `${roundLabel}: XOR dengan Bagian Kiri`,
    input: { left: [...left], p4: [...p4Result] },
    output: [...finalXor],
    description:
      `Bagian KIRI awal putaran (${bitArrayToPlain(left)}) di-XOR dengan hasil P4 (${bitArrayToPlain(p4Result)}). ` +
      `Ini adalah ciri khas Feistel Cipher: bagian kiri diperbarui, bagian kanan tetap. ` +
      `Hasil: ${bitArrayToPlain(finalXor)}. Output putaran = KIRI baru (${bitArrayToPlain(finalXor)}) + KANAN lama (${bitArrayToPlain(right)}).`
  });

  // Hasil: kiri baru = finalXor, kanan tetap
  const result = combine(finalXor, right);
  return { result, trace };
}

// ─── Enkripsi ────────────────────────────────────────────────────────

/**
 * Enkripsi plaintext 8-bit menggunakan kunci 10-bit
 * @param {number[]} plainBits   - Plaintext 8-bit
 * @param {number[]} key10Bits   - Kunci 10-bit
 * @returns {{ result: number[], trace: object[] }}
 */
export function encrypt(plainBits, key10Bits) {
  const allTrace = [];

  // Bangkitkan kunci
  const { K1, K2, trace: keyTrace } = generateKeys(key10Bits);
  allTrace.push({
    step: 1,
    label: 'Pembangkitan Kunci',
    input: [...key10Bits],
    output: { K1: [...K1], K2: [...K2] },
    description:
      `Dari kunci 10-bit (${bitArrayToPlain(key10Bits)}), dibangkitkan dua subkunci masing-masing 8-bit: ` +
      `K1 = ${bitArrayToPlain(K1)} (untuk Putaran 1) dan K2 = ${bitArrayToPlain(K2)} (untuk Putaran 2).`,
    subTrace: keyTrace
  });

  // Permutasi Awal (IP)
  const ipResult = permute(plainBits, IP);
  allTrace.push({
    step: 2,
    label: 'Permutasi Awal (IP)',
    input: [...plainBits],
    output: [...ipResult],
    description:
      `Plaintext (${bitArrayToPlain(plainBits)}) diacak posisinya menggunakan tabel IP [${IP.join(', ')}] ` +
      `sebelum masuk ke putaran Feistel. Ini memastikan bit tersebar merata. ` +
      `Hasil IP: ${bitArrayToPlain(ipResult)}.`,
    table: IP
  });

  // Putaran 1 dengan K1
  const round1 = feistelRound(ipResult, K1, 'Putaran 1', 'K1');
  allTrace.push({
    step: 3,
    label: 'Putaran 1 — Fungsi Feistel (Kunci K1)',
    input: [...ipResult],
    output: [...round1.result],
    description:
      `Hasil IP (${bitArrayToPlain(ipResult)}) diproses dalam Putaran 1 menggunakan subkunci K1 = ${bitArrayToPlain(K1)}. ` +
      `Proses: bagian kanan diekspansi (EP) → di-XOR dengan K1 → diproses S-Box S0 & S1 → permutasi P4 → di-XOR dengan bagian kiri. ` +
      `Output Putaran 1: ${bitArrayToPlain(round1.result)}.`,
    subTrace: round1.trace
  });

  // Penukaran (Swap)
  const [r1Left, r1Right] = splitHalves(round1.result);
  const swapped = combine(r1Right, r1Left);
  allTrace.push({
    step: 4,
    label: 'Penukaran Posisi (SW — Swap)',
    input: [...round1.result],
    output: [...swapped],
    description:
      `Setelah Putaran 1, bagian kiri (${bitArrayToPlain(r1Left)}) dan kanan (${bitArrayToPlain(r1Right)}) ditukar posisinya. ` +
      `Ini adalah langkah standar Feistel sebelum putaran berikutnya. ` +
      `Hasil setelah swap: ${bitArrayToPlain(swapped)}.`
  });

  // Putaran 2 dengan K2
  const round2 = feistelRound(swapped, K2, 'Putaran 2', 'K2');
  allTrace.push({
    step: 5,
    label: 'Putaran 2 — Fungsi Feistel (Kunci K2)',
    input: [...swapped],
    output: [...round2.result],
    description:
      `Hasil swap (${bitArrayToPlain(swapped)}) diproses dalam Putaran 2 menggunakan subkunci K2 = ${bitArrayToPlain(K2)}. ` +
      `Proses identik dengan Putaran 1, namun menggunakan kunci yang berbeda (K2). ` +
      `Output Putaran 2: ${bitArrayToPlain(round2.result)}.`,
    subTrace: round2.trace
  });

  // Permutasi Balik (IP⁻¹)
  const result = permute(round2.result, IP_INV);
  allTrace.push({
    step: 6,
    label: 'Permutasi Balik (IP⁻¹) — Hasil Akhir',
    input: [...round2.result],
    output: [...result],
    description:
      `Output Putaran 2 (${bitArrayToPlain(round2.result)}) diacak ulang menggunakan tabel IP⁻¹ [${IP_INV.join(', ')}], ` +
      `yaitu kebalikan dari permutasi awal. Ini adalah langkah terakhir enkripsi. ` +
      `CIPHERTEXT (Hasil Enkripsi): ${bitArrayToPlain(result)}.`,
    table: IP_INV
  });

  return { result, trace: allTrace };
}

// ─── Dekripsi ────────────────────────────────────────────────────────

/**
 * Dekripsi ciphertext 8-bit menggunakan kunci 10-bit
 * @param {number[]} cipherBits  - Ciphertext 8-bit
 * @param {number[]} key10Bits   - Kunci 10-bit
 * @returns {{ result: number[], trace: object[] }}
 */
export function decrypt(cipherBits, key10Bits) {
  const allTrace = [];

  // Bangkitkan kunci
  const { K1, K2, trace: keyTrace } = generateKeys(key10Bits);
  allTrace.push({
    step: 1,
    label: 'Pembangkitan Kunci',
    input: [...key10Bits],
    output: { K1: [...K1], K2: [...K2] },
    description:
      `Dari kunci 10-bit (${bitArrayToPlain(key10Bits)}), dibangkitkan dua subkunci: ` +
      `K1 = ${bitArrayToPlain(K1)} dan K2 = ${bitArrayToPlain(K2)}. ` +
      `Perhatian: untuk dekripsi, urutan kunci DIBALIK — K2 dipakai di Putaran 1, K1 dipakai di Putaran 2.`,
    subTrace: keyTrace
  });

  // Permutasi Awal (IP)
  const ipResult = permute(cipherBits, IP);
  allTrace.push({
    step: 2,
    label: 'Permutasi Awal (IP)',
    input: [...cipherBits],
    output: [...ipResult],
    description:
      `Ciphertext (${bitArrayToPlain(cipherBits)}) diacak posisinya menggunakan tabel IP [${IP.join(', ')}]. ` +
      `Proses ini sama persis dengan enkripsi — IP selalu diterapkan di awal. ` +
      `Hasil IP: ${bitArrayToPlain(ipResult)}.`,
    table: IP
  });

  // Putaran 1 dengan K2 (urutan kunci terbalik saat dekripsi)
  const round1 = feistelRound(ipResult, K2, 'Putaran 1', 'K2');
  allTrace.push({
    step: 3,
    label: 'Putaran 1 — Fungsi Feistel (Kunci K2)',
    input: [...ipResult],
    output: [...round1.result],
    description:
      `Hasil IP (${bitArrayToPlain(ipResult)}) diproses Putaran 1 menggunakan K2 = ${bitArrayToPlain(K2)}. ` +
      `Kunci dibalik karena dekripsi harus membalik proses enkripsi: enkripsi pakai K1→K2, dekripsi pakai K2→K1. ` +
      `Output Putaran 1: ${bitArrayToPlain(round1.result)}.`,
    subTrace: round1.trace
  });

  // Penukaran (Swap)
  const [r1Left, r1Right] = splitHalves(round1.result);
  const swapped = combine(r1Right, r1Left);
  allTrace.push({
    step: 4,
    label: 'Penukaran Posisi (SW — Swap)',
    input: [...round1.result],
    output: [...swapped],
    description:
      `Bagian kiri (${bitArrayToPlain(r1Left)}) dan kanan (${bitArrayToPlain(r1Right)}) ditukar posisinya, ` +
      `sama seperti langkah enkripsi. Hasil setelah swap: ${bitArrayToPlain(swapped)}.`
  });

  // Putaran 2 dengan K1
  const round2 = feistelRound(swapped, K1, 'Putaran 2', 'K1');
  allTrace.push({
    step: 5,
    label: 'Putaran 2 — Fungsi Feistel (Kunci K1)',
    input: [...swapped],
    output: [...round2.result],
    description:
      `Hasil swap (${bitArrayToPlain(swapped)}) diproses Putaran 2 menggunakan K1 = ${bitArrayToPlain(K1)}. ` +
      `Ini menyelesaikan pembalikan proses enkripsi. ` +
      `Output Putaran 2: ${bitArrayToPlain(round2.result)}.`,
    subTrace: round2.trace
  });

  // Permutasi Balik (IP⁻¹)
  const result = permute(round2.result, IP_INV);
  allTrace.push({
    step: 6,
    label: 'Permutasi Balik (IP⁻¹) — Hasil Akhir',
    input: [...round2.result],
    output: [...result],
    description:
      `Output Putaran 2 (${bitArrayToPlain(round2.result)}) diacak menggunakan IP⁻¹ [${IP_INV.join(', ')}] ` +
      `untuk mendapatkan kembali data asli. ` +
      `PLAINTEXT (Hasil Dekripsi): ${bitArrayToPlain(result)}.`,
    table: IP_INV
  });

  return { result, trace: allTrace };
}
