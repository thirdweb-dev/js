import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AsyncStorage as IStorage } from "./AsyncStorage.js";

export const nativeLocalStorage: IStorage = {
  async getItem(key: string) {
    // @ts-ignore - default import buils but ts doesn't like it
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    // @ts-ignore - default import buils but ts doesn't like it
    await AsyncStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    // @ts-ignore - default import buils but ts doesn't like it
    await AsyncStorage.removeItem(key);
  },
};
