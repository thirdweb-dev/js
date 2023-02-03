import { AbstractWallet } from "./abstract";
import { ethers } from "ethers";

interface IWalletStore {
  getPrivateKey(): Promise<string | null | undefined>;
  storePrivateKey(address: string, pkey: string): Promise<void>;
}

interface IDeviceStorage {
  getItem(key: string): string | null | undefined;
  setItem(key: string, value: string): void;
}

type DeviceWalletOptions = {
  storage: IWalletStore;
};

export class DeviceWalletImpl extends AbstractWallet {
  private options: DeviceWalletOptions;

  constructor(options: DeviceWalletOptions) {
    super();
    this.options = options;
  }

  async getSigner(
    provider?: ethers.providers.Provider,
  ): Promise<ethers.Signer> {
    return new ethers.Wallet(await this.getOrCreatePrivateKey(), provider);
  }

  async export(password: string): Promise<string> {
    const wallet = (await this.getSigner()) as ethers.Wallet;
    return wallet.encrypt(password);
  }

  private async getOrCreatePrivateKey(): Promise<string> {
    let pkey = await this.options.storage.getPrivateKey();
    if (!pkey) {
      const w = ethers.Wallet.createRandom();
      pkey = w.privateKey;
      await this.options.storage.storePrivateKey(w.address, pkey);
    }
    return pkey;
  }
}

class BrowserStorage implements IWalletStore {
  private storage: IDeviceStorage;
  private STORAGE_KEY = "tw_wallet_pk";
  constructor(storage: IDeviceStorage) {
    this.storage = storage;
  }

  async getPrivateKey(): Promise<string | null | undefined> {
    return this.storage.getItem(this.STORAGE_KEY);
  }

  async storePrivateKey(pkey: string): Promise<void> {
    this.storage.setItem(this.STORAGE_KEY, pkey);
  }
}

class CredentialsStorage implements IWalletStore {
  private container: CredentialsContainer;
  constructor(container: CredentialsContainer) {
    this.container = container;
  }

  async getPrivateKey(): Promise<string | null | undefined> {
    const credential = await this.container.get({
      password: true,
      unmediated: true,
    } as CredentialRequestOptions);
    console.log(credential);
    if (credential && "password" in credential) {
      return credential.password as string;
    }
    return null;
  }

  async storePrivateKey(address: string, pkey: string): Promise<void> {
    if ("PasswordCredential" in window) {
      let credentialData = {
        id: address,
        password: pkey,
      };
      const credential = await this.container.create({
        password: credentialData,
      } as CredentialCreationOptions);
      if (!credential) {
        throw new Error("Credential not created");
      }
      await this.container.store(credential);
    } else {
      throw new Error("PasswordCredential not supported");
    }
  }
}

export class DeviceWallet {
  static async fromBrowserStorage() {
    return new DeviceWalletImpl({
      storage: new BrowserStorage(window.localStorage),
    });
  }

  static async fromEncryptedBrowserStorage(secretKey: string) {
    const storage = await import("encrypt-storage");
    return new DeviceWalletImpl({
      storage: new BrowserStorage(new storage.EncryptStorage(secretKey)),
    });
  }

  static async fromCredentialStore() {
    return new DeviceWalletImpl({
      storage: new CredentialsStorage(navigator.credentials),
    });
  }
}
