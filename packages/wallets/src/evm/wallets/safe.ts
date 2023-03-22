import { ConnectParams, TWConnector } from "../interfaces/tw-connector";
import { AbstractBrowserWallet, WalletOptions } from "./base";
import type { Chain } from "@thirdweb-dev/chains";
import { SafeConnectionArgs } from "../connectors/safe/types";

export { SafeSupportedChainsSet } from "../connectors/safe";

// re-export the connection args for convenience
export type { SafeConnectionArgs } from "../connectors/safe/types";

export type SafeWalletOptions = WalletOptions<{}>;
export class SafeWallet extends AbstractBrowserWallet<{}, SafeConnectionArgs> {
  connector?: TWConnector;

  static meta = {
    name: "Safe",
    iconURL: "ipfs://Qma8QRV8cE31j5V2qsS5twWwnHWFhcEaHKCFiDgY9VZy8p/Safe.svg",
  };

  static id = "Safe" as const;
  public get walletName() {
    return "Safe Wallet" as const;
  }

  constructor(options: SafeWalletOptions) {
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

  async connect(
    connectOptions: ConnectParams<SafeConnectionArgs>,
  ): Promise<string> {
    // can't save params to storage because one of them is a class instance and can't be saved
    return await super.connect({ ...connectOptions, saveParams: false });
  }
}
