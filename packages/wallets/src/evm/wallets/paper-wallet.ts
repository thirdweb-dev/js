import {
  PaperWalletConnectionArgs,
  PaperWalletAdditionalOptions,
} from "../connectors/paper/types";
import { TWConnector } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import type { Chain } from "@thirdweb-dev/chains";

export type PaperWalletOptions = WalletOptions<PaperWalletAdditionalOptions>;

export class PaperWallet extends AbstractBrowserWallet<
  PaperWalletAdditionalOptions,
  PaperWalletConnectionArgs
> {
  connector?: TWConnector;

  static id = "PaperWallet" as const;

  static meta = {
    name: "Paper Wallet",
    iconURL:
      "ipfs://QmNrLXtPoFrh4yjZbXui39zUMozS1oetpgU8dvZhFAxfRa/paper-logo-icon.svg",
  };

  public get walletName() {
    return "Paper Wallet" as const;
  }

  constructor(options: PaperWalletOptions) {
    super(PaperWallet.id, {
      ...options,
      shouldAutoConnect: false, // TODO figure the autoconnect flow
    });
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      const { PaperWalletConnector } = await import("../connectors/paper");
      this.connector = new PaperWalletConnector({
        clientId: this.options.clientId,
        chain: this.options.chain,
        chains: this.options.chains,
      });
    }
    return this.connector;
  }

  async updateChains(chains: Chain[]) {
    this.options.chains = chains;
  }
}
