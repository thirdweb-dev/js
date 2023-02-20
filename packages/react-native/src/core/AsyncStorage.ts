import { AsyncStorage as IAsyncStorage } from "@thirdweb-dev/wallets";
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = "__TW__";

export class AsyncLocalStorage implements IAsyncStorage {
    name: string;
    asyncStorage: IAsyncStorage;

    constructor(name: string, asyncStorage: IAsyncStorage) {
        this.name = name;
        this.asyncStorage = asyncStorage;
    }

    getItem(key: string) {
        return this.asyncStorage.getItem(`${PREFIX}/${this.name}/${key}`)
    }

    setItem(key: string, value: string) {
        return this.asyncStorage.setItem(`${PREFIX}/${this.name}/${key}`, value);
    }

    removeItem(key: string) {
        return this.asyncStorage.removeItem(`${PREFIX}/${this.name}/${key}`);
    }
}

export function createAsyncLocalStorage(name: string) {
    return new AsyncLocalStorage(name, AsyncStorage);
}
