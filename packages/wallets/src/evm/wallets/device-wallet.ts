import { TWConnector } from "../interfaces/tw-connector";
import { AbstractWallet } from "./abstract";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import type { Chain } from "@thirdweb-dev/chains";
import { ethers } from "ethers";

export type DeviceWalletOptions = {
  chain:
    | {
        chainId: number;
        rpc: string[];
      }
    | Chain;
  storage?: "localStore" | "credentialStore";
};

export type DeviceWalletConnectionArgs = {
  password: string;
};

export class DeviceBrowserWallet extends AbstractBrowserWallet<
  DeviceWalletOptions,
  DeviceWalletConnectionArgs
> {
  #connector?: TWConnector;

  static id = "deviceWallet" as const;
  public get walletName() {
    return "Device Wallet" as const;
  }

  // TODO wallet type in the Wallet Options
  constructor(options: WalletOptions<DeviceWalletOptions>) {
    super(DeviceBrowserWallet.id, {
      ...options,
      shouldAutoConnect: false, // TODO figure the autoconnect flow
    });
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { DeviceWalletConnector } = await import(
        "../connectors/device-wallet"
      );
      let wallet: DeviceWalletImpl;
      switch (this.options.storage) {
        case "localStore":
          wallet = await DeviceWalletImpl.fromBrowserStorage();
          break;
        case "credentialStore":
          wallet = await DeviceWalletImpl.fromCredentialStore();
          break;
        default:
          // default to local storage
          wallet = await DeviceWalletImpl.fromBrowserStorage();
      }
      this.#connector = new DeviceWalletConnector({
        chain: this.options.chain,
        wallet,
      });
    }
    return this.#connector;
  }
}

export class DeviceWalletImpl extends AbstractWallet {
  static async fromBrowserStorage() {
    return new DeviceWalletImpl({
      storage: new BrowserStorage(window.localStorage),
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
}

type WalletData = {
  address: string;
  encryptedData: string;
};

interface IWalletStore {
  getWalletData(): Promise<WalletData | null>;
  storeWalletData(data: WalletData): Promise<void>;
}

interface IDeviceStorage {
  getItem(key: string): string | null | undefined;
  setItem(key: string, value: string): void;
}

type DeviceWalletImplOptions = {
  storage: IWalletStore;
};

class BrowserStorage implements IWalletStore {
  private storage: IDeviceStorage;
  private STORAGE_KEY_DATA = "tw_wallet_data";
  private STORAGE_KEY_ADDR = "tw_wallet_address";
  constructor(storage: IDeviceStorage) {
    this.storage = storage;
  }
  async getWalletData(): Promise<WalletData | null> {
    const address = this.storage.getItem(this.STORAGE_KEY_ADDR);
    const encryptedData = this.storage.getItem(this.STORAGE_KEY_DATA);
    if (!address || !encryptedData) {
      return null;
    }
    return {
      address,
      encryptedData,
    };
  }

  async storeWalletData(data: WalletData): Promise<void> {
    this.storage.setItem(this.STORAGE_KEY_ADDR, data.address);
    this.storage.setItem(this.STORAGE_KEY_DATA, data.encryptedData);
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
    console.log(credential);
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
