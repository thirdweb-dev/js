import { ThirdwebWalletConnector } from "../connectors/thirdweb";
import {
  ThirdwebWalletAdditionalOptions,
  ThirdwebWalletConnectionArgs,
} from "../connectors/thirdweb/types";
import { walletIds } from "../constants/walletIds";
import { Connector } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";

export type ThirdwebWalletOptions =
  WalletOptions<ThirdwebWalletAdditionalOptions>;

export class ThirdwebWallet extends AbstractClientWallet<
  ThirdwebWalletAdditionalOptions,
  ThirdwebWalletConnectionArgs
> {
  connector?: Connector;

  static id = walletIds.thirdweb;

  static meta = {
    name: "thirdweb wallet",
    iconURL:
      // TODO: replace with thirdweb logo
      "ipfs://QmNrLXtPoFrh4yjZbXui39zUMozS1oetpgU8dvZhFAxfRa/paper-logo-icon.svg",
  };

  public get walletName() {
    return "thirdweb Wallet" as const;
  }

  thirdwebClientId: ThirdwebWalletAdditionalOptions["thirdwebClientId"];
  chain: ThirdwebWalletAdditionalOptions["chain"];

  constructor(options: ThirdwebWalletOptions) {
    super(ThirdwebWallet.id, {
      ...options,
    });

    this.thirdwebClientId = options.thirdwebClientId;
    this.chain = options.chain;
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      this.connector = new ThirdwebWalletConnector({
        clientId: this.thirdwebClientId,
        chain: this.chain,
        chains: this.chains,
        styles: this.options?.styles,
      });
    }
    return this.connector;
  }

  async getEmail() {
    const connector = (await this.getConnector()) as ThirdwebWalletConnector;
    return connector.getEmail();
  }
}
