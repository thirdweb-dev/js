import type { WalletConnectV1Connector } from "../connectors/wallet-connect-v1";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import { ConnectorData } from "@wagmi/core";
import type WalletConnectProvider from "@walletconnect/legacy-provider";

export type WalletConnectV1Options = {
  qrcode: boolean;
} & ConstructorParameters<typeof WalletConnectProvider>[0];

export class WalletConnectV1 extends AbstractBrowserWallet<WalletConnectV1Options> {
  #walletConnectConnector?: WalletConnectV1Connector;
  #provider?: WalletConnectProvider;

  connector?: TWConnector;

  static id = "walletConnectV1" as const;

  public get walletName() {
    return "WalletConnect" as const;
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
      console.log("create walletConnectConnector");
      this.#walletConnectConnector = new WalletConnectV1Connector({
        chains: this.chains,
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
      console.log("after created", this.#walletConnectConnector.connect);
      this.connector = new WagmiAdapter(this.#walletConnectConnector);
      console.log("after wagmi adapter created");
      this.#provider = await this.#walletConnectConnector.getProvider();
      console.log("after this.provider", this.#provider);

      this.#setupListeners();
    }
    return this.connector;
  }

  #onConnect = async (data: ConnectorData<WalletConnectProvider>) => {
    console.log("onConnect");

    this.#provider = data.provider;
    if (!this.#provider) {
      throw new Error("WalletConnect provider not found after connecting.");
    }
  };

  #onDisconnect = async () => {
    console.log("walletConnect onDisconnect");
    this.#removeListeners();
  };

  #onChange = async (payload: any) => {
    console.log("walletConnect onChange", payload);
    if (payload.chain) {
      // chain changed
    } else if (payload.account) {
      //account change
    }
  };

  #onMessage = async (payload: any) => {
    console.log("onMessage", payload);
    switch (payload.type) {
      case "display_uri":
        this.emit("open_wallet", payload.data);
        break;
    }
  };

  #onSessionRequestSent = () => {
    console.log("onSessionRequestSent.emit open_wallet");
    // open wallet after request is sent
    this.emit("open_wallet");
  };

  #setupListeners() {
    if (!this.#walletConnectConnector) {
      return;
    }
    this.#removeListeners();
    console.log(
      "settingupListeners in wc wallet",
      this.#provider === undefined,
    );
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
