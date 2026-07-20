import { createContext, useContext, useReducer, useCallback } from 'react';
import { encrypt, decrypt, generateKeys } from '../services/sdes.js';

const SimulatorContext = createContext(null);

const initialState = {
  mode: 'encrypt', // 'encrypt' | 'decrypt'
  plaintext: [0, 0, 0, 0, 0, 0, 0, 0],
  key: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  result: null,
  trace: null,
  keyTrace: null,
  K1: null,
  K2: null,
  isProcessing: false,
  showTrace: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload, result: null, trace: null, showTrace: false };
    case 'TOGGLE_PLAINTEXT_BIT':
      return {
        ...state,
        plaintext: state.plaintext.map((b, i) => i === action.payload ? (b === 0 ? 1 : 0) : b),
        result: null,
        trace: null,
      };
    case 'TOGGLE_KEY_BIT':
      return {
        ...state,
        key: state.key.map((b, i) => i === action.payload ? (b === 0 ? 1 : 0) : b),
        result: null,
        trace: null,
        K1: null,
        K2: null,
      };
    case 'SET_PLAINTEXT':
      return { ...state, plaintext: action.payload, result: null, trace: null };
    case 'SET_KEY':
      return { ...state, key: action.payload, result: null, trace: null, K1: null, K2: null };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload.result,
        trace: action.payload.trace,
        K1: action.payload.K1,
        K2: action.payload.K2,
        isProcessing: false,
      };
    case 'TOGGLE_TRACE':
      return { ...state, showTrace: !state.showTrace };
    case 'SET_SHOW_TRACE':
      return { ...state, showTrace: action.payload };
    case 'RESET':
      return {
        ...state,
        plaintext: [0, 0, 0, 0, 0, 0, 0, 0],
        key: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        result: null,
        trace: null,
        K1: null,
        K2: null,
        showTrace: false,
        isProcessing: false,
      };
    default:
      return state;
  }
}

export function SimulatorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const process = useCallback(() => {
    dispatch({ type: 'SET_PROCESSING', payload: true });

    // Small delay for animation effect
    setTimeout(() => {
      const { K1, K2 } = generateKeys(state.key);
      let processResult;

      if (state.mode === 'encrypt') {
        processResult = encrypt(state.plaintext, state.key);
      } else {
        processResult = decrypt(state.plaintext, state.key);
      }

      dispatch({
        type: 'SET_RESULT',
        payload: {
          result: processResult.result,
          trace: processResult.trace,
          K1,
          K2,
        }
      });
    }, 300);
  }, [state.mode, state.plaintext, state.key]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <SimulatorContext.Provider value={{ state, dispatch, process, reset }}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulator() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
}

export default SimulatorContext;
