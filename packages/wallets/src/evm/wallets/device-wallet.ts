import { AsyncStorage } from "../../core";
import { thirdwebChains } from "../constants/chains";
import { TWConnector } from "../interfaces/tw-connector";
import { AbstractWallet } from "./abstract";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import { Chain } from "@thirdweb-dev/chains";
import { ethers } from "ethers";

export type DeviceWalletOptions = {
  chain: Chain;
  storageType?: "asyncStore" | "credentialStore";
  storage: AsyncStorage;
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
  #walletImpl?: DeviceWalletImpl;
  static id = "deviceWallet" as const;
  options: WalletOptions<DeviceWalletOptions>;

  public get walletName() {
    return "Device Wallet" as const;
  }

  constructor(options: WalletOptions<DeviceWalletOptions>) {
    super(DeviceBrowserWallet.id, {
      ...options,
      shouldAutoConnect: false, // TODO figure the autoconnect flow
    });
    this.options = options;
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { DeviceWalletConnector } = await import(
        "../connectors/device-wallet"
      );
      let wallet: DeviceWalletImpl;
      switch (this.options.storageType) {
        case "asyncStore":
          wallet = await DeviceWalletImpl.fromAsyncStorage(
            this.options.storage,
          );
          break;
        case "credentialStore":
          wallet = await DeviceWalletImpl.fromCredentialStore();
          break;
        default:
          // default to local storage
          wallet = await DeviceWalletImpl.fromAsyncStorage(
            this.options.storage,
          );
      }
      this.connector = new DeviceWalletConnector({
        chain: this.options.chain,
        wallet,
        chains: this.options.chains || thirdwebChains,
      });

      this.#walletImpl = wallet;
    }
    return this.connector;
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

export class DeviceWalletImpl extends AbstractWallet {
  static async fromAsyncStorage(storage: AsyncStorage) {
    return new DeviceWalletImpl({
      storage: new AsyncWalletStorage(storage),
    });
  }

  static async fromCredentialStore() {
    return new DeviceWalletImpl({
      storage: new CredentialsStorage(navigator.credentials),
    });
  }

  private options: DeviceWalletImplOptions;
  #wallet?: ethers.Wallet;

  constructor(options: DeviceWalletImplOptions) {
    super();
    this.options = options;
  }

  async getSigner(
    provider?: ethers.providers.Provider,
  ): Promise<ethers.Signer> {
    if (!this.#wallet) {
      throw new Error("Wallet not initialized");
    }
    let wallet = this.#wallet;
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

  async generateNewWallet(): Promise<string> {
    const wallet = ethers.Wallet.createRandom();
    this.#wallet = wallet;
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
    this.#wallet = wallet;
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

  getWalletData() {
    return this.options.storage.getWalletData();
  }
}

type WalletData = {
  address: string;
  encryptedData: string;
};

interface IWalletStore {
  getWalletData(): Promise<WalletData | null>;
  storeWalletData(data: WalletData): Promise<void>;
}

type DeviceWalletImplOptions = {
  storage: IWalletStore;
};

class AsyncWalletStorage implements IWalletStore {
  private storage: AsyncStorage;

  constructor(storage: AsyncStorage) {
    this.storage = storage;
  }
  async getWalletData(): Promise<WalletData | null> {
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

  async storeWalletData(data: WalletData): Promise<void> {
    await Promise.all([
      this.storage.setItem(STORAGE_KEY_ADDR, data.address),
      this.storage.setItem(STORAGE_KEY_DATA, data.encryptedData),
    ]);
  }
}

class CredentialsStorage implements IWalletStore {
  private container: CredentialsContainer;
  constructor(container: CredentialsContainer) {
    this.container = container;
  }
  async getWalletData(): Promise<WalletData | null> {
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

  async storeWalletData(data: WalletData): Promise<void> {
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
