import { noopStorage } from "../../../core/AsyncStorage";
import { walletsMetadata } from "../../constants/walletsMetadata";
import { WalletMeta } from "../../types/wallet";
import type {
  CoinbaseMobileWalletConnector,
  CoinbaseMobileWalletConnectorOptions,
} from "../connectors/coinbase-wallet-mobile";
import { IWalletWithMetadata } from "./wallets";
import {
  AbstractBrowserWallet,
  TWConnector,
  WagmiAdapter,
  WalletOptions,
} from "@thirdweb-dev/wallets";

type CoinbaseWalletOptions = Omit<
  WalletOptions<CoinbaseMobileWalletConnectorOptions>,
  "callbackURL" | "walletStorage"
>;

export class CoinbaseWalletMobile
  extends AbstractBrowserWallet<CoinbaseMobileWalletConnectorOptions>
  implements IWalletWithMetadata
{
  connector?: TWConnector;
  coinbaseConnector?: CoinbaseMobileWalletConnector;
  provider?: CoinbaseMobileWalletConnector["provider"];

  static id = "coinbaseWalletMobile" as const;
  public get walletName() {
    return "Coinbase Wallet Mobile" as const;
  }

  constructor(options: CoinbaseWalletOptions) {
    super(CoinbaseWalletMobile.id, {
      ...options,
      callbackURL: new URL("https://thirdweb.com"),
      walletStorage: new noopStorage(),
    });
  }

  getMetadata(): WalletMeta {
    return walletsMetadata.coinbase as WalletMeta;
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
      this.provider = await this.coinbaseConnector.getProvider();
    }
    return this.connector;
  }
}
