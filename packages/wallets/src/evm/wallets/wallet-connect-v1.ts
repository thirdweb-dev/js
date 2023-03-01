import type { ConnectorData } from "../../lib/wagmi-core";
import type { WalletConnectV1Connector } from "../connectors/wallet-connect-v1";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import type WalletConnectProvider from "@walletconnect/legacy-provider";

export type WalletConnectV1Options = {
  qrcode?: boolean;
} & ConstructorParameters<typeof WalletConnectProvider>[0];

export class WalletConnectV1 extends AbstractBrowserWallet<WalletConnectV1Options> {
  #walletConnectConnector?: WalletConnectV1Connector;
  #provider?: WalletConnectProvider;

  connector?: TWConnector;

  static id = "walletConnectV1" as const;

  public get walletName() {
    return (
      this.#walletConnectConnector?.walletName || ("WalletConnect" as const)
    );
  }

  constructor(options: WalletOptions<WalletConnectV1Options>) {
    super(WalletConnectV1.id, options);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { WalletConnectV1Connector } = await import(
        "../connectors/wallet-connect-v1"
      );
      console.log("WalletConnectV1Connector", "getConnector");
      this.#walletConnectConnector = new WalletConnectV1Connector({
        chains: this.chains,
        storage: this.walletStorage,
        options: {
          qrcode: this.options.qrcode,
          clientMeta: {
            description: this.options.dappMetadata.description || "",
            url: this.options.dappMetadata.url,
            icons: [this.options.dappMetadata.logoUrl || ""],
            name: this.options.dappMetadata.name,
          },
        },
      });
      this.connector = new WagmiAdapter(this.#walletConnectConnector);
      this.#provider = await this.#walletConnectConnector.getProvider();
      this.#setupListeners();
    }
    return this.connector;
  }

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
      case "request":
        // open wallet after request is sent
        this.emit("open_wallet");
        break;
      case "display_uri":
        console.log("display_uri", payload.data);
        this.emit("open_wallet", payload.data);
        break;
    }
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
  }
}
