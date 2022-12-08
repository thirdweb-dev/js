import type { MagicAuthConnector, MagicAuthOptions } from "../connectors/magic";
import { AbstractWallet, WalletOptions } from "./base";

export class MagicAuthWallet extends AbstractWallet<MagicAuthOptions> {
  #connector?: MagicAuthConnector;

  static id = "magicAuth" as const;

  public get walletName() {
    return this.#connector?.name || ("MagicAuth" as const);
  }

  constructor(options: WalletOptions<MagicAuthOptions>) {
    super(MagicAuthWallet.id, options);
  }

  protected async getConnector(): Promise<MagicAuthConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { MagicAuthConnector } = await import("../connectors/magic");
      this.#connector = new MagicAuthConnector({
        chains: this.chains,
        options: this.options,
      });
    }
    return this.#connector;
  }
}
