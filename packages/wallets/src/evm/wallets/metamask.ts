import type { WalletConnectConnector as WalletConnectConnectorType } from "../connectors/wallet-connect";
import type { QRModalOptions } from "../connectors/wallet-connect/qrModalOptions";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { MetaMaskConnector as MetamaskConnectorType } from "../connectors/metamask";
import { walletIds } from "../constants/walletIds";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import { getInjectedMetamaskProvider } from "../connectors/metamask/getInjectedMetamaskProvider";

type MetamaskAdditionalOptions = {
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

export type MetamaskWalletOptions = WalletOptions<MetamaskAdditionalOptions>;

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
  onConnectFailed: () => void;
};

export class MetaMaskWallet extends AbstractClientWallet<MetamaskAdditionalOptions> {
  connector?: Connector;
  walletConnectConnector?: WalletConnectConnectorType;
  metamaskConnector?: MetamaskConnectorType;
  isInjected: boolean;

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

  static id = walletIds.metamask;

  public get walletName() {
    return "MetaMask" as const;
  }

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
   * connect to wallet with QR code
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
    this.connect({ chainId: options.chainId })
      .then(options.onConnected)
      .catch(options.onConnectFailed);
  }

  async switchAccount() {
    if (!this.metamaskConnector) {
      throw new Error("Can not switch Account");
    }

    await this.metamaskConnector.switchAccount();
  }
}
