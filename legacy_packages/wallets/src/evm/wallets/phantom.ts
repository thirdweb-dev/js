import type { WalletConnectConnector as WalletConnectConnectorType } from "../connectors/wallet-connect";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { PhantomConnector as PhantomConnectorType } from "../connectors/phantom";
import { walletIds } from "../constants/walletIds";
import { getInjectedPhantomProvider } from "../connectors/phantom/getInjectedPhantomProvider";

type PhantomWalletOptions = WalletOptions;

/**
 * Wallet interface to connect [Phantom Wallet](https://phantom.app/)
 *
 * @example
 * ```javascript
 * import { PhantomWallet } from "@thirdweb-dev/wallets";
 *
 * const wallet = new PhantomWallet();
 *
 * wallet.connect();
 * ```
 *
 * @wallet
 */
export class PhantomWallet extends AbstractClientWallet {
  /**
   * @internal
   */
  connector?: Connector;
  /**
   * @internal
   */
  walletConnectConnector?: WalletConnectConnectorType;
  /**
   * @internal
   */
  phantomConnector?: PhantomConnectorType;
  /**
   * @internal
   */
  isInjected: boolean;

  /**
   * @internal
   */
  static meta = {
    name: "Phantom",
    iconURL:
      "ipfs://bafybeibkpca5nwxpsjrtuxmz2ckb5lyc2sl2abg5f7dnvxku637vvffjti",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
      // not specifiying theme because they can't be used to connect
      // android: "https://play.google.com/store/apps/details?id=app.phantom",
      // ios: "https://apps.apple.com/us/app/phantom-crypto-wallet/id1598432977",
    },
  };

  /**
   * @internal
   */
  static id = walletIds.phantom as string;

  /**
   * @internal
   */
  public get walletName() {
    return "Phantom" as const;
  }

  /**
   * Create a `PhantomWallet` instance
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
   * ### dappMetadata (optional)
   * Information about your app that the wallet will display when your app tries to connect to it.
   *
   * Must be an object containing `name`, `url`, and optionally `description` and `logoUrl` properties.
   *
   * ```javascript
   * import { PhantomWallet } from "@thirdweb-dev/wallets";
   *
   * const walletWithOptions = new PhantomWallet({
   *   dappMetadata: {
   *     name: "thirdweb powered dApp",
   *     url: "https://thirdweb.com",
   *     description: "thirdweb powered dApp",
   *     logoUrl: "https://thirdweb.com/favicon.ico",
   *   },
   * });
   * ```
   */
  constructor(options: PhantomWalletOptions) {
    super(PhantomWallet.id, options);
    this.isInjected = !!getInjectedPhantomProvider();
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const { PhantomConnector } = await import("../connectors/phantom");
      const phantomConnector = new PhantomConnector({
        chains: this.chains,
        connectorStorage: this.walletStorage,
        options: {
          shimDisconnect: true,
        },
      });

      this.phantomConnector = phantomConnector;
      this.connector = new WagmiAdapter(phantomConnector);
    }

    return this.connector;
  }
}
