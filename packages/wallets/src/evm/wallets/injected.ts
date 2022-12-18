import type { InjectedConnector } from "../connectors/injected";
import { AbstractWallet, WalletOptions } from "./base";

export class InjectedWallet extends AbstractWallet {
  #connector?: InjectedConnector;

  static id = "injected" as const;
  public get walletName() {
    return this.#connector?.name || "Injected Wallet";
  }

  constructor(options: WalletOptions) {
    super(InjectedWallet.id, options);
  }

  protected async getConnector(): Promise<InjectedConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { InjectedConnector } = await import("../connectors/injected");
      this.#connector = new InjectedConnector({
        chains: this.chains,
        options: {
          shimDisconnect: true,
        },
      });
    }
    return this.#connector;
  }
}
