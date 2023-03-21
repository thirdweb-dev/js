import { TWConnector } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import type { Chain } from "@thirdweb-dev/chains";
import { SafeConnectionArgs, SafeOptions } from "../connectors/safe/types";

// re-export the connection args for convenience
export type { SafeConnectionArgs } from "../connectors/safe/types";

export class SafeWallet extends AbstractBrowserWallet<
  SafeOptions,
  SafeConnectionArgs
> {
  connector?: TWConnector;

  static id = "safe-wallet" as const;
  public get walletName() {
    return "Safe Wallet" as const;
  }

  constructor(options: WalletOptions<SafeOptions>) {
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
