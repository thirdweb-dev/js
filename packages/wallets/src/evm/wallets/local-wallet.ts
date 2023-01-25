import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";

interface IWalletStorage {
  getPrivateKey(): Promise<string | null | undefined>;
  storePrivateKey(pkey: string): Promise<void>;
}

interface IStorage {
  getItem(key: string): string | null | undefined;
  setItem(key: string, value: string): void;
}

type LocalWalletOptions = {
  storage: IWalletStorage;
};

class LocalWalletInternal extends AbstractWallet {
  private options: LocalWalletOptions;

  constructor(options: LocalWalletOptions) {
    super();
    this.options = options;
  }

  async getSigner(
    provider?: ethers.providers.Provider,
  ): Promise<ethers.Signer> {
    return new ethers.Wallet(await this.getOrCreatePrivateKey(), provider);
  }

  async export() {
    const wallet = (await this.getSigner()) as ethers.Wallet;
    return {
      memonic: wallet.mnemonic,
      prvateKey: wallet.privateKey,
    };
  }

  private async getOrCreatePrivateKey(): Promise<string> {
    let pkey = await this.options.storage.getPrivateKey();
    if (!pkey) {
      pkey = ethers.Wallet.createRandom().privateKey;
      await this.options.storage.storePrivateKey(pkey);
    }
    return pkey;
  }
}

class BrowserStorage implements IWalletStorage {
  private storage: IStorage;
  private STORAGE_KEY = "tw_wallet_pk";
  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async getPrivateKey(): Promise<string | null | undefined> {
    return this.storage.getItem(this.STORAGE_KEY);
  }

  async storePrivateKey(pkey: string): Promise<void> {
    this.storage.setItem(this.STORAGE_KEY, pkey);
  }
}

export class LocalWallet {
  static async fromBrowserStorage() {
    return new LocalWalletInternal({
      storage: new BrowserStorage(window.localStorage),
    });
  }

  static async fromEncryptedBrowserStorage(secretKey: string) {
    const storage = await import("encrypt-storage");
    return new LocalWalletInternal({
      storage: new BrowserStorage(new storage.EncryptStorage(secretKey)),
    });
  }
}
