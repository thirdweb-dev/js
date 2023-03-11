import type { MagicAuthOptions } from "../connectors/magic";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";

export class MagicAuthWallet extends AbstractBrowserWallet<MagicAuthOptions> {
  connector?: TWConnector;

  static id = "magicAuth" as const;

  public get walletName() {
    return "MagicAuth" as const;
  }

  constructor(options: WalletOptions<MagicAuthOptions>) {
    super(MagicAuthWallet.id, options);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { MagicAuthConnector } = await import("../connectors/magic");
      this.connector = new WagmiAdapter(
        new MagicAuthConnector({
          chains: this.chains,
          options: this.options,
        }),
      );
    }
    return this.connector;
  }
}
