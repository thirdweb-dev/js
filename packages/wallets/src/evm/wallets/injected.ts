import { AsyncStorage } from "../../core/AsyncStorage";
import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";

export class InjectedWallet extends AbstractBrowserWallet {
  connector?: TWConnector;
  connectorStorage: AsyncStorage;

  static id = "injected" as const;
  public get walletName() {
    return "Injected Wallet";
  }

  constructor(options: WalletOptions<{ connectorStorage: AsyncStorage }>) {
    super(InjectedWallet.id, options);
    this.connectorStorage = options.connectorStorage;
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
