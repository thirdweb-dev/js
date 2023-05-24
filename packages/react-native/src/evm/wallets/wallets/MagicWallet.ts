import { AbstractClientWallet, walletIds } from "@thirdweb-dev/wallets";
import {
  MagicConnectorOptions,
  MagicLinkOptions,
} from "../connectors/magic/types";
import type { MagicConnector as MagicConnectorType } from "../connectors/magic/magic-connector";
import { MagicConnector } from "../connectors/magic/magic-connector";

export class MagicWallet extends AbstractClientWallet<
  MagicLinkOptions,
  MagicConnectorOptions
> {
  connector: MagicConnectorType | undefined;
  options: MagicLinkOptions;

  static meta = {
    iconURL:
      "ipfs://QmUMBFZGXxBpgDmZzZAHhbcCL5nYvZnVaYLTajsNjLcxMU/1-Icon_Magic_Color.svg",
    name: "Magic Link",
  };

  static id = walletIds.magicLink;

  constructor(options: MagicLinkOptions) {
    super(walletIds.magicLink, options);

    this.options = options;

    this.initializeConnector();
  }

  async getConnector(): Promise<MagicConnectorType> {
    if (!this.connector) {
      return await this.initializeConnector();
    }
    return this.connector;
  }

  // my methods

  initializeConnector() {
    console.log("initializeConnector", this.options);
    this.connector = new MagicConnector({
      ...this.options,
    });

    return this.connector;
  }

  getMagicSDK() {
    return (this.connector as MagicConnector)?.getMagicSDK();
  }
}
