import { TWConnector, WagmiAdapter } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";

export class MetaMask extends AbstractBrowserWallet {
  #connector?: TWConnector;

  static id = "metamask" as const;

  public get walletName() {
    return "MetaMask" as const;
  }

  constructor(options: WalletOptions) {
    super(MetaMask.id, options);
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.#connector) {
      // import the connector dynamically
      const { MetaMaskConnector } = await import("../connectors/metamask");
      this.#connector = new WagmiAdapter(
        new MetaMaskConnector({
          chains: this.chains,
          options: {
            shimDisconnect: true,
          },
        }),
      );
    }
    return this.#connector;
  }
}
