import {
  LocalWallet as LocalWalletCore,
  Connector,
  walletIds,
} from "@thirdweb-dev/wallets";
import { ConfiguredWallet, ConnectUIProps } from "@thirdweb-dev/react-core";
import type { WalletOptions } from "@thirdweb-dev/wallets";
import { ethers, utils } from "ethers";
import { createSecureStorage } from "../../../core/SecureStorage";
import { createAsyncLocalStorage } from "../../../core/AsyncStorage";
import { LocalWalletFlow } from "../../components/ConnectWalletFlow/LocalWalletFlow";

export class LocalWallet extends LocalWalletCore {
  static meta = {
    id: walletIds.localWallet,
    name: "Guest Wallet",
    iconURL:
      "ipfs://QmQAyJG3y2wZf9u6JXxn8U9Kd1ZVfjtQkf5aua8FcWr8Gm/local-wallet-mobile.svg",
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

  protected async getConnector(): Promise<Connector> {
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

export const localWallet = (): ConfiguredWallet => {
  const secureStorage = createSecureStorage(walletIds.localWallet);
  const asyncStorage = createAsyncLocalStorage(walletIds.localWallet);
  const configuredWallet = {
    id: LocalWallet.id,
    meta: LocalWallet.meta,
    create: (options: WalletOptions) =>
      new LocalWallet({
        ...options,
        walletStorage: asyncStorage,
        storage: secureStorage,
      }) as LocalWalletCore,
    connectUI(props: ConnectUIProps) {
      return <LocalWalletFlow {...props} localWallet={configuredWallet} />;
    },
    isInstalled() {
      // TODO
      return false;
    },
  };

  return configuredWallet;
};
