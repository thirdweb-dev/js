import type { ZerionConnector } from "../connectors/zerion";
import type { WalletConnectConnector as WalletConnectConnectorType } from "../connectors/wallet-connect";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import { assertWindowEthereum } from "../utils/assertWindowEthereum";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import { QRModalOptions } from "../connectors/wallet-connect/qrModalOptions";

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

type ZerionAdditionalOptions = {
  /**
   * Whether to open the default Wallet Connect QR code Modal for connecting to Zerion Wallet on mobile if Zerion is not injected when calling connect().
   */
  qrcode?: boolean;

  /**
   * When connecting MetaMask using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * options to customize the Wallet Connect QR Code Modal ( only relevant when qrcode is true )
   *
   * https://docs.walletconnect.com/2.0/web3modal/options
   */
  qrModalOptions?: QRModalOptions;
};

/**
 * Wallet interface to connect [Zerion Wallet](https://zerion.io/) extension or mobile app.
 *
 * @example
 * ```javascript
 * import { ZerionWallet } from "@thirdweb-dev/wallets";
 *
 * const wallet = new ZerionWallet();
 *
 * wallet.connect();
 * ```
 * @wallet
 */
export class ZerionWallet extends AbstractClientWallet<ZerionAdditionalOptions> {
  /**
   * @internal
   */
  connector?: Connector;
  /**
   * @internal
   */
  zerionConnector?: ZerionConnector;
  /**
   * @internal
   */
  walletConnectConnector?: WalletConnectConnectorType;
  /**
   * @internal
   */
  isInjected: boolean;

  /**
   * @internal
   */
  static id = "zerion" as string;
  /**
   * @internal
   */
  static meta = {
    name: "Zerion Wallet",
    iconURL: "ipfs://Qmb1LhNtMUkzbgk1V8ZiUSRXjMJGRkS5HH3R71KyRgjdBG/zerion.png",
    urls: {
      chrome: "https://zerion.io/extension",
      android: "https://link.zerion.io/901o6IN0jqb",
      ios: "https://link.zerion.io/a11o6IN0jqb",
    },
  };
  /**
   * @internal
   */
  public get walletName() {
    return "Zerion Wallet";
  }

  /**
   * Create an instance of `ZerionWallet`.
   * @param options -
   * The `options` object includes the following properties:
   *
   * ### clientId (recommended)
   * Provide `clientId` to use the thirdweb RPCs for given `chains`
   *
   * You can create a client ID for your application from [thirdweb dashboard](https://thirdweb.com/create-api-key).
   *
   *
   * ### projectId (recommended)
   * This is only relevant if you want to use [WalletConnect](https://walletconnect.com/) for connecting to Zerion wallet mobile app when MetaMask is not injected.
   *
   * This `projectId` can be obtained at [cloud.walletconnect.com](https://cloud.walletconnect.com/). It is highly recommended to use your own project id and only use the default one for testing purposes.
   *
   * ### qrcode
   * Whether to open the default Wallet Connect QR code Modal for connecting to Zerion Wallet on mobile
   * (if Zerion is not injected when calling `connect()`).
   *
   * Must be a `boolean`. Defaults to `false`.
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
   * ```javascript
   * import { ZerionWallet } from "@thirdweb-dev/wallets";
   *
   * const wallet = new ZerionWallet({
   *   dappMetadata: {
   *     name: "thirdweb powered dApp",
   *     url: "https://thirdweb.com",
   *     description: "thirdweb powered dApp",
   *     logoUrl: "https://thirdweb.com/favicon.ico",
   *   },
   * });
   * ```
   *
   * ### qrModalOptions
   * WalletConnect's [options](https://docs.walletconnect.com/advanced/walletconnectmodal/options) to customize the QR Code Modal.
   */
  constructor(options?: WalletOptions<ZerionAdditionalOptions>) {
    super(ZerionWallet.id, options);

    if (assertWindowEthereum(globalThis.window)) {
      this.isInjected = !!globalThis.window.ethereum?.isZerion;
    } else {
      this.isInjected = false;
    }
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      if (this.isInjected) {
        // import the connector dynamically
        const { ZerionConnector } = await import("../connectors/zerion");
        const zerionConnector = new ZerionConnector({
          chains: this.chains,
          connectorStorage: this.walletStorage,
          options: {
            shimDisconnect: true,
          },
        });
        this.zerionConnector = zerionConnector;
        this.connector = new WagmiAdapter(zerionConnector);
      } else {
        const { WalletConnectConnector } = await import(
          "../connectors/wallet-connect"
        );

        const walletConnectConnector = new WalletConnectConnector({
          chains: this.chains,
          options: {
            projectId: this.options?.projectId || TW_WC_PROJECT_ID, // TODO,
            storage: this.walletStorage,
            qrcode: this.options?.qrcode,
            dappMetadata: this.dappMetadata,
            qrModalOptions: this.options?.qrModalOptions,
          },
        });

        walletConnectConnector.getProvider().then((provider) => {
          provider.signer.client.on("session_request_sent", () => {
            this.emit("wc_session_request_sent");
          });
        });

        // need to save this for getting the QR code URI
        this.walletConnectConnector = walletConnectConnector;
        this.connector = new WagmiAdapter(walletConnectConnector);
      }
    }
    return this.connector;
  }

  /**
   * Connect to the wallet using a QR code.
   * You can use this method to display a QR code. The user can scan this QR code using the Zerion Wallet mobile app to connect to your dapp.
   *
   * @example
   * ```typescript
   * wallet.connectWithQrCode({
   *  chainId: 1,
   *  onQrCodeUri(qrCodeUri) {
   *    // render the QR code with `qrCodeUri`
   *  },
   *  onConnected(accountAddress)  {
   *    // update UI to show connected state
   *  },
   * })
   * ```
   *
   * @param options -
   * The options object contains the following properties/method:
   *
   * ### chainId (optional)
   * If provided, wallet will prompt the user to switch to the network with the given `chainId` after connecting.
   *
   * ### onQrCodeUri
   * A callback to get the QR code URI to display to the user.
   *
   * ### onConnected
   * A callback that is called when the user has connected their wallet using the QR code.
   */
  async connectWithQrCode(options: ConnectWithQrCodeArgs) {
    await this.getConnector();
    const wcConnector = this.walletConnectConnector;

    if (!wcConnector) {
      throw new Error("WalletConnect connector not found");
    }

    const wcProvider = await wcConnector.getProvider();

    // set a listener for display_uri event
    wcProvider.on("display_uri", (uri) => {
      options.onQrCodeUri(uri);
    });

    // trigger connect flow
    this.connect({ chainId: options.chainId }).then(options.onConnected);
  }
}
