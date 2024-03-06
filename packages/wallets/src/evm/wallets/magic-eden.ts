import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import { walletIds } from "../constants/walletIds";
import { getInjectedMagicEdenProvider } from "../connectors/magic-eden/getInjectedMagicEdenProvider";

export type MagicEdenOptions = WalletOptions;

/**
 * Wallet interface to connect [Magic Eden](https://wallet.magiceden.io/) extension or mobile app
 *
 * @example
 * ```ts
 * import { MagicEdenWallet } from "@thirdweb-dev/wallets";
 *
 * const wallet = new MagicEdenWallet();
 *
 * wallet.connect();
 * ```
 *
 * @wallet
 */
export class MagicEdenWallet extends AbstractClientWallet {
  /**
   * @internal
   */
  connector?: Connector;
  /**
   * @internal
   */
  isInjected: boolean;
  /**
   * @internal
   */
  static id = walletIds.magicEden as string;
  /**
   * @internal
   */
  public get walletName() {
    return "Magic Eden" as const;
  }

  /**
   * Create instance of `MagicEdenWallet`
   *
   * @param options - The `options` object contains the following properties:
   * ### clientId (recommended)
   *
   * Provide `clientId` to use the thirdweb RPCs for given `chains`
   *
   * You can create a client ID for your application from [thirdweb dashboard](https://thirdweb.com/create-api-key).
   *
   * ### chains (optional)
   * Provide an array of chains you want to support.
   *
   * Must be an array of `Chain` objects, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   * Defaults to our [default chains](/react/react.thirdwebprovider#default-chains).
   *
   * ### dappMetadata (optional)
   * Information about your app that the wallet will display when your app tries to connect to it.
   *
   * Must be an object containing `name`, `url`, and optionally `description` and `logoUrl` properties.
   *
   * ```javascript
   * import { MagicEdenWallet } from "@thirdweb-dev/wallets";
   *
   * const wallet = new MagicEdenWallet({
   *   dappMetadata: {
   *     name: "thirdweb powered dApp",
   *     url: "https://thirdweb.com",
   *     description: "thirdweb powered dApp",
   *     logoUrl: "https://thirdweb.com/favicon.ico",
   *   },
   * });
   * ```
   */
  constructor(options: MagicEdenOptions) {
    super(MagicEdenWallet.id, options);
    this.isInjected = !!getInjectedMagicEdenProvider();
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const { MagicEdenConnector } = await import("../connectors/magic-eden");
      const connector = new MagicEdenConnector({
        chains: this.chains,
        connectorStorage: this.walletStorage,
        options: {
          shimDisconnect: true,
        },
      });

      this.connector = new WagmiAdapter(connector);
    }

    return this.connector;
  }
}
