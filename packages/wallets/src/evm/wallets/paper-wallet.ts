import { PaperChainMap } from "../connectors/paper";
import type { PaperWalletConnector } from "../connectors/paper";
import { AbstractBrowserWallet, WalletOptions } from "./base";

export type PaperOptions = {
  clientId: string;
  chainId: number;
};

export class PaperWallet extends AbstractBrowserWallet<PaperOptions> {
  #connector?: PaperWalletConnector;

  static id = "paper-wallet" as const;
  public get walletName() {
    return "Paper Wallet" as const;
  }

  constructor(options: WalletOptions<PaperOptions>) {
    super(PaperWallet.id, {
      ...options,
      shouldAutoConnect: false, // TODO figure the autoconnect flow
    });
  }

  protected async getConnector(): Promise<PaperWalletConnector> {
    if (!this.#connector) {
      const chainName = PaperChainMap[this.options.chainId];
      if (!chainName) {
        throw new Error("Unsupported chain id: " + this.options.chainId);
      }
      const { PaperWalletConnector } = await import("../connectors/paper");
      this.#connector = new PaperWalletConnector({
        chains: this.chains,
        options: {
          clientId: this.options.clientId,
          chain: chainName,
        },
      });
    }
    return this.#connector;
  }
}
