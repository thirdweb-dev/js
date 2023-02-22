import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";

export class WalletConnect extends AbstractBrowserWallet {
  connector?: TWConnector;

  static id = "walletConnect" as const;

  public get walletName() {
    return "WalletConnect" as const;
  }

  constructor(options: WalletOptions) {
    super(WalletConnect.id, options);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { WalletConnectConnector } = await import(
        "../connectors/wallet-connect"
      );
      this.connector = new WagmiAdapter(
        new WalletConnectConnector({
          chains: this.chains,
          options: {},
        }),
      );
    }
    return this.connector;
  }
}
