import { AsyncStorage, createAsyncLocalStorage } from "../../core/AsyncStorage";
import type { WalletConnectV1Connector as WalletConnectV1ConnectorType } from "../connectors/wallet-connect-v1";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { assertWindowEthereum } from "../utils/assertWindowEthereum";
import { AbstractBrowserWallet, WalletOptions } from "./base";

type MetamaskAdditionalOptions = {
  /**
   * Storage interface to store whether metamask is connected or disconnected.
   */
  connectorStorage?: AsyncStorage;
  /**
   * Whether to display the Wallet Connect QR code Modal for connecting to MetaMask on mobile if MetaMask is not injected.
   */
  qrcode?: boolean;
};

export type MetamaskWalletOptions = WalletOptions<MetamaskAdditionalOptions>;

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export class MetaMaskWallet extends AbstractBrowserWallet<MetamaskAdditionalOptions> {
  connector?: TWConnector;
  connectorStorage: AsyncStorage;
  walletConnectConnector?: WalletConnectV1ConnectorType;
  isInjected: boolean;

  static meta = {
    name: "MetaMask",
    iconURL:
      "ipfs://QmZZHcw7zcXursywnLDAyY6Hfxzqop5GKgwoq8NB9jjrkN/metamask.svg",
  };

  static id = "metamask" as const;

  public get walletName() {
    return "MetaMask" as const;
  }

  constructor(options: MetamaskWalletOptions) {
    super(MetaMaskWallet.id, options);
    this.connectorStorage =
      options.connectorStorage || createAsyncLocalStorage("connector");

    if (assertWindowEthereum(globalThis.window)) {
      this.isInjected = !!globalThis.window.ethereum?.isMetaMask;
    } else {
      this.isInjected = false;
    }
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // if metamask is injected, use the injected connector
      // otherwise, use the wallet connect connector for using the metamask app on mobile via QR code scan

      if (this.isInjected) {
        // import the connector dynamically
        const { MetaMaskConnector } = await import("../connectors/metamask");
        const metamaskConnector = new MetaMaskConnector({
          chains: this.chains,
          connectorStorage: this.connectorStorage,
          options: {
            shimDisconnect: true,
          },
        });

        this.connector = new WagmiAdapter(metamaskConnector);
      } else {
        const { WalletConnectV1Connector } = await import(
          "../connectors/wallet-connect-v1"
        );

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
            qrcode: this.options?.qrcode,
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
