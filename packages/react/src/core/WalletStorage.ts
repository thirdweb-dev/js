import { AsyncStorage } from "@thirdweb-dev/wallets";

const PREFIX = "__TW__";

function getItem(this: AsyncStorage, key: string) {
  return new Promise<string | null>((res) => {
    res(localStorage.getItem(`${PREFIX}/${this.name}/${key}`));
  });
}

function setItem(this: AsyncStorage, key: string, value: string) {
  return new Promise<void>((res, rej) => {
    try {
      localStorage.setItem(`${PREFIX}/${this.name}/${key}`, value);
      res();
    } catch (e) {
      rej(e);
    }
  });
}

function removeItem(this: AsyncStorage, key: string) {
  return new Promise<void>((res) => {
    localStorage.removeItem(`${PREFIX}/${this.name}/${key}`);
    res();
  });
}

function createInstance(name: string): AsyncStorage {
  return {
    name,
    getItem,
    setItem,
    removeItem,
    createInstance,
  };
}

export const LocalAsyncStorage: AsyncStorage = {
  name: "",
  getItem,
  setItem,
  removeItem,
  createInstance,
};
