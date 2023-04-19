import {
  DeviceWallet as DeviceWalletCore,
  AsyncStorage,
  TWConnector,
} from "@thirdweb-dev/wallets";
import { Wallet } from "@thirdweb-dev/react-core";
import type { WalletOptions } from "@thirdweb-dev/wallets";
import * as SecureStore from "expo-secure-store";
import { ethers, utils } from "ethers";

// type DeviceWalletOptions = Omit<
//   WalletOptions<DeviceWalletCoreOptions>,
//   "storage" | "storageType" | "walletStorage"
// > &
//   ExtraCoreWalletOptions;

// export class DeviceWallet extends DeviceWalletCore {
//   constructor(options: DeviceWalletOptions) {
//     super({
//       ...options,
//       storage: deviceWalletStorage,
//       storageType: "asyncStore",
//       walletStorage: deviceWalletStorage,
//       wallet: new DeviceWalletImpl({
//         storage: new AsyncWalletStorage(),
//       }),
//     });
//   }

//   static getStoredData() {
//     const key = DeviceWalletCore.getDataStorageKey();
//     return deviceWalletStorage.getItem(key);
//   }

//   static getStoredAddress() {
//     const key = DeviceWalletCore.getAddressStorageKey();
//     return deviceWalletStorage.getItem(key);
//   }
// }

// class DeviceWalletImpl extends AbstractDeviceWallet {
//   constructor(options: DeviceWalletImplOptions) {
//     super(options);
//   }

//   async getSigner(
//     provider?: ethers.providers.Provider,
//   ): Promise<ethers.Signer> {
//     if (!this.wallet) {
//       throw new Error("Wallet not initialized");
//     }
//     let wallet = this.wallet;
//     if (provider) {
//       wallet = wallet.connect(provider);
//     }
//     return wallet;
//   }

//   async getSavedWalletAddress(): Promise<string | null> {
//     const data = await this.options.storage.getWalletData();
//     if (!data) {
//       return null;
//     }
//     return data.address;
//   }

//   async generateNewWallet(): Promise<string> {
//     const random = utils.randomBytes(32);
//     this.wallet = new ethers.Wallet(random);
//     return this.wallet.address;
//   }

//   async loadSavedWallet(): Promise<string> {
//     const data = await this.options.storage.getWalletData();
//     if (!data) {
//       throw new Error("No saved wallet");
//     }
//     this.wallet = new ethers.Wallet(data.encryptedData);
//     return this.wallet.address;
//   }

//   async save(): Promise<void> {
//     const wallet = (await this.getSigner()) as ethers.Wallet;
//     await this.options.storage.storeWalletData({
//       address: wallet.address,
//       encryptedData: wallet.privateKey,
//     });
//   }

//   async export(): Promise<string> {
//     const wallet = await this.options.storage.getWalletData();
//     return JSON.stringify(
//       wallet || {
//         address: "",
//         encryptedData: "",
//       },
//     );
//   }

//   getWalletData() {
//     return this.options.storage.getWalletData();
//   }
// }

export class DeviceWallet extends DeviceWalletCore {
  async generate() {
    if (this.ethersWallet) {
      throw new Error("wallet is already initialized");
    }
    const random = utils.randomBytes(32);
    console.log("random", random);
    this.ethersWallet = new ethers.Wallet(random);
    return this.ethersWallet.address;
  }

  protected async getConnector(): Promise<TWConnector> {
    console.log("getConnector");
    console.log("getConnector.ethersWallet", this.ethersWallet);
    if (!this.ethersWallet) {
      const store = SecureStore.getItemAsync("test");

      console.log("store", store);

      const data = await this.getSavedData();

      console.log("data", data);

      if (!data) {
        console.log("no data.generate");
        await this.generate();
        console.log("privatekey.done", (this.ethersWallet as any).privateKey);
        await this.save({
          strategy: "privateKey",
        });
        console.log("privatekey.done", (this.ethersWallet as any).privateKey);
      } else {
        this.ethersWallet = new ethers.Wallet(data.data);
      }
    }

    return super.getConnector();
  }
}

class SecureStorage implements AsyncStorage {
  getItem(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  }
  setItem(key: string, value: string): Promise<void> {
    return SecureStore.setItemAsync(key, value);
  }
  removeItem(key: string): Promise<void> {
    return SecureStore.deleteItemAsync(key);
  }
}

export const deviceWallet = () => {
  return {
    id: DeviceWallet.id,
    meta: DeviceWallet.meta,
    create: (options: WalletOptions) =>
      new DeviceWallet({
        ...options,
        walletStorage: new SecureStorage(),
      }),
  } satisfies Wallet;
};
