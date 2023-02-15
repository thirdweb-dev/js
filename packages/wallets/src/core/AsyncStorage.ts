export interface AsyncStorage {
  name: string;
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  createInstance(name: string): AsyncStorage;
}
