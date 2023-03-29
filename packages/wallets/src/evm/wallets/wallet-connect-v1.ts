import type { ConnectorData } from "../../lib/wagmi-core";
import type { WalletConnectV1Connector } from "../connectors/wallet-connect-v1";
import type WalletConnectProvider from "../connectors/wallet-connect-v1/walletconnect-legacy-provider";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";

export type WalletConnectV1Options = {
  qrcode?: boolean;
} & Omit<ConstructorParameters<typeof WalletConnectProvider>[0], "clientMeta">;

export class WalletConnectV1 extends AbstractBrowserWallet<WalletConnectV1Options> {
  #walletConnectConnector?: WalletConnectV1Connector;
  #provider?: WalletConnectProvider;

  connector?: TWConnector;

  static id = "walletConnectV1";

  static meta = {
    name: "Wallet Connect",
    iconURL:
      "ipfs://QmX58KPRaTC9JYZ7KriuBzeoEaV2P9eZcA3qbFnTHZazKw/wallet-connect.svg",
  };

  public get walletName() {
    return (
      this.#walletConnectConnector?.walletName || ("WalletConnect" as const)
    );
  }

  qrcode: boolean;

  constructor(options?: WalletOptions<WalletConnectV1Options>) {
    super(options?.walletId || WalletConnectV1.id, options);

    this.qrcode = options?.qrcode || false;
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { WalletConnectV1Connector } = await import(
        "../connectors/wallet-connect-v1"
      );
      this.#walletConnectConnector = new WalletConnectV1Connector({
        chains: this.chains,
        storage: this.walletStorage,
        options: {
          qrcode: this.qrcode,
          clientMeta: {
            description: this.dappMetadata.description || "",
            url: this.dappMetadata.url,
            icons: [this.dappMetadata.logoUrl || ""],
            name: this.dappMetadata.name,
          },
        },
      });
      this.connector = new WagmiAdapter(this.#walletConnectConnector);
      this.#provider = await this.#walletConnectConnector.getProvider();
      this.#setupListeners();
    }
    return this.connector;
  }

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
      case "request": // open wallet after request is sent
      case "add_chain": // open wallet after chain is added
      case "switch_chain": // open wallet after chain is switched
        this.emit("open_wallet");
        break;
      case "display_uri":
        this.emit("open_wallet", payload.data);
        break;
    }
  };

  #setupListeners() {
    if (!this.#walletConnectConnector) {
      return;
    }
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
