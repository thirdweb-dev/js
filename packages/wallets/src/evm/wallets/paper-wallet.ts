import {
  PaperWalletConnectionArgs,
  PaperWalletAdditionalOptions,
} from "../connectors/paper/types";
import { TWConnector } from "../interfaces/tw-connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import type { Chain } from "@thirdweb-dev/chains";
import type { PaperWalletConnector } from "../connectors/paper";
import { walletIds } from "../constants/walletIds";

export type PaperWalletOptions = WalletOptions<PaperWalletAdditionalOptions>;

export class PaperWallet extends AbstractClientWallet<
  PaperWalletAdditionalOptions,
  PaperWalletConnectionArgs
> {
  connector?: TWConnector;

  static id = walletIds.paper;

  static meta = {
    name: "Paper Wallet",
    iconURL:
      "ipfs://QmNrLXtPoFrh4yjZbXui39zUMozS1oetpgU8dvZhFAxfRa/paper-logo-icon.svg",
  };

  public get walletName() {
    return "Paper Wallet" as const;
  }

  clientId: PaperWalletAdditionalOptions["clientId"];
  chain: PaperWalletAdditionalOptions["chain"];

  constructor(options: PaperWalletOptions) {
    super(PaperWallet.id, {
      ...options,
    });

    this.clientId = options.clientId;
    this.chain = options.chain;
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      const { PaperWalletConnector } = await import("../connectors/paper");
      this.connector = new PaperWalletConnector({
        clientId: this.clientId,
        chain: this.chain,
        chains: this.chains,
      });
    }
    return this.connector;
  }

  async updateChains(chains: Chain[]) {
    this.chains = chains;
  }

  async getEmail() {
    const connector = (await this.getConnector()) as PaperWalletConnector;
    return connector.getEmail();
  }
}
