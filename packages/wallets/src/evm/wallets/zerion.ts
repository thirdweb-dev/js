import type { ZerionConnector } from "../connectors/zerion";
import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";

export class ZerionWallet extends AbstractClientWallet {
  connector?: Connector;
  zerionConnector?: ZerionConnector;

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
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
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
    }
    return this.connector;
  }
}
