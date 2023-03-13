import {
  PaperWalletConnectionArgs,
  PaperWalletOptions,
} from "../connectors/paper/types";
import { TWConnector } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import { Chain } from "@thirdweb-dev/chains";

export class PaperWallet extends AbstractBrowserWallet<
  PaperWalletOptions,
  PaperWalletConnectionArgs
> {
  connector?: TWConnector;

  static id = "paper-wallet" as const;
  public get walletName() {
    return "Paper Wallet" as const;
  }

  constructor(options: WalletOptions<PaperWalletOptions>) {
    super(PaperWallet.id, {
      ...options,
      shouldAutoConnect: false, // TODO figure the autoconnect flow
    });
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      const { PaperWalletConnector: PaperWalletConnector } = await import(
        "../connectors/paper"
      );

      this.connector = new PaperWalletConnector({
        clientId: this.options.clientId,
        chain: this.options.chain,
      });
    }
    return this.connector;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateChains(chains: Chain[]) {
    // no op
  }
}
