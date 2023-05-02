import type { ConnectorData } from "../../lib/wagmi-core";
import type { WalletConnectConnector } from "../connectors/wallet-connect";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type WalletConnectProvider from "@walletconnect/ethereum-provider";
import { TW_WC_PROJECT_ID } from "../constants/wc";
import { walletIds } from "../walletIds";

export type WalletConnectOptions = {
  projectId?: string;
  qrcode?: boolean;
};

export class WalletConnect extends AbstractClientWallet<WalletConnectOptions> {
  #walletConnectConnector?: WalletConnectConnector;
  #provider?: WalletConnectProvider;

  connector?: TWConnector;

  static id = walletIds.walletConnect;

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

  protected async getConnector(): Promise<TWConnector> {
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

  #onConnect = (data: ConnectorData<WalletConnectProvider>) => {
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
