import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorage as IAsyncStorage } from "@thirdweb-dev/wallets";

const PREFIX = "__TW__";

export class AsyncLocalStorage implements IAsyncStorage {
  name: string;
  asyncStorage: IAsyncStorage;

  constructor(name: string, asyncStorage: IAsyncStorage) {
    this.name = name;
    this.asyncStorage = asyncStorage;
  }

  getItem(key: string) {
    return this.asyncStorage.getItem(`${PREFIX}/${this.name}/${key}`);
  }

  setItem(key: string, value: string) {
    return this.asyncStorage.setItem(`${PREFIX}/${this.name}/${key}`, value);
  }

  removeItem(key: string) {
    return this.asyncStorage.removeItem(`${PREFIX}/${this.name}/${key}`);
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

export function createAsyncLocalStorage(name: string) {
  return new AsyncLocalStorage(name, AsyncStorage);
}
