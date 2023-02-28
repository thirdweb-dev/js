import type { ConnectorData } from "../../lib/wagmi-core";
import type { WalletConnectConnector } from "../connectors/wallet-connect";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import type WalletConnectProvider from "@walletconnect/ethereum-provider";

export type WalletConnectOptions = {
  projectId: string;
  qrcode?: boolean;
};

export class WalletConnect extends AbstractBrowserWallet<WalletConnectOptions> {
  #walletConnectConnector?: WalletConnectConnector;
  #provider?: WalletConnectProvider;

  connector?: TWConnector;

  static id = "walletConnect" as const;

  public get walletName() {
    return "WalletConnect" as const;
  }

  constructor(options: WalletOptions<WalletConnectOptions>) {
    super(WalletConnect.id, options);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { WalletConnectConnector } = await import(
        "../connectors/wallet-connect"
      );
      this.#walletConnectConnector = new WalletConnectConnector({
        chains: this.chains,
        options: {
          qrcode: this.options.qrcode,
          projectId: this.options.projectId,
          dappMetadata: this.options.dappMetadata,
          storage: this.walletStorage,
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

  #onConnect = async (data: ConnectorData<WalletConnectProvider>) => {
    this.#provider = data.provider;
    if (!this.#provider) {
      throw new Error("WalletConnect provider not found after connecting.");
    }
  };

  #onDisconnect = async () => {
    this.#removeListeners();
  };

  #onChange = async (payload: any) => {
    if (payload.chain) {
      // chain changed
    } else if (payload.account) {
      //account change
    }
  };

  #onMessage = async (payload: any) => {
    switch (payload.type) {
      case "display_uri":
        this.emit("open_wallet", payload.data);
        break;
    }
  };

  #onSessionRequestSent = () => {
    // open wallet after request is sent
    this.emit("open_wallet");
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
}
