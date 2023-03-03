import type {
  CoinbaseMobileWalletConnector,
  CoinbaseMobileWalletConnectorOptions,
} from "../connectors/coinbase-wallet-mobile";
import {
  AbstractBrowserWallet,
  TWConnector,
  WagmiAdapter,
  WalletOptions,
} from "@thirdweb-dev/wallets";

export class CoinbaseWalletMobile extends AbstractBrowserWallet<CoinbaseMobileWalletConnectorOptions> {
  connector?: TWConnector;
  coinbaseConnector?: CoinbaseMobileWalletConnector;

  static id = "coinbaseWalletMobile" as const;
  public get walletName() {
    return "Coinbase Wallet Mobile" as const;
  }

  constructor(options: WalletOptions<CoinbaseMobileWalletConnectorOptions>) {
    super(CoinbaseWalletMobile.id, options);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { CoinbaseMobileWalletConnector } = await import(
        "../connectors/coinbase-wallet-mobile"
      );

      const cbConnector = new CoinbaseMobileWalletConnector({
        chains: this.chains,
        options: {
          ...this.options,
        },
      });

      cbConnector.on("connect", () => {});

      this.coinbaseConnector = cbConnector;
      this.connector = new WagmiAdapter(cbConnector);
    }
    return this.connector;
  }
}
