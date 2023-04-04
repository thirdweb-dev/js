import { AsyncStorage, createAsyncLocalStorage } from "../../core/AsyncStorage";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractClientWallet, WalletOptions } from "./base";

export class InjectedWallet extends AbstractClientWallet {
  connector?: TWConnector;
  connectorStorage: AsyncStorage;

  static id = "injected" as const;
  public get walletName() {
    return "Injected Wallet";
  }

  constructor(options?: WalletOptions<{ connectorStorage?: AsyncStorage }>) {
    super(InjectedWallet.id, options);
    this.connectorStorage =
      options?.connectorStorage || createAsyncLocalStorage("connector");
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      // import the connector dynamically
      const { InjectedConnector } = await import("../connectors/injected");
      this.connector = new WagmiAdapter(
        new InjectedConnector({
          chains: this.chains,
          connectorStorage: this.connectorStorage,
          options: {
            shimDisconnect: true,
          },
        }),
      );
    }
    return this.connector;
  }
}
