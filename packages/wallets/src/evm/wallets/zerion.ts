import type { ZerionConnector } from "../connectors/zerion";
import type { WalletConnectV1Connector as WalletConnectV1ConnectorType } from "../connectors/wallet-connect-v1";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import { assertWindowEthereum } from "../utils/assertWindowEthereum";

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export class ZerionWallet extends AbstractClientWallet {
  connector?: Connector;
  zerionConnector?: ZerionConnector;
  walletConnectConnector?: WalletConnectV1ConnectorType;
  isInjected: boolean;

  static id = "zerion" as const;
  static meta = {
    name: "Zerion Wallet",
    iconURL: "https://tokenlists-icons.s3.amazonaws.com/zerion.png",
    urls: {
      chrome: "https://zerion.io/extension",
      android: "https://link.zerion.io/901o6IN0jqb",
      ios: "https://link.zerion.io/a11o6IN0jqb",
    },
  };
  public get walletName() {
    return "Zerion Wallet";
  }

  constructor(options?: WalletOptions) {
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
