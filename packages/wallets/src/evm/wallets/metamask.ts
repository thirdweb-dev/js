import type { WalletConnectV1Connector as WalletConnectV1ConnectorType } from "../connectors/wallet-connect-v1";
import { Connector, WagmiAdapter } from "../interfaces/tw-connector";
import { assertWindowEthereum } from "../utils/assertWindowEthereum";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { MetaMaskConnector as MetamaskConnectorType } from "../connectors/metamask";
import { walletIds } from "../constants/walletIds";

type MetamaskAdditionalOptions = {
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

export class MetaMaskWallet extends AbstractClientWallet<MetamaskAdditionalOptions> {
  connector?: Connector;
  walletConnectConnector?: WalletConnectV1ConnectorType;
  metamaskConnector?: MetamaskConnectorType;
  isInjected: boolean;

  // TODO: remove this
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

    if (assertWindowEthereum(globalThis.window)) {
      this.isInjected = !!globalThis.window.ethereum?.isMetaMask;
    } else {
      this.isInjected = false;
    }
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
        const { WalletConnectV1Connector } = await import(
          "../connectors/wallet-connect-v1"
        );

        const walletConnectConnector = new WalletConnectV1Connector({
          chains: this.chains,
          storage: this.walletStorage,
          options: {
            clientMeta: {
              name: this.dappMetadata.name,
              description: this.dappMetadata.description || "",
              url: this.dappMetadata.url,
              icons: [this.dappMetadata.logoUrl || ""],
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

  async switchAccount() {
    if (!this.metamaskConnector) {
      throw new Error("Can not switch Account");
    }

    await this.metamaskConnector.switchAccount();
  }
}
