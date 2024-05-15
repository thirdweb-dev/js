export interface SyncStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const PREFIX = "__TW__";

export class LocalStorage implements SyncStorage {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  getItem(key: string) {
    return localStorage.getItem(`${PREFIX}/${this.name}/${key}`);
  }

  setItem(key: string, value: string) {
    return localStorage.setItem(`${PREFIX}/${this.name}/${key}`, value);
  }

  removeItem(key: string) {
    return localStorage.removeItem(`${PREFIX}/${this.name}/${key}`);
  }
}

/**
 * @internal
 */
export function createLocalStorage(name: string) {
  return new LocalStorage(name);
}
