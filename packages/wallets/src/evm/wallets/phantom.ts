import type { WalletConnectConnector as WalletConnectConnectorType } from "../connectors/wallet-connect";
import type { QRModalOptions } from "../connectors/wallet-connect/qrModalOptions";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { PhantomConnector as PhantomConnectorType } from "../connectors/phantom";
import { walletIds } from "../constants/walletIds";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import { getInjectedPhantomProvider } from "../connectors/phantom/getInjectedPhantomProvider";




export class PhantomWallet extends AbstractClientWallet {
  connector?: Connector;
  walletConnectConnector?: WalletConnectConnectorType;
  phantomConnector?: PhantomConnectorType;
  isInjected: boolean;

  static meta = {
    name: "Phantom",
    iconURL:
      "ipfs://QmZZHcw7zcXursywnLDAyY6Hfxzqop5GKgwoq8NB9jjrkN/phantom.svg",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/phantom/nkbihfbeogaeaoehlefnkodbefgpgknn",
      android: "https://play.google.com/store/apps/details?id=io.phantom",
      ios: "https://apps.apple.com/us/app/phantom-blockchain-wallet/id1438144202",
    },
  };

  static id = walletIds.phantom;

  public get walletName() {
    return "Phantom" as const;
  }

  constructor(options: PhantomWalletOptions) {
    super(PhantomWallet.id, options);
    this.isInjected = !!getInjectedPhantomProvider();
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // if phantom is injected, use the injected connector
      // otherwise, use the wallet connect connector for using the phantom app on mobile via QR code scan

      if (this.isInjected) {
        // import the connector dynamically
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
   * phantom.connectWithQrCode({
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
    this.connect({ chainId: options.chainId }).then(options.onConnected);
  }

  async switchAccount() {
    if (!this.phantomConnector) {
      throw new Error("Can not switch Account");
    }

    await this.phantomConnector.switchAccount();
  }
}
