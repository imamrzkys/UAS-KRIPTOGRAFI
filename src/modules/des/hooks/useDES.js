import { useDESStore } from '../store/desStore.js';

export function useDES() {
  const store = useDESStore();
  return store;
}
