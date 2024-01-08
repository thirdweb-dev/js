import { walletIds } from "../constants/walletIds";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";

/**
 * Wallet Interface to connect [Frame Wallet](https://frame.sh/)
 *
 * @example
 * ```javascript
 * import { FrameWallet } from "@thirdweb-dev/wallets";
 *
 * const wallet = new FrameWallet();
 *
 * wallet.connect();
 * ```
 * @wallet
 */
export class FrameWallet extends AbstractClientWallet {
  /**
   * @internal
   */
  connector?: Connector;
  /**
   * @internal
   */
  static id = walletIds.frame as string;
  /**
   * @internal
   */
  public get walletName() {
    return "Frame Wallet";
  }

  /**
   * Create a `FrameWallet` instance
   * @param options -
   * The `options` object includes the following properties
   *
   * ### clientId (recommended)
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
   * ### dappMetadata
   * Information about your app that the wallet will display when your app tries to connect to it.
   *
   * Must be an object containing `name`, `url`, and optionally `description` and `logoUrl` properties.
   *
   * ```javascript
   * import { FrameWallet } from "@thirdweb-dev/wallets";
   *
   * const walletWithOptions = new FrameWallet({
   *   dappMetadata: {
   *     name: "thirdweb powered dApp",
   *     url: "https://thirdweb.com",
   *     description: "thirdweb powered dApp",
   *     logoUrl: "https://thirdweb.com/favicon.ico",
   *   },
   * });
   * ```
   */
  constructor(options?: WalletOptions) {
    super(FrameWallet.id, options);
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // import the connector dynamically
      const { FrameConnector } = await import("../connectors/frame");
      this.connector = new WagmiAdapter(
        new FrameConnector({
          chains: this.chains,
          connectorStorage: this.walletStorage,
          options: {
            shimDisconnect: true,
          },
        }),
      );
    }
    return this.connector;
  }
}
