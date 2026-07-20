import { useCallback } from 'react';
import { encrypt, decrypt, generateKeys } from '../services/sdes.js';

/**
 * Hook for S-DES encryption/decryption operations
 * Can be used standalone outside of the SimulatorContext
 */
export function useSdes() {
  const encryptBits = useCallback((plainBits, key10Bits) => {
    return encrypt(plainBits, key10Bits);
  }, []);

  const decryptBits = useCallback((cipherBits, key10Bits) => {
    return decrypt(cipherBits, key10Bits);
  }, []);

  const genKeys = useCallback((key10Bits) => {
    return generateKeys(key10Bits);
  }, []);

  return {
    encrypt: encryptBits,
    decrypt: decryptBits,
    generateKeys: genKeys,
  };
}
