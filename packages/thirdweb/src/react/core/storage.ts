import type { AsyncStorage } from "../../wallets/storage/AsyncStorage.js";
import { asyncLocalStorage } from "../../wallets/storage/asyncLocalStorage.js";

let storage: AsyncStorage;

/**
 * Gets the storage to be used in react.
 * @example
 * ```ts
 * const storage = getStorage();
 * ```
 * @returns The storage to use
 */
export function getStorage(): AsyncStorage {
  if (storage) {
    return storage;
  }
  // default to localStorage
  return asyncLocalStorage;
}

/**
 * Sets the storage to be used in react.
 * @example
 * ```ts
 * setStorage(storage);
 * ```
 * @param _storage - The storage to use
 */
export function setStorage(_storage: AsyncStorage) {
  storage = _storage;
}
