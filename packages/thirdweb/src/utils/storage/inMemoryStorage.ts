import type { AsyncStorage } from "./AsyncStorage.js";

const store = new Map<string, string>();

export const inMemoryStorage: AsyncStorage = {
  getItem: async (key: string) => {
    return store.get(key) ?? null;
  },
  setItem: async (key: string, value: string) => {
    store.set(key, value);
  },
  removeItem: async (key: string) => {
    store.delete(key);
  },
};
