import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import { Buffer } from "buffer";

// Coinbase SDK uses Buffer which requires a global polyfill
window.Buffer = Buffer;

export class CoinbaseWallet extends AbstractBrowserWallet<{
  darkMode: boolean;
}> {
  connector?: TWConnector;

  static id = "coinbaseWallet" as const;
  public get walletName() {
    return "Coinbase Wallet" as const;
  }

  constructor(options: WalletOptions<{ darkMode: boolean }>) {
    super(CoinbaseWallet.id, options);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { CoinbaseWalletConnector } = await import(
        "../connectors/coinbase-wallet"
      );
      this.connector = new WagmiAdapter(
        new CoinbaseWalletConnector({
          chains: this.chains,
          options: {
            appName: this.options.appName,
            reloadOnDisconnect: false,
            darkMode: this.options.darkMode,
          },
        }),
      );
    }
    return this.connector;
  }
}
