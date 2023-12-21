import type { WalletConnectConnector as WalletConnectConnectorType } from "../connectors/wallet-connect";
import type { QRModalOptions } from "../connectors/wallet-connect/qrModalOptions";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { CryptoDefiWalletConnector as CryptoDefiWalletConnectorType } from "../connectors/crypto-defi-wallet";
import { walletIds } from "../constants/walletIds";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import { getInjectedCryptoDefiWalletProvider } from "../connectors/crypto-defi-wallet/getInjectedCryptoDefiWalletProvider";

export type CryptoDefiWalletAdditionalOptions = {
  /**
   * Whether to open the default Wallet Connect QR code Modal for connecting to Defi app on mobile if Defi wallet is not injected when calling connect().
   */
  qrcode?: boolean;

  /**
   * When connecting Defi wallet using the QR Code - Wallet Connect connector is used which requires a project id.
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

export type CryptoDefiWalletOptions =
  WalletOptions<CryptoDefiWalletAdditionalOptions>;

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

/**
 * @wallet
 */
export class CryptoDefiWallet extends AbstractClientWallet<CryptoDefiWalletAdditionalOptions> {
  connector?: Connector;
  walletConnectConnector?: WalletConnectConnectorType;
  CryptoDefiWalletConnector?: CryptoDefiWalletConnectorType;
  isInjected: boolean;

  static id = walletIds.coreWallet as string;

  public get walletName() {
    return "Crypto Defi wallet" as const;
  }

  constructor(options: CryptoDefiWalletOptions) {
    super(CryptoDefiWallet.id, options);
    this.isInjected = !!getInjectedCryptoDefiWalletProvider();
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // if Defi wallet is injected, use the injected connector
      // otherwise, use the wallet connect connector for using the Defi app on mobile via QR code scan

      if (this.isInjected) {
        // import the connector dynamically
        const { CryptoDefiWalletConnector } = await import(
          "../connectors/crypto-defi-wallet"
        );
        this.CryptoDefiWalletConnector = new CryptoDefiWalletConnector({
          chains: this.chains,
          connectorStorage: this.walletStorage,
          options: {
            shimDisconnect: true,
          },
        });

        this.connector = new WagmiAdapter(this.CryptoDefiWalletConnector);
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
