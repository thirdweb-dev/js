import { AsyncStorage } from "@thirdweb-dev/wallets";

const PREFIX = "__TW__";

export class AsyncLocalStorage implements AsyncStorage {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getItem(key: string) {
    return new Promise<string | null>((res) => {
      res(localStorage.getItem(`${PREFIX}/${this.name}/${key}`));
    });
  }

  setItem(key: string, value: string) {
    return new Promise<void>((res, rej) => {
      try {
        localStorage.setItem(`${PREFIX}/${this.name}/${key}`, value);
        res();
      } catch (e) {
        rej(e);
      }
    });
  }

  removeItem(key: string) {
    return new Promise<void>((res) => {
      localStorage.removeItem(`${PREFIX}/${this.name}/${key}`);
      res();
    });
  }
}

export function createAsyncLocalStorage(name: string) {
  return new AsyncLocalStorage(name);
}
