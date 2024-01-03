import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";

/**
 * @internal
 */
export class InjectedWallet extends AbstractClientWallet {
  connector?: Connector;

  static id = "injected" as string;
  public get walletName() {
    return "Injected Wallet";
  }

  constructor(options?: WalletOptions) {
    super(InjectedWallet.id, options);
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // import the connector dynamically
      const { InjectedConnector } = await import("../connectors/injected");
      this.connector = new WagmiAdapter(
        new InjectedConnector({
          chains: this.chains,
          connectorStorage: this.walletStorage,
          options: {
            shimDisconnect: true,
          },
        }),
      );
    }
    return this.connector;
  }
}
