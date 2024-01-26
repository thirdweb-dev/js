import { noopStorage } from "../../../core/AsyncStorage";
import type {
  CoinbaseWalletConnector as CoinbaseWalletConnectorType,
  CoinbaseWalletConnectorOptions,
} from "../connectors/coinbase-wallet";
import { CoinbaseWalletConnector } from "../connectors/coinbase-wallet";
import {
  AbstractClientWallet,
  Connector,
  WagmiAdapter,
  WalletOptions,
  walletIds,
} from "@thirdweb-dev/wallets";
import { WalletOptions as WalletOptionsRC } from "@thirdweb-dev/react-core";
import { COINBASE_ICON } from "../../assets/svgs";

type CoinbaseWalletOptions = Omit<
  WalletOptions<CoinbaseWalletConnectorOptions>,
  "walletStorage" | "secretKey" | "clientId"
>;

export class CoinbaseWallet extends AbstractClientWallet<CoinbaseWalletConnectorOptions> {
  static meta = {
    name: "Coinbase Wallet",
    iconURL: COINBASE_ICON,
  };

  connector?: Connector;
  coinbaseConnector?: CoinbaseWalletConnectorType;
  provider?: CoinbaseWalletConnectorType["provider"];

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

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
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

/**
 * Wallet config for the Coinbase Wallet.
 *
 * @param config - The config for the Coinbase Wallet
 * @returns The wallet config to be used by the ThirdwebProvider
 *
 * @example
 * ```jsx
 * import { ThirdwebProvider, coinbaseWallet } from "@thirdweb-dev/react-native";
 *
 * <ThirdwebProvider
 *    supportedWallets={[
 *      coinbaseWallet({
 *         callbackURL: new URL('app-redirect-url://'),
 *       }),
 *    ]}>
 *   <YourApp />
 * </ThirdwebProvider>
 * ```
 */
export const coinbaseWallet = (config?: {
  callbackURL?: URL;
  recommended?: boolean;
}) => {
  const callbackURLNonNull =
    config?.callbackURL || new URL("https://thirdweb.com/wsegue");
  return {
    id: CoinbaseWallet.id,
    meta: CoinbaseWallet.meta,
    create: (options: WalletOptionsRC) =>
      new CoinbaseWallet({ ...options, callbackURL: callbackURLNonNull }),
    config: config,
    recommended: config?.recommended,
  };
};
