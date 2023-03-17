import {
  PaperWalletConnectionArgs,
  PaperWalletAdditionalOptions,
} from "../connectors/paper/types";
import { TWConnector } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import { Chain } from "@thirdweb-dev/chains";

export class SafeWallet extends AbstractBrowserWallet<
  PaperWalletAdditionalOptions,
  PaperWalletConnectionArgs
> {
  connector?: TWConnector;

  static id = "safe-wallet" as const;
  public get walletName() {
    return "Safe Wallet" as const;
  }

  constructor(options: WalletOptions<PaperWalletAdditionalOptions>) {
    super(SafeWallet.id, {
      ...options,
      shouldAutoConnect: false, // TODO figure the autoconnect flow
    });
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      const { SafeConnector } = await import("../connectors/safe");

      this.connector = new SafeConnector();
    }
    return this.connector;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateChains(chains: Chain[]) {
    // no op
  }
}
