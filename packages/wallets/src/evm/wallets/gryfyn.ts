import { AbstractClientWallet, WalletOptions } from "./base";
import type { GryFynConnector as GryFynConnectorType } from "../connectors/gryfyn";
import { Chain } from "@thirdweb-dev/chains";

export type GryfynWalletOptions = WalletOptions<{
  apiKey: string;
  chains: Chain[];
}>;

export class GryfynWallet extends AbstractClientWallet {
  #options: GryfynWalletOptions;
  #connector?: GryFynConnectorType;

  constructor(options: GryfynWalletOptions) {
    super("GryfynWallet", options);
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

  async autoConnect() {
    throw new Error("Autoconnect not supported");
    return "";
  }

  async openWallet() {
    const connector = await this.getConnector();
    if (connector.gryfynProvider) {
      return connector.gryfynProvider.openWallet();
    }
  }
}
