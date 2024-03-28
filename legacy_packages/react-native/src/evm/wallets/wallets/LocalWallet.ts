import {
  LocalWallet as LocalWalletCore,
  Connector,
} from "@thirdweb-dev/wallets";
import { ethers, utils } from "ethers";
import { LOCAL_WALLET_ICON } from "../../assets/svgs";

export class LocalWallet extends LocalWalletCore {
  static meta = {
    name: "Guest Wallet",
    iconURL: LOCAL_WALLET_ICON,
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
