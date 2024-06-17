import type { AsyncStorage } from "./AsyncStorage.js";

export const webLocalStorage: AsyncStorage = {
  async getItem(key: string) {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  },
  async setItem(key: string, value: string) {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
  async removeItem(key: string) {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
    }
  },
};
