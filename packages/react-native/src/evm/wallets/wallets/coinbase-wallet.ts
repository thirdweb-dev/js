import { noopStorage } from "../../../core/AsyncStorage";
import type {
  CoinbaseWalletConnector,
  CoinbaseWalletConnectorOptions,
} from "../connectors/coinbase-wallet";
import {
  AbstractClientWallet,
  TWConnector,
  WagmiAdapter,
  WalletOptions,
  walletIds,
} from "@thirdweb-dev/wallets";
import {
  Wallet,
  WalletOptions as WalletOptionsRC,
} from "@thirdweb-dev/react-core";

type CoinbaseWalletOptions = Omit<
  WalletOptions<CoinbaseWalletConnectorOptions>,
  "walletStorage"
>;

export class CoinbaseWallet extends AbstractClientWallet<CoinbaseWalletConnectorOptions> {
  static meta = {
    id: "coinbase",
    name: "Coinbase Wallet",
    iconURL:
      "ipfs://QmcJBHopbwfJcLqJpX2xEufSS84aLbF7bHavYhaXUcrLaH/coinbase.svg",
  };

  connector?: TWConnector;
  coinbaseConnector?: CoinbaseWalletConnector;
  provider?: CoinbaseWalletConnector["provider"];

  static id = walletIds.coinbase;
  public get walletName() {
    return "Coinbase Wallet" as const;
  }

  callbackURL: URL;

  constructor(options: CoinbaseWalletOptions) {
    super(CoinbaseWallet.id, {
      ...options,
      walletStorage: new noopStorage(),
      walletId: "coinbase",
    });

    this.callbackURL = options.callbackURL;
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
          callbackURL: this.callbackURL,
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

export const coinbaseWallet = (config?: { callbackURL?: URL }) => {
  const callbackURLNonNull =
    config?.callbackURL || new URL("https://thirdweb.com/wsegue");
  return {
    id: CoinbaseWallet.id,
    meta: CoinbaseWallet.meta,
    create: (options: WalletOptionsRC) =>
      new CoinbaseWallet({ ...options, callbackURL: callbackURLNonNull }),
    config: { ...config },
  } satisfies Wallet;
};
