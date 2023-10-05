import { ConnectParams, Connector } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { Chain } from "@thirdweb-dev/chains";
import type { SafeConnectionArgs } from "../connectors/safe/types";
import type { SafeConnector as SafeConnectorType } from "../connectors/safe";
import { walletIds } from "../constants/walletIds";

export { SafeSupportedChainsSet } from "../connectors/safe/constants";

// re-export the connection args for convenience
export type { SafeConnectionArgs } from "../connectors/safe/types";

export type SafeWalletOptions = WalletOptions;
export class SafeWallet extends AbstractClientWallet<
  object,
  SafeConnectionArgs
> {
  connector?: SafeConnectorType;

  static meta = {
    name: "Safe",
    iconURL:
      "ipfs://QmbbyxDDmmLQh8DzzeUR6X6B75bESsNUFmbdvS3ZsQ2pN1/SafeToken.svg",
  };

  static id = walletIds.safe as string;
  public get walletName() {
    return "Safe Wallet" as const;
  }

  constructor(options?: SafeWalletOptions) {
    super(SafeWallet.id, {
      ...options,
    });
  }

  protected async getConnector(): Promise<Connector> {
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

  getPersonalWallet() {
    return this.connector?.personalWallet;
  }

  autoConnect(params: ConnectParams<SafeConnectionArgs>) {
    return this.connect(params);
  }
}
