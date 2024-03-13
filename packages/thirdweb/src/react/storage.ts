import type { AsyncStorage } from "../wallets/storage/AsyncStorage.js";

let storage: AsyncStorage;

export function getStorage() {
  if (storage) {
    return storage;
  }
  return localStorage;
}

export function setConnectionManager(_storage: AsyncStorage) {
  storage = _storage;
}
