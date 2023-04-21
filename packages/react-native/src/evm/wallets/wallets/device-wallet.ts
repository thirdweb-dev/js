import {
  DeviceWallet as DeviceWalletCore,
  AsyncStorage,
  TWConnector,
} from "@thirdweb-dev/wallets";
import { Wallet } from "@thirdweb-dev/react-core";
import type { WalletOptions } from "@thirdweb-dev/wallets";
import * as SecureStore from "expo-secure-store";
import { ethers, utils } from "ethers";

export class DeviceWallet extends DeviceWalletCore {
  async generate() {
    if (this.ethersWallet) {
      throw new Error("wallet is already initialized");
    }
    const random = utils.randomBytes(32);
    this.ethersWallet = new ethers.Wallet(random);
    return this.ethersWallet.address;
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.ethersWallet) {
      const data = await this.getSavedData();

      if (!data) {
        await this.generate();
        await this.save({
          strategy: "privateKey",
        });
      } else {
        this.ethersWallet = new ethers.Wallet(data.data);
      }
    }

    console.log("privatekey", this.ethersWallet?.privateKey);
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
  const secureStorage = new SecureStorage();
  return {
    id: DeviceWallet.id,
    meta: DeviceWallet.meta,
    create: (options: WalletOptions) =>
      new DeviceWallet({
        ...options,
        walletStorage: secureStorage,
      }) as DeviceWalletCore,
  } satisfies Wallet;
};
