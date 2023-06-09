import { AbstractClientWallet, WalletOptions } from "./base";
import type { GryFynConnector as GryFynConnectorType } from "../connectors/gryfyn";
import { Chain } from "@thirdweb-dev/chains";

export type GrynFynWalletOptions = WalletOptions<{
  apiKey: string;
  chains: Chain[];
}>;

export class GrynFynWallet extends AbstractClientWallet {
  #options: GrynFynWalletOptions;
  #connector?: GryFynConnectorType;

  constructor(options: GrynFynWalletOptions) {
    super("GrynFynWallet", options);
    this.#options = options;
  }

  async getConnector() {
    if (this.#connector) {
      return this.#connector;
    }
    const { GryFynConnector } = await import("../connectors/gryfyn");
    this.#connector = new GryFynConnector(this.#options);
    return this.#connector;
  }
}
