import {
  LocalWallet as LocalWalletCore,
  Connector,
  walletIds,
} from "@thirdweb-dev/wallets";
import { ethers, utils } from "ethers";

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
