import { useState, useCallback } from 'react';

/**
 * Hook for managing a bit array state with toggle logic
 * @param {number} length - Number of bits
 * @param {number[]} initialValue - Initial bit array
 */
export function useBitInput(length = 8, initialValue = null) {
  const [bits, setBits] = useState(
    initialValue || new Array(length).fill(0)
  );

  const toggleBit = useCallback((index) => {
    setBits(prev => prev.map((b, i) => i === index ? (b === 0 ? 1 : 0) : b));
  }, []);

  const setBitValue = useCallback((index, value) => {
    setBits(prev => prev.map((b, i) => i === index ? value : b));
  }, []);

  const resetBits = useCallback(() => {
    setBits(new Array(length).fill(0));
  }, [length]);

  const setAllBits = useCallback((newBits) => {
    setBits([...newBits]);
  }, []);

  return {
    bits,
    toggleBit,
    setBitValue,
    resetBits,
    setAllBits,
  };
}
