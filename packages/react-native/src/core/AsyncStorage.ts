import {
  AsyncStorage as IAsyncStorage,
  SyncStorage,
} from "@thirdweb-dev/wallets";
import { MMKV } from "react-native-mmkv";

const PREFIX = "__TW__";

export class AsyncLocalStorage implements IAsyncStorage {
  name: string;
  asyncStorage: MMKV;

  constructor(name: string) {
    this.name = name;
    this.asyncStorage = new MMKV();
  }

  getItem(key: string) {
    const item =
      this.asyncStorage.getString(`${PREFIX}/${this.name}/${key}`) || null;
    return Promise.resolve(item);
  }

  setItem(key: string, value: string) {
    return Promise.resolve(
      this.asyncStorage.set(`${PREFIX}/${this.name}/${key}`, value),
    );
  }

  removeItem(key: string) {
    return Promise.resolve(
      this.asyncStorage.delete(`${PREFIX}/${this.name}/${key}`),
    );
  }
}
/**
 * @internal
 */
export class LocalStorage implements SyncStorage {
  name: string;
  asyncStorage: MMKV;

  constructor(name: string) {
    this.name = name;
    this.asyncStorage = new MMKV();
  }

  getItem(key: string) {
    return this.asyncStorage.getString(`${PREFIX}/${this.name}/${key}`) || null;
  }

  setItem(key: string, value: string) {
    return this.asyncStorage.set(`${PREFIX}/${this.name}/${key}`, value);
  }

  removeItem(key: string) {
    return this.asyncStorage.delete(`${PREFIX}/${this.name}/${key}`);
  }
}

export class noopStorage implements IAsyncStorage {
  getItem(key: string): Promise<string | null> {
    return Promise.resolve(key);
  }
  setItem(key: string, value: string): Promise<void> {
    console.log(key, value);
    return Promise.resolve();
  }
  removeItem(key: string): Promise<void> {
    console.log(key);
    return Promise.resolve();
  }
}

/**
 * @internal
 *
 * Returns a new instance of AsyncLocalStorage
 *
 * @param name - Name to namespace the storage with
 * @returns A new instance of AsyncLocalStorage
 */
export function createAsyncLocalStorage(name: string) {
  return new AsyncLocalStorage(name);
}

/**
 * @internal
 *
 * Returns a new instance of LocalStorage
 *
 * @param name - Name to namespace the storage with
 * @returns A new instance of LocalStorage
 */
export function createSyncStorage(name: string) {
  return new LocalStorage(name);
}
