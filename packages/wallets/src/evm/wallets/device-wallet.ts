import { AsyncStorage, createAsyncLocalStorage } from "../../core";
import { TWConnector } from "../interfaces/tw-connector";
import { AbstractWallet } from "./abstract";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import { Chain, defaultChains, Ethereum } from "@thirdweb-dev/chains";
import { ethers } from "ethers";

export type DeviceWalletOptions = {
  chain?: Chain;
  storageType?: "asyncStore" | "credentialStore";
  storage?: AsyncStorage;
  wallet?: AbstractDeviceWallet;
};

export type DeviceWalletConnectionArgs = {
  password: string;
};

// no need for prefixing here - AsyncStorage is already namespaced
const STORAGE_KEY_DATA = "data";
const STORAGE_KEY_ADDR = "address";

export class DeviceBrowserWallet extends AbstractBrowserWallet<
  DeviceWalletOptions,
  DeviceWalletConnectionArgs
> {
  connector?: TWConnector;
  #walletImpl?: AbstractDeviceWallet;
  options: WalletOptions<DeviceWalletOptions>;

  static id = "deviceWallet";

  static meta = {
    name: "Device Wallet",
    iconURL:
      "ipfs://QmcNddbYBuQKiBFnPcxYegjrX6S6z9K1vBNzbBBUJMn2ox/device-wallet.svg",
  };

  public get walletName() {
    return "Device Wallet" as const;
  }

  constructor(options: WalletOptions<DeviceWalletOptions>) {
    super(DeviceBrowserWallet.id, {
      ...options,
    });
    this.options = options;
    this.#walletImpl = this.initializeWallet(options.wallet);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { DeviceWalletConnector } = await import(
        "../connectors/device-wallet"
      );
      const wallet = this.#walletImpl;
      if (!wallet) {
        throw new Error("Wallet not initialized");
      }
      this.connector = new DeviceWalletConnector({
        chain: this.options.chain || Ethereum,
        wallet,
        chains: this.options.chains || defaultChains,
      });
    }
    return this.connector;
  }

  initializeWallet(wallet?: AbstractDeviceWallet) {
    if (wallet) {
      return wallet;
    }
    switch (this.options.storageType) {
      case "asyncStore":
        return DeviceWalletImpl.fromAsyncStorage(
          this.options.storage || createAsyncLocalStorage("deviceWallet"),
        );
        break;
      case "credentialStore":
        return DeviceWalletImpl.fromCredentialStore();
        break;
      default:
        // default to local storage
        return DeviceWalletImpl.fromAsyncStorage(
          this.options.storage || createAsyncLocalStorage("deviceWallet"),
        );
    }
  }

  getWalletData() {
    if (!this.#walletImpl) {
      throw new Error("Wallet not initialized");
    }

    return this.#walletImpl.getWalletData();
  }

  static getAddressStorageKey() {
    return STORAGE_KEY_ADDR;
  }

  static getDataStorageKey() {
    return STORAGE_KEY_DATA;
  }
}

export abstract class AbstractDeviceWallet extends AbstractWallet {
  protected wallet?: ethers.Wallet;
  protected options: DeviceWalletImplOptions;

  constructor(options: DeviceWalletImplOptions) {
    super();
    this.options = options;
  }

  async getSigner(
    provider?: ethers.providers.Provider,
  ): Promise<ethers.Signer> {
    if (!this.wallet) {
      throw new Error("Wallet not initialized");
    }
    let wallet = this.wallet;
    if (provider) {
      wallet = wallet.connect(provider);
    }
    return wallet;
  }

  async getSavedWalletAddress(): Promise<string | null> {
    const data = await this.options.storage.getWalletData();
    if (!data) {
      return null;
    }
    return data.address;
  }

  getWalletData() {
    return this.options.storage.getWalletData();
  }

  abstract generateNewWallet(): Promise<string>;

  abstract loadSavedWallet(password: string): Promise<string>;

  abstract save(password: string): Promise<void>;

  abstract export(password: string): Promise<string>;
}

export class DeviceWalletImpl extends AbstractDeviceWallet {
  static fromAsyncStorage(storage: AsyncStorage) {
    return new DeviceWalletImpl({
      storage: new AsyncWalletStorage(storage),
    });
  }

  static fromCredentialStore() {
    return new DeviceWalletImpl({
      storage: new CredentialsStorage(navigator.credentials),
    });
  }

  constructor(options: DeviceWalletImplOptions) {
    super(options);
  }

  async generateNewWallet(): Promise<string> {
    const wallet = ethers.Wallet.createRandom();
    this.wallet = wallet;
    return wallet.address;
  }

  async loadSavedWallet(password: string): Promise<string> {
    const data = await this.options.storage.getWalletData();
    if (!data) {
      throw new Error("No saved wallet");
    }
    const wallet = await ethers.Wallet.fromEncryptedJson(
      data.encryptedData,
      password,
    );
    this.wallet = wallet;
    return wallet.address;
  }

  async save(password: string): Promise<void> {
    const wallet = (await this.getSigner()) as ethers.Wallet;
    // reduce the scrypt cost to make it faster
    const options = {
      scrypt: {
        N: 1 << 32,
      },
    };
    const encryptedData = await wallet.encrypt(password, options);
    await this.options.storage.storeWalletData({
      address: wallet.address,
      encryptedData,
    });
  }

  async export(password: string): Promise<string> {
    const wallet = (await this.getSigner()) as ethers.Wallet;
    return wallet.encrypt(password);
  }
}

export type DeviceWalletData = {
  address: string;
  encryptedData: string;
};

export interface IDeviceWalletStore {
  getWalletData(): Promise<DeviceWalletData | null>;
  storeWalletData(data: DeviceWalletData): Promise<void>;
}

export type DeviceWalletImplOptions = {
  storage: IDeviceWalletStore;
};

class AsyncWalletStorage implements IDeviceWalletStore {
  private storage: AsyncStorage;

  constructor(storage: AsyncStorage) {
    this.storage = storage;
  }
  async getWalletData(): Promise<DeviceWalletData | null> {
    const [address, encryptedData] = await Promise.all([
      this.storage.getItem(STORAGE_KEY_ADDR),
      this.storage.getItem(STORAGE_KEY_DATA),
    ]);

    if (!address || !encryptedData) {
      return null;
    }
    return {
      address,
      encryptedData,
    };
  }

  async storeWalletData(data: DeviceWalletData): Promise<void> {
    await Promise.all([
      this.storage.setItem(STORAGE_KEY_ADDR, data.address),
      this.storage.setItem(STORAGE_KEY_DATA, data.encryptedData),
    ]);
  }
}

class CredentialsStorage implements IDeviceWalletStore {
  private container: CredentialsContainer;
  constructor(container: CredentialsContainer) {
    this.container = container;
  }
  async getWalletData(): Promise<DeviceWalletData | null> {
    const credential = await this.container.get({
      password: true,
      unmediated: true,
    } as CredentialRequestOptions);
    if (credential && "password" in credential) {
      return {
        address: credential.id,
        encryptedData: credential.password as string,
      };
    }
    return null;
  }

  async storeWalletData(data: DeviceWalletData): Promise<void> {
    if ("PasswordCredential" in window) {
      let credentialData = {
        id: data.address,
        password: data.encryptedData,
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
