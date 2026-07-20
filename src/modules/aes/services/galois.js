export function gmul(a, b) {
  let result = 0;

  for (let i = 0; i < 8; i++) {
    if ((b & 1) === 1) {
      result = result ^ a;
    }

    const highBitSet = (a & 0x80) === 0x80;

    a = (a << 1) & 0xFF;

    if (highBitSet) {
      a = a ^ 0x1B;
    }

    b = b >> 1;
  }

  return result;
}