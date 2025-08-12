import type { TruncatedSessionInfo } from "./api/types";

// Simple reactive store implementation for playground
function createStore<T>(initialValue: T) {
  let value = initialValue;
  const listeners: ((value: T) => void)[] = [];

  return {
    getValue: () => value,
    setValue: (newValue: T) => {
      value = newValue;
      listeners.forEach(listener => listener(value));
    },
    subscribe: (listener: (value: T) => void) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    }
  };
}

export const newSessionsStore = createStore<TruncatedSessionInfo[]>([]);

// array of deleted session ids
export const deletedSessionsStore = createStore<string[]>([]);