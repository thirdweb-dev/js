import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";

export class CoinbaseWallet extends AbstractBrowserWallet {
  #connector?: TWConnector;

  static id = "coinbaseWallet" as const;
  public get walletName() {
    return "Coinbase Wallet" as const;
  }

  constructor(options: WalletOptions) {
    super(CoinbaseWallet.id, options);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { CoinbaseWalletConnector } = await import(
        "../connectors/coinbase-wallet"
      );
      this.#connector = new WagmiAdapter(
        new CoinbaseWalletConnector({
          chains: this.chains,
          options: {
            appName: this.options.dappMetadata.name,
            reloadOnDisconnect: false,
          },
        }),
      );
    }
    return this.#connector;
  }
}
