import type { WalletConnectConnector as WalletConnectConnectorType } from "../connectors/wallet-connect";
import type { QRModalOptions } from "../connectors/wallet-connect/qrModalOptions";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { assertWindowEthereum } from "../utils/assertWindowEthereum";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { ImTokenConnector as ImTokenConnectorType } from "../connectors/imtoken";
import { walletIds } from "../constants/walletIds";
import { TW_WC_PROJECT_ID } from "../constants/wc";

type ImTokenAdditionalOptions = {
  qrcode?: boolean;
  projectId?: string;
  qrModalOptions?: QRModalOptions;
};

export type ImTokenWalletOptions = WalletOptions<ImTokenAdditionalOptions>;

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export class ImTokenWallet extends AbstractClientWallet<ImTokenAdditionalOptions> {
  connector?: Connector;
  walletConnectConnector?: WalletConnectConnectorType;
  imtokenConnector?: ImTokenConnectorType;
  isInjected: boolean;

  static meta = {
    name: "imToken",
    iconURL:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzIyMl80NzgzKSI+CjxtYXNrIGlkPSJtYXNrMF8yMjJfNDc4MyIgc3R5bGU9Im1hc2stdHlwZTpsdW1pbmFuY2UiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxwYXRoIGQ9Ik03OS44OTQ4IDBIMC4wNTA3ODEyVjgwSDc5Ljg5NDhWMFoiIGZpbGw9IndoaXRlIi8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMF8yMjJfNDc4MykiPgo8cGF0aCBkPSJNNjIuMDI3NSAwSDE4LjA1MDlDOC4xNDYzOSAwIDAuMTE3MTg4IDguMDQ0ODggMC4xMTcxODggMTcuOTY4OFY2Mi4wMzEyQzAuMTE3MTg4IDcxLjk1NTEgOC4xNDYzOSA4MCAxOC4wNTA5IDgwSDYyLjAyNzVDNzEuOTMyIDgwIDc5Ljk2MTIgNzEuOTU1MSA3OS45NjEyIDYyLjAzMTJWMTcuOTY4OEM3OS45NjEyIDguMDQ0ODggNzEuOTMyIDAgNjIuMDI3NSAwWiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzIyMl80NzgzKSIvPgo8cGF0aCBkPSJNNjUuMDk4MSAyNC43MzNDNjYuNzU4NiA0Ny4yNjY3IDUyLjMwMjEgNTcuOTE3MiAzOS4zNDIzIDU5LjA1M0MyNy4yOTM1IDYwLjEwODcgMTUuOTUyIDUyLjY5MDggMTQuOTU3MSA0MS4yOTM2QzE0LjEzNjMgMzEuODc3NiAxOS45NDQ1IDI3Ljg2ODkgMjQuNTA4IDI3LjQ2OTRDMjkuMjAxNSAyNy4wNTcgMzMuMTQ1OCAzMC4zMDAxIDMzLjQ4NzkgMzQuMjI2OUMzMy44MTc1IDM4LjAwMiAzMS40NjY0IDM5LjcyMDUgMjkuODMxMyAzOS44NjM0QzI4LjUzODIgMzkuOTc3IDI2LjkxMTQgMzkuMTkwNSAyNi43NjQ1IDM3LjUwMTZDMjYuNjM4NSAzNi4wNTAzIDI3LjE4ODUgMzUuODUyNiAyNy4wNTQxIDM0LjMxMDlDMjYuODE0OSAzMS41NjYyIDI0LjQyNjEgMzEuMjQ2NiAyMy4xMTgzIDMxLjM2MDFDMjEuNTM1NyAzMS40OTkxIDE4LjY2NDEgMzMuMzQ5OCAxOS4wNjcgMzcuOTZDMTkuNDcyMiA0Mi42MTAxIDIzLjkyMjIgNDYuMjg0NSAyOS43NTU3IDQ1Ljc3MzRDMzYuMDUwOSA0NS4yMjIzIDQwLjQzMzcgNDAuMzExNCA0MC43NjM0IDMzLjQyMzRDNDAuNzYwMyAzMy4wNTg2IDQwLjgzNyAzMi42OTc1IDQwLjk4OCAzMi4zNjU1TDQwLjk5IDMyLjM1NzJDNDEuMDU3OCAzMi4yMTI4IDQxLjEzNzIgMzIuMDc0MiA0MS4yMjcyIDMxLjk0MjhDNDEuMzYxNiAzMS43NDA5IDQxLjUzMzggMzEuNTE4IDQxLjc1NjIgMzEuMjczOUM0MS43NTgzIDMxLjI2NzYgNDEuNzU4MyAzMS4yNjc2IDQxLjc2MjYgMzEuMjY3NkM0MS45MjQxIDMxLjA4NDcgNDIuMTE5NCAzMC44ODcgNDIuMzM5NyAzMC42NzQ1QzQ1LjA4OTcgMjguMDc1IDU0Ljk5MzEgMjEuOTQ0MiA2NC4zNTkyIDIzLjg4NTVDNjQuNTU3MyAyMy45MjggNjQuNzM2MSAyNC4wMzM0IDY0Ljg2OTMgMjQuMTg2MkM2NS4wMDI1IDI0LjMzOTEgNjUuMDgyNiAyNC41MzA4IDY1LjA5ODEgMjQuNzMzWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8L2c+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjIyXzQ3ODMiIHgxPSI3My41MDA5IiB5MT0iNS4zMTI1IiB4Mj0iMi44NzI0MSIgeTI9Ijc3LjY3NDciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzExQzREMSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDYyQUQiLz4KPC9saW5lYXJHcmFkaWVudD4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yMjJfNDc4MyI+CjxyZWN0IHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4=",
    urls: {
      ios: "https://itunes.apple.com/us/app/imtoken2/id1384798940",
      android: "https://play.google.com/store/apps/details?id=im.token.app",
    },
  };

  static id = walletIds.imtoken as string;

  public get walletName() {
    return "imToken" as const;
  }

  constructor(options: ImTokenWalletOptions) {
    super(ImTokenWallet.id, options);

    if (assertWindowEthereum(globalThis.window)) {
      this.isInjected = !!globalThis.window.ethereum?.isImToken;
    } else {
      this.isInjected = false;
    }
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      if (this.isInjected) {
        // import the connector dynamically
        const { ImTokenConnector } = await import("../connectors/imtoken");
        const imtokenConnector = new ImTokenConnector({
          chains: this.chains,
          connectorStorage: this.walletStorage,
          options: {
            shimDisconnect: true,
          },
        });

        this.imtokenConnector = imtokenConnector;

        this.connector = new WagmiAdapter(imtokenConnector);
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
   * You can use this method to display a QR code. The user can scan this QR code using the Trust Wallet mobile app to connect to your dapp.
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
