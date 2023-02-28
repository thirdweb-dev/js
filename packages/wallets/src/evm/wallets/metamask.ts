import { AsyncStorage } from "../../core/AsyncStorage";
import { WalletConnectV1Connector } from "../connectors/wallet-connect-v1";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";

export type MetamaskWalletOptions = WalletOptions<{
  connectorStorage: AsyncStorage;
  isInjected?: boolean;
}>;

type ConnectWithQrCodeArgs = {
  chainId: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export class MetaMask extends AbstractBrowserWallet {
  connector?: TWConnector;
  connectorStorage: AsyncStorage;
  isInjected?: boolean;
  walletConnectConnector?: WalletConnectV1Connector;

  static id = "metamask" as const;

  public get walletName() {
    return "MetaMask" as const;
  }

  constructor(options: MetamaskWalletOptions) {
    super(MetaMask.id, options);
    this.connectorStorage = options.connectorStorage;
    this.isInjected = options.isInjected || false;
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { MetaMaskConnector } = await import("../connectors/metamask");

      // if metamask is injected, use the injected connector
      // otherwise, use the wallet connect connector for using the metamask app on mobile via QR code scan

      if (this.isInjected) {
        const metamaskConnector = new MetaMaskConnector({
          chains: this.chains,
          connectorStorage: this.connectorStorage,
          options: {
            shimDisconnect: true,
          },
        });

        this.connector = new WagmiAdapter(metamaskConnector);
      } else {
        const walletConnectConnector = new WalletConnectV1Connector({
          chains: this.chains,
          storage: this.connectorStorage,
          options: {
            clientMeta: {
              name: this.options.dappMetadata.name,
              description: this.options.dappMetadata.description || "",
              url: this.options.dappMetadata.url,
              icons: [],
            },
            qrcode: false,
          },
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
    wcProvider.connector.on(
      "display_uri",
      (error, payload: { params: string[] }) => {
        options.onQrCodeUri(payload.params[0]);
      },
    );

    // trigger the display_uri event to get the QR code
    await wcProvider.enable();
    // connected to app here

    // trigger connect flow
    this.connect({ chainId: options.chainId }).then(options.onConnected);
  }
}
