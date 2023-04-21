import {
  LocalWallet as LocalWalletCore,
  AsyncStorage,
  TWConnector,
} from "@thirdweb-dev/wallets";
import { Wallet } from "@thirdweb-dev/react-core";
import type { WalletOptions } from "@thirdweb-dev/wallets";
import * as SecureStore from "expo-secure-store";
import { ethers, utils } from "ethers";

export class LocalWallet extends LocalWalletCore {
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

export const localWallet = () => {
  const secureStorage = new SecureStorage();
  return {
    id: LocalWallet.id,
    meta: LocalWallet.meta,
    create: (options: WalletOptions) =>
      new LocalWallet({
        ...options,
        walletStorage: secureStorage,
      }) as LocalWalletCore,
  } satisfies Wallet;
};
