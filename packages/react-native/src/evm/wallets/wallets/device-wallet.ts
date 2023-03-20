import { ethers, utils } from "ethers";
import { AbstractDeviceWallet } from "@thirdweb-dev/wallets";
import * as SecureStore from "expo-secure-store";

export class DeviceWalletImpl extends AbstractDeviceWallet {
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
    const now = Date.now();
    console.log("generating new wallet", now);
    const random = utils.randomBytes(32);
    // const wallet = ethers.Wallet.createRandom();
    const wallet = new ethers.Wallet(random);
    console.log("finish generating new wallet", Date.now() - now);
    this.wallet = wallet;
    return wallet.address;
  }

  async loadSavedWallet(password: string): Promise<string> {
    console.log("password", password);
    const data = await this.options.storage.getWalletData();
    if (!data) {
      throw new Error("No saved wallet");
    }
    const now = Date.now();
    console.log("decrypting wallet", now);
    const wallet = new ethers.Wallet(data.encryptedData);
    // const wallet = await ethers.Wallet.fromEncryptedJson(
    //   data.encryptedData,
    //   password,
    // );
    console.log("finish decrypting wallet", Date.now() - now);
    this.wallet = wallet;
    return wallet.address;
  }

  async save(password: string): Promise<void> {
    console.log("password", password);
    const wallet = (await this.getSigner()) as ethers.Wallet;
    // reduce the scrypt cost to make it faster
    // const options = {
    //   scrypt: {
    //     N: 1 << 32,
    //   },
    // };
    // const now = Date.now();
    // console.log("encrypting wallet", now);
    // const encryptedData = await wallet.encrypt(password, options);
    // console.log("finish encrypting wallet", Date.now() - now);
    await this.options.storage.storeWalletData({
      address: wallet.address,
      encryptedData: wallet.privateKey,
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

// no need for prefixing here - AsyncStorage is already namespaced
const STORAGE_KEY_DATA = "data";
const STORAGE_KEY_ADDR = "address";
export class AsyncWalletStorage implements IWalletStore {
  async getWalletData(): Promise<WalletData | null> {
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

  async storeWalletData(data: WalletData): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEY_ADDR, data.address),
      SecureStore.setItemAsync(STORAGE_KEY_DATA, data.encryptedData),
    ]);
  }
}
