import type { CoinbaseWalletConnector } from "../connectors/coinbase-wallet";
import { AbstractWallet, WalletOptions } from "./base";

export class CoinbaseWallet extends AbstractWallet {
  #connector?: CoinbaseWalletConnector;

  static id = "coinbaseWallet" as const;
  public get walletName() {
    return "Coinbase Wallet" as const;
  }

  constructor(options: WalletOptions) {
    super(CoinbaseWallet.id, options);
  }

  protected async getConnector(): Promise<CoinbaseWalletConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { CoinbaseWalletConnector } = await import(
        "../connectors/coinbase-wallet"
      );
      this.#connector = new CoinbaseWalletConnector({
        chains: this.chains,
        options: {
          appName: this.options.appName,
          reloadOnDisconnect: false,
        },
      });
    }
    return this.#connector;
  }
}
