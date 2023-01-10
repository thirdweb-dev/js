import type { MetaMaskConnector } from "../connectors/metamask";
import { AbstractWallet, WalletOptions } from "./base";

export class MetaMask extends AbstractWallet {
  #connector?: MetaMaskConnector;

  static id = "metamask" as const;

  public get walletName() {
    return "MetaMask" as const;
  }

  constructor(options: WalletOptions) {
    super(MetaMask.id, options);
  }

  protected async getConnector(): Promise<MetaMaskConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { MetaMaskConnector } = await import("../connectors/metamask");
      this.#connector = new MetaMaskConnector({
        chains: this.chains,
        options: {
          shimDisconnect: true,
        },
      });
    }
    return this.#connector;
  }
}
