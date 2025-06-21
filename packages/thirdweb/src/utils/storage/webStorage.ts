import type { AsyncStorage } from "./AsyncStorage.js";

export const webLocalStorage: AsyncStorage = {
  async getItem(key: string) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch {
      // ignore
    }

    return null;
  },
  async removeItem(key: string) {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
    }
  },
  async setItem(key: string, value: string) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
  },
};
