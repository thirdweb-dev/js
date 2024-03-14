import type { AsyncStorage } from "../../wallets/storage/AsyncStorage.js";

let storage: AsyncStorage;

/**
 * Gets the storage to be used in react.
 * @example
 * ```
 * const storage = getStorage();
 * ```
 * @returns The storage to use
 */
export function getStorage() {
  if (storage) {
    return storage;
  }
  return localStorage;
}

/**
 * Sets the storage to be used in react.
 * @example
 * ```
 * setStorage(storage);
 * ```
 * @param _storage - The storage to use
 */
export function setStorage(_storage: AsyncStorage) {
  storage = _storage;
}
