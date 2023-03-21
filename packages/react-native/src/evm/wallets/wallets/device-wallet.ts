import { ethers, utils } from "ethers";
import {
  AbstractDeviceWallet,
  DeviceWalletData,
  IDeviceWalletStore,
  DeviceWalletImplOptions,
  DeviceBrowserWallet as DeviceWalletCore,
} from "@thirdweb-dev/wallets";
import { ExtraCoreWalletOptions } from "@thirdweb-dev/react-core";
import type {
  WalletOptions,
  DeviceWalletOptions as DeviceWalletCoreOptions,
} from "@thirdweb-dev/wallets";
import * as SecureStore from "expo-secure-store";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";

// Device Wallet ----------------------------------------

const deviceWalletStorage = createAsyncLocalStorage("deviceWallet");

type DeviceWalletOptions = Omit<
  WalletOptions<DeviceWalletCoreOptions>,
  "storage" | "storageType" | "walletStorage"
> &
  ExtraCoreWalletOptions;

export class DeviceWallet extends DeviceWalletCore {
  constructor(options: DeviceWalletOptions) {
    super({
      ...options,
      storage: deviceWalletStorage,
      storageType: "asyncStore",
      walletStorage: deviceWalletStorage,
      wallet: new DeviceWalletImpl({
        storage: new AsyncWalletStorage(),
      }),
    });
  }

  static getStoredData() {
    const key = DeviceWalletCore.getDataStorageKey();
    return deviceWalletStorage.getItem(key);
  }

  static getStoredAddress() {
    const key = DeviceWalletCore.getAddressStorageKey();
    return deviceWalletStorage.getItem(key);
  }
}

class DeviceWalletImpl extends AbstractDeviceWallet {
  constructor(options: DeviceWalletImplOptions) {
    super(options);
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

  async generateNewWallet(): Promise<string> {
    const random = utils.randomBytes(32);
    this.wallet = new ethers.Wallet(random);
    return this.wallet.address;
  }

  async loadSavedWallet(): Promise<string> {
    const data = await this.options.storage.getWalletData();
    if (!data) {
      throw new Error("No saved wallet");
    }
    this.wallet = new ethers.Wallet(data.encryptedData);
    return this.wallet.address;
  }

  async save(): Promise<void> {
    const wallet = (await this.getSigner()) as ethers.Wallet;
    await this.options.storage.storeWalletData({
      address: wallet.address,
      encryptedData: wallet.privateKey,
    });
  }

  async export(): Promise<string> {
    const wallet = await this.options.storage.getWalletData();
    return JSON.stringify(
      wallet || {
        address: "",
        encryptedData: "",
      },
    );
  }

  getWalletData() {
    return this.options.storage.getWalletData();
  }
}

// no need for prefixing here - AsyncStorage is already namespaced
const STORAGE_KEY_DATA = "data";
const STORAGE_KEY_ADDR = "address";
class AsyncWalletStorage implements IDeviceWalletStore {
  async getWalletData(): Promise<DeviceWalletData | null> {
    const [address, encryptedData] = await Promise.all([
      SecureStore.getItemAsync(STORAGE_KEY_ADDR),
      SecureStore.getItemAsync(STORAGE_KEY_DATA),
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
      SecureStore.setItemAsync(STORAGE_KEY_ADDR, data.address),
      SecureStore.setItemAsync(STORAGE_KEY_DATA, data.encryptedData),
    ]);
  }
}
