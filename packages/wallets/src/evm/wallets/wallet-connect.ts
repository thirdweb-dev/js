import type { WagmiConnectorData } from "../../lib/wagmi-connectors/WagmiConnector";
import type { WalletConnectConnector } from "../connectors/wallet-connect";
import { QRModalOptions } from "../connectors/wallet-connect/qrModalOptions";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type WalletConnectProvider from "@walletconnect/ethereum-provider";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import { walletIds } from "../constants/walletIds";

export type WC2_QRModalOptions = QRModalOptions;

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export type WalletConnectOptions = {
  /**
   * Your project’s unique identifier that can be obtained at cloud.walletconnect.com. Enables following functionalities within Web3Modal: wallet and chain logos, optional WalletConnect RPC, support for all wallets from our Explorer and WalletConnect v2 support. Defaults to undefined.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * Whether to display the QR Code Modal.
   *
   * Defaults to `true`.
   */
  qrcode?: boolean;

  /**
   * WalletConnect's [options](https://docs.walletconnect.com/advanced/walletconnectmodal/options) to customize the QR Code Modal.
   */
  qrModalOptions?: WC2_QRModalOptions;
};

/**
 * Wallet interface to connect a wallet using [WalletConnect](https://docs.walletconnect.com/) protocol by either opening the official WalletConnect Modal or by displaying a custom QR Code.
 *
 * @example
 * ```javascript
 * import { WalletConnect } from "@thirdweb-dev/wallets";
 *
 * const wallet = new WalletConnect();
 *
 * wallet.connect();
 * ```
 *
 * @wallet
 */
export class WalletConnect extends AbstractClientWallet<WalletConnectOptions> {
  private _walletConnectConnector?: WalletConnectConnector;
  private _provider?: WalletConnectProvider;

  connector?: Connector;

  static id = walletIds.walletConnect as string;

  static meta = {
    name: "WalletConnect",
    iconURL:
      "ipfs://QmX58KPRaTC9JYZ7KriuBzeoEaV2P9eZcA3qbFnTHZazKw/wallet-connect.svg",
  };

  public get walletName() {
    return "WalletConnect" as const;
  }

  projectId: NonNullable<WalletConnectOptions["projectId"]>;
  qrcode: WalletConnectOptions["qrcode"];

  /**
   *
   * @param options -
   * The `options` object includes the following properties:
   *
   * ### projectId (recommended)
   * Your project's unique identifier. It can be obtained at [cloud.walletconnect.com](https://cloud.walletconnect.com). It is highly recommended to use your own project id and only use the default one for testing purposes.
   *
   * It enables the following functionalities within WalletConnect's web3modal:
   *
   * - wallet and chain logos
   * - optional WalletConnect RPC
   * - support for all wallets from our Explorer and WalletConnect v2 support
   *
   * Defaults to thirdweb's common project id.
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
   *
   * ### dappMetadata
   * Information about your app that the wallet will display when your app tries to connect to it.
   *
   * Must be an object containing `name`, `url`, and optionally `description` and `logoUrl` properties.
   *
   * ```javascript
   * import { WalletConnect } from "@thirdweb-dev/wallets";
   *
   * const walletWithOptions = new WalletConnect({
   *   dappMetadata: {
   *     name: "thirdweb powered dApp",
   *     url: "https://thirdweb.com",
   *     description: "thirdweb powered dApp",
   *     logoUrl: "https://thirdweb.com/favicon.ico",
   *   },
   * });
   * ```
   *
   * ### qrcode (optional)
   * Whether to display the Wallet Connect QR code Modal or not.
   *
   * Must be a `boolean`. Defaults to `true`.
   *
   * ### qrModalOptions
   * WalletConnect's [options](https://docs.walletconnect.com/advanced/walletconnectmodal/options) to customize the QR Code Modal.
   *
   */
  constructor(options?: WalletOptions<WalletConnectOptions>) {
    super(options?.walletId || WalletConnect.id, options);
    this.projectId = options?.projectId || TW_WC_PROJECT_ID;
    this.qrcode = options?.qrcode === false ? false : true;
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // import the connector dynamically
      const { WalletConnectConnector } = await import(
        "../connectors/wallet-connect"
      );

      this._walletConnectConnector = new WalletConnectConnector({
        chains: this.chains,
        options: {
          qrcode: this.qrcode,
          projectId: this.projectId,
          dappMetadata: this.dappMetadata,
          storage: this.walletStorage,
          qrModalOptions: this.options?.qrModalOptions,
        },
      });
      this.connector = new WagmiAdapter(this._walletConnectConnector);
      this._provider = await this._walletConnectConnector.getProvider();
      this._setupListeners();
    }
    return this.connector;
  }

  private _maybeThrowError = (error: any) => {
    if (error) {
      throw error;
    }
  };

  private _onConnect = (data: WagmiConnectorData<WalletConnectProvider>) => {
    this._provider = data.provider;
    if (!this._provider) {
      throw new Error("WalletConnect provider not found after connecting.");
    }
  };

  private _onDisconnect = () => {
    this._removeListeners();
  };

  private _onChange = async (payload: any) => {
    if (payload.chain) {
      // chain changed
    } else if (payload.account) {
      //account change
    }
  };

  private _onMessage = (payload: any) => {
    switch (payload.type) {
      case "display_uri":
        this.emit("display_uri", payload.data);
        break;
    }
  };

  private _onSessionRequestSent = () => {
    this.emit("wc_session_request_sent");
  };

  private _setupListeners() {
    if (!this._walletConnectConnector) {
      return;
    }
    this._removeListeners();
    this._walletConnectConnector.on("connect", this._onConnect);
    this._walletConnectConnector.on("disconnect", this._onDisconnect);
    this._walletConnectConnector.on("change", this._onChange);
    this._walletConnectConnector.on("message", this._onMessage);
    this._provider?.signer.client.on(
      "session_request_sent",
      this._onSessionRequestSent,
    );
  }

  private _removeListeners() {
    if (!this._walletConnectConnector) {
      return;
    }
    this._walletConnectConnector.removeListener("connect", this._onConnect);
    this._walletConnectConnector.removeListener(
      "disconnect",
      this._onDisconnect,
    );
    this._walletConnectConnector.removeListener("change", this._onChange);
    this._walletConnectConnector.removeListener("message", this._onMessage);
    this._provider?.signer.client.removeListener(
      "session_request_sent",
      this._onSessionRequestSent,
    );
  }

  /**
   * Connect to the wallet using a QR code.
   * You can use this method to display a QR code. User can scan this QR code from the Wallet mobile app to connect to your dapp.
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
    const wcConnector = this._walletConnectConnector;

    if (!wcConnector) {
      throw new Error("WalletConnect connector not found");
    }

    wcConnector.showWalletConnectModal = false;

    const wcProvider = await wcConnector.getProvider();

    wcProvider.on("display_uri", (uri) => {
      options.onQrCodeUri(uri);
    });

    // trigger connect flow
    this.connect({ chainId: options.chainId }).then(options.onConnected);
  }

  /**
   * @internal
   */
  async connectWithModal(options?: { chainId?: number }) {
    await this.getConnector();
    const wcConnector = this._walletConnectConnector;

    if (!wcConnector) {
      throw new Error("WalletConnect connector not found");
    }

    wcConnector.showWalletConnectModal = true;

    await wcConnector.initProvider();

    await this.connect({ chainId: options?.chainId });
  }
}
