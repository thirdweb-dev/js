import { noopStorage } from "../../../core/AsyncStorage";
import { walletsMetadata } from "../../constants/walletsMetadata";
import { IWalletWithMetadata, WalletMeta } from "../../types/wallets";
import type {
  CoinbaseWalletConnector,
  CoinbaseWalletConnectorOptions,
} from "../connectors/coinbase-wallet";
import {
  AbstractBrowserWallet,
  TWConnector,
  WagmiAdapter,
  WalletOptions,
} from "@thirdweb-dev/wallets";

type CoinbaseWalletOptions = Omit<
  WalletOptions<CoinbaseWalletConnectorOptions>,
  "callbackURL" | "walletStorage"
>;

export class CoinbaseWallet
  extends AbstractBrowserWallet<CoinbaseWalletConnectorOptions>
  implements IWalletWithMetadata
{
  connector?: TWConnector;
  coinbaseConnector?: CoinbaseWalletConnector;
  provider?: CoinbaseWalletConnector["provider"];

  static id = "coinbaseWallet" as const;
  public get walletName() {
    return "Coinbase Wallet" as const;
  }

  constructor(options: CoinbaseWalletOptions) {
    super(CoinbaseWallet.id, {
      ...options,
      callbackURL: new URL("https://thirdweb.com"),
      walletStorage: new noopStorage(),
      walletId: "coinbase",
    });
  }

  getMetadata(): WalletMeta {
    return walletsMetadata.coinbase as WalletMeta;
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { CoinbaseWalletConnector: CoinbaseWalletConnector } = await import(
        "../connectors/coinbase-wallet"
      );

      const cbConnector = new CoinbaseWalletConnector({
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
