import type { WagmiConnectorData } from "../../lib/wagmi-core";
import type { WalletConnectConnector } from "../connectors/wallet-connect";
import { QRModalOptions } from "../connectors/wallet-connect/qrModalOptions";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type WalletConnectProvider from "@walletconnect/ethereum-provider";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import { walletIds } from "../constants/walletIds";

export type WC2_QRModalOptions = QRModalOptions;

type ConnectWithQrCodeArgs = {
  chainId?: number;
  onQrCodeUri: (uri: string) => void;
  onConnected: (accountAddress: string) => void;
};

export type WalletConnectOptions = {
  /**
   * Your project’s unique identifier that can be obtained at cloud.walletconnect.com. Enables following functionalities within Web3Modal: wallet and chain logos, optional WalletConnect RPC, support for all wallets from our Explorer and WalletConnect v2 support. Defaults to undefined.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * Whether to display the QR Code Modal.
   *
   * Defaults to `true`.
   */
  qrcode?: boolean;

  /**
   * options to customize the QR Code Modal
   *
   * https://docs.walletconnect.com/2.0/web3modal/options
   */
  qrModalOptions?: WC2_QRModalOptions;
};

export class WalletConnect extends AbstractClientWallet<WalletConnectOptions> {
  #walletConnectConnector?: WalletConnectConnector;
  #provider?: WalletConnectProvider;

  connector?: Connector;

  static id = walletIds.walletConnect as string;

  static meta = {
    name: "WalletConnect",
    iconURL:
      "ipfs://QmX58KPRaTC9JYZ7KriuBzeoEaV2P9eZcA3qbFnTHZazKw/wallet-connect.svg",
  };

  public get walletName() {
    return "WalletConnect" as const;
  }

  projectId: NonNullable<WalletConnectOptions["projectId"]>;
  qrcode: WalletConnectOptions["qrcode"];

  constructor(options?: WalletOptions<WalletConnectOptions>) {
    super(options?.walletId || WalletConnect.id, options);
    this.projectId = options?.projectId || TW_WC_PROJECT_ID;
    this.qrcode = options?.qrcode === false ? false : true;
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // import the connector dynamically
      const { WalletConnectConnector } = await import(
        "../connectors/wallet-connect"
      );

      this.#walletConnectConnector = new WalletConnectConnector({
        chains: this.chains,
        options: {
          qrcode: this.qrcode,
          projectId: this.projectId,
          dappMetadata: this.dappMetadata,
          storage: this.walletStorage,
          qrModalOptions: this.options?.qrModalOptions,
        },
      });
      this.connector = new WagmiAdapter(this.#walletConnectConnector);
      this.#provider = await this.#walletConnectConnector.getProvider();
      this.#setupListeners();
    }
    return this.connector;
  }

  #maybeThrowError = (error: any) => {
    if (error) {
      throw error;
    }
  };

  #onConnect = (data: WagmiConnectorData<WalletConnectProvider>) => {
    this.#provider = data.provider;
    if (!this.#provider) {
      throw new Error("WalletConnect provider not found after connecting.");
    }
  };

  #onDisconnect = () => {
    this.#removeListeners();
  };

  #onChange = async (payload: any) => {
    if (payload.chain) {
      // chain changed
    } else if (payload.account) {
      //account change
    }
  };

  #onMessage = (payload: any) => {
    switch (payload.type) {
      case "display_uri":
        this.emit("display_uri", payload.data);
        break;
    }
  };

  #onSessionRequestSent = () => {
    this.emit("wc_session_request_sent");
  };

  #setupListeners() {
    if (!this.#walletConnectConnector) {
      return;
    }
    this.#removeListeners();
    this.#walletConnectConnector.on("connect", this.#onConnect);
    this.#walletConnectConnector.on("disconnect", this.#onDisconnect);
    this.#walletConnectConnector.on("change", this.#onChange);
    this.#walletConnectConnector.on("message", this.#onMessage);
    this.#provider?.signer.client.on(
      "session_request_sent",
      this.#onSessionRequestSent,
    );
  }

  #removeListeners() {
    if (!this.#walletConnectConnector) {
      return;
    }
    this.#walletConnectConnector.removeListener("connect", this.#onConnect);
    this.#walletConnectConnector.removeListener(
      "disconnect",
      this.#onDisconnect,
    );
    this.#walletConnectConnector.removeListener("change", this.#onChange);
    this.#walletConnectConnector.removeListener("message", this.#onMessage);
    this.#provider?.signer.client.removeListener(
      "session_request_sent",
      this.#onSessionRequestSent,
    );
  }

  async connectWithQrCode(options: ConnectWithQrCodeArgs) {
    await this.getConnector();
    const wcConnector = this.#walletConnectConnector;

    if (!wcConnector) {
      throw new Error("WalletConnect connector not found");
    }

    const wcProvider = await wcConnector.getProvider();

    wcProvider.on("display_uri", (uri) => {
      options.onQrCodeUri(uri);
    });

    // trigger connect flow
    this.connect({ chainId: options.chainId }).then(options.onConnected);
  }
}
