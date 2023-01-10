import type { WalletConnectConnector } from "../connectors/wallet-connect";
import { AbstractWallet, WalletOptions } from "./base";

export class WalletConnect extends AbstractWallet {
  #connector?: WalletConnectConnector;

  static id = "walletConnect" as const;

  public get walletName() {
    return this.#connector?.name || ("WalletConnect" as const);
  }

  constructor(options: WalletOptions) {
    super(WalletConnect.id, options);
  }

  protected async getConnector(): Promise<WalletConnectConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { WalletConnectConnector } = await import(
        "../connectors/wallet-connect"
      );
      this.#connector = new WalletConnectConnector({
        chains: this.chains,
        options: {},
      });
    }
    return this.#connector;
  }
}
