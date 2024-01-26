import type { WalletConnectConnector as WalletConnectConnectorType } from "../connectors/wallet-connect";
import type { QRModalOptions } from "../connectors/wallet-connect/qrModalOptions";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { MetaMaskConnector as MetamaskConnectorType } from "../connectors/metamask";
import { walletIds } from "../constants/walletIds";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import { getInjectedMetamaskProvider } from "../connectors/metamask/getInjectedMetamaskProvider";

export type MetamaskAdditionalOptions = {
  /**
   * Whether to open the default Wallet Connect QR code Modal for connecting to MetaMask Wallet on mobile if MetaMask is not injected when calling connect().
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
   * WalletConnect's [options](https://docs.walletconnect.com/advanced/walletconnectmodal/options) to customize the QR Code Modal.
   */
  qrModalOptions?: QRModalOptions;
};

export type MetamaskWalletOptions = WalletOptions<MetamaskAdditionalOptions>;

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

/**
 * Wallet interface for connecting to [MetaMask Wallet](https://metamask.io/) extension or mobile app.
 *
 * @example
 * ```ts
 * import { MetaMaskWallet } from "@thirdweb-dev/wallets";
 *
 * async function connectMetaMask() {
 *   const wallet = new MetaMaskWallet();
 *   await wallet.connect();
 * }
 * ```
 *
 * @wallet
 */
export class MetaMaskWallet extends AbstractClientWallet<MetamaskAdditionalOptions> {
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
  metamaskConnector?: MetamaskConnectorType;
  /**
   * @internal
   */
  isInjected: boolean;

  /**
   * @internal
   */
  static meta = {
    name: "MetaMask",
    iconURL:
      "ipfs://QmZZHcw7zcXursywnLDAyY6Hfxzqop5GKgwoq8NB9jjrkN/metamask.svg",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
      android: "https://play.google.com/store/apps/details?id=io.metamask",
      ios: "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202",
    },
  };

  /**
   * @internal
   */
  static id = walletIds.metamask as string;

  /**
   * @internal
   */
  public get walletName() {
    return "MetaMask" as const;
  }

  /**
   * @param options -
   * The `options` object contains the following properties:
   *
   * ### clientId (recommended)
   * Provide clientId to use the thirdweb RPCs for given chains
   * You can create a client ID for your application from thirdweb dashboard.
   *
   * Provide `clientId` to use the thirdweb RPCs for given `chains`
   *
   * You can create a client ID for your application from [thirdweb dashboard](https://thirdweb.com/create-api-key).
   *
   * ### projectId (recommended)
   * This is only relevant if you want to use [WalletConnect](https://walletconnect.com/) for connecting to MetaMask mobile app when MetaMask is not injected.
   *
   * This `projectId` can be obtained at [cloud.walletconnect.com](https://cloud.walletconnect.com/). It is highly recommended to use your own project id and only use the default one for testing purposes.
   *
   * ### chains (optional)
   * Provide an array of chains you want to support.
   *
   * Must be an array of `Chain` objects, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   * Defaults to `defaultChains` ( `import { defaultChains } from "@thirdweb-dev/chains"` )
   *
   *
   * ### dappMetadata (optional)
   * Information about your app that the wallet will display when your app tries to connect to it.
   *
   * Must be an object containing `name`, `url`, and optionally `description` and `logoUrl` properties.
   *
   * ```javascript
   * import { MetaMaskWallet } from "@thirdweb-dev/wallets";
   *
   * const walletWithOptions = new MetaMaskWallet({
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
   * Whether to display the Wallet Connect QR code Modal for connecting to MetaMask on mobile if MetaMask is not injected.
   *
   * Must be a `boolean`. Defaults to `true`.
   *
   * ### qrModalOptions
   * options to customize the Wallet Connect QR Code Modal ( only relevant when qrcode is true )
   */
  constructor(options: MetamaskWalletOptions) {
    super(MetaMaskWallet.id, options);
    this.isInjected = !!getInjectedMetamaskProvider();
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // if metamask is injected, use the injected connector
      // otherwise, use the wallet connect connector for using the metamask app on mobile via QR code scan

      if (this.isInjected) {
        // import the connector dynamically
        const { MetaMaskConnector } = await import("../connectors/metamask");
        const metamaskConnector = new MetaMaskConnector({
          chains: this.chains,
          connectorStorage: this.walletStorage,
          options: {
            shimDisconnect: true,
          },
        });

        this.metamaskConnector = metamaskConnector;

        this.connector = new WagmiAdapter(metamaskConnector);
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
   * Connect to the MetaMask wallet using a QR code if the user does not have the Metamask extension installed.
   *
   * You can use this method to display a QR code. User can scan the QR code from the MetaMask mobile app to connect to your dapp.
   *
   * @example
   * ```typescript
   * metamask.connectWithQrCode({
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
   * If provided, MetaMask will prompt the user to switch to the network with the given `chainId` after connecting.
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

  /**
   * MetaMask extension on desktop supports switching accounts.
   * This method will trigger the MetaMask extension to show the account switcher Modal
   */
  async switchAccount() {
    if (!this.metamaskConnector) {
      throw new Error("Can not switch Account");
    }

    await this.metamaskConnector.switchAccount();
  }
}
