import type { WalletConnectV1Connector as WalletConnectV1ConnectorType } from "../connectors/wallet-connect-v1";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { assertWindowEthereum } from "../utils/assertWindowEthereum";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { BitKeepConnector as BitKeepConnectorType } from "../connectors/bitkeep";
import { walletIds } from "../constants/walletIds";

type BitKeepAdditionalOptions = {
  /**
   * Whether to display the Wallet Connect QR code Modal for connecting to BitKeep on mobile if BitKeep is not injected.
   */
  qrcode?: boolean;
};

export type BitKeepWalletOptions = WalletOptions<BitKeepAdditionalOptions>;

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export class BitKeepWallet extends AbstractClientWallet<BitKeepAdditionalOptions> {
  connector?: Connector;
  walletConnectConnector?: WalletConnectV1ConnectorType;
  bitkeepConnector?: BitKeepConnectorType;
  isInjected: boolean;

  static meta = {
    name: "BitKeep",
    iconURL:
      "https://ipfs.io/ipfs/QmNnBASau839xxF4QSKwBuQXNnaqHJLQYv5oTcHuJyyjcW?filename=Transparent_circle.svg",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak",
      android: "https://play.google.com/store/apps/details?id=com.bitkeep.wallet",
      ios: "https://apps.apple.com/app/bitkeep/id1395301115",
    },
  };

  static id = walletIds.bitkeep;

  public get walletName() {
    return "BitKeep" as const;
  }

  constructor(options: BitKeepWalletOptions) {
    super(BitKeepWallet.id, options);

    if (assertWindowEthereum(globalThis.window)) {
      this.isInjected = (!!globalThis.window.ethereum?.isBitKeep) || !!(globalThis.window?.bitkeep.ethereum?.isBitKeep);
    } else {
      this.isInjected = false;
    }
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // if bitkeep is injected, use the injected connector
      // otherwise, use the wallet connect connector for using the bitkeep app on mobile via QR code scan

      if (this.isInjected) {
        // import the connector dynamically
        const { BitKeepConnector } = await import("../connectors/bitkeep");
        const bitkeepConnector = new BitKeepConnector({
          chains: this.chains,
          connectorStorage: this.walletStorage,
          options: {
            shimDisconnect: true,
          },
        });

        this.bitkeepConnector = bitkeepConnector;

        this.connector = new WagmiAdapter(bitkeepConnector);
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
   * bitkeep.connectWithQrCode({
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
    if (!this.bitkeepConnector) {
      throw new Error("Can not switch Account");
    }

    await this.bitkeepConnector.switchAccount();
  }
}
