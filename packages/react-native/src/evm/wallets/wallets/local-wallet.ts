import {
  LocalWallet as LocalWalletCore,
  TWConnector,
  walletIds,
} from "@thirdweb-dev/wallets";
import { Wallet } from "@thirdweb-dev/react-core";
import type { WalletOptions } from "@thirdweb-dev/wallets";
import { ethers, utils } from "ethers";
import { createSecureStorage } from "../../../core/SecureStorage";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";

export class LocalWallet extends LocalWalletCore {
  static meta = {
    id: walletIds.localWallet,
    name: "Guest Wallet",
    iconURL:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/local-wallet-mobile.svg",
  };

  getMeta() {
    return LocalWallet.meta;
  }

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
  const secureStorage = createSecureStorage(walletIds.localWallet);
  const asyncStorage = createAsyncLocalStorage(walletIds.localWallet);
  return {
    id: LocalWallet.id,
    meta: {
      name: "Guest Wallet",
      iconURL:
        "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/local-wallet-mobile.svg",
    },
    create: (options: WalletOptions) =>
      new LocalWallet({
        ...options,
        walletStorage: asyncStorage,
        storage: secureStorage,
      }) as LocalWalletCore,
  } satisfies Wallet;
};
