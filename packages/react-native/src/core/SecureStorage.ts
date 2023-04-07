import { ISecureStorage } from '@thirdweb-dev/react-core';
import * as SecureStore from 'expo-secure-store';

const PREFIX = "__tw__";

export class SecureStorage implements ISecureStorage {
  name: string;
  asyncStorage: typeof SecureStore;

  constructor(name: string) {
    this.name = name;
    this.asyncStorage = SecureStore;
  }

  getItem(key: string) {
    return this.asyncStorage.getItemAsync(`${PREFIX}_${this.name}_${key}`);
  }

  setItem(key: string, value: string) {
    return this.asyncStorage.setItemAsync(`${PREFIX}_${this.name}_${key}`, value);
  }

  removeItem(key: string) {
    return this.asyncStorage.deleteItemAsync(`${PREFIX}_${this.name}_${key}`);
  }
}

export function createSecureStorage(name: string) {
  return new SecureStorage(name);
}
