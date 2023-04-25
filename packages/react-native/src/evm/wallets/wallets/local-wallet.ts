import {
  LocalWallet as LocalWalletCore,
  TWConnector,
} from "@thirdweb-dev/wallets";
import { Wallet } from "@thirdweb-dev/react-core";
import type { WalletOptions } from "@thirdweb-dev/wallets";
import { ethers, utils } from "ethers";
import { createSecureStorage } from "../../../core/SecureStorage";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";

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
          encryption: false,
        });
      } else {
        this.ethersWallet = new ethers.Wallet(data.data);
      }
    }

    return super.getConnector();
  }
}

export const localWallet = () => {
  const secureStorage = createSecureStorage("localwallet");
  const asyncStorage = createAsyncLocalStorage("localwallet");
  return {
    id: LocalWallet.id,
    meta: LocalWallet.meta,
    create: (options: WalletOptions) =>
      new LocalWallet({
        ...options,
        walletStorage: asyncStorage,
        storage: secureStorage,
      }) as LocalWalletCore,
  } satisfies Wallet;
};
