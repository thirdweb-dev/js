import { AbstractClientWallet, walletIds } from "@thirdweb-dev/wallets";
import {
  MagicConnectorOptions,
  MagicLinkOptions,
} from "../connectors/magic/types";
import type { MagicConnector as MagicConnectorType } from "../connectors/magic/magic-connector";
import { MagicConnector } from "../connectors/magic/magic-connector";

/**
 * @deprecated We have deprecated magicLink in favor of our embeddedWallet which adds support for more sign in methods.
 * To learn more, please see:
 *
 * Our release notes: https://portal.thirdweb.com/embedded-wallet
 *
 * Our documentation: https://portal.thirdweb.com/react-native/react-native.embeddedwallet
 */
export class MagicLink extends AbstractClientWallet<
  MagicLinkOptions,
  MagicConnectorOptions
> {
  connector?: MagicConnectorType;
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
    this.connector = new MagicConnector({
      ...this.options,
      chainId: this.options.chainId,
      chains: this.chains,
    });

    return this.connector;
  }

  getMagicSDK() {
    return (this.connector as MagicConnector)?.getMagicSDK();
  }

  async autoConnect(options?: MagicConnectorOptions) {
    this.connector?.initializeMagicSDK(options);
    const magic = this.getMagicSDK();
    if (await magic.user.isLoggedIn()) {
      return super.autoConnect(options);
    } else {
      throw new Error("Magic user is not logged in");
    }
  }

  async disconnect() {
    const magic = this.getMagicSDK();
    await magic.user.logout();
    return super.disconnect();
  }
}

/**
 * @deprecated Use `MagicLink` instead
 *
 * Renamed for consistency with our React package
 */
export class MagicWallet extends MagicLink {}
