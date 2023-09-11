import type { PaperWalletConnector } from "../connectors/paper";
import {
  PaperWalletAdditionalOptions as PaperWalletAdditionalOptions_,
  PaperWalletConnectionArgs,
} from "../connectors/paper/types";
import { walletIds } from "../constants/walletIds";
import { Connector } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";

export type { PaperWalletAdditionalOptions } from "../connectors/paper/types";

export type PaperWalletOptions = WalletOptions<PaperWalletAdditionalOptions_>;

export class PaperWallet extends AbstractClientWallet<
  PaperWalletAdditionalOptions_,
  PaperWalletConnectionArgs
> {
  connector?: Connector;

  static id = walletIds.paper;

  static meta = {
    name: "Paper Wallet",
    iconURL:
      "ipfs://QmNrLXtPoFrh4yjZbXui39zUMozS1oetpgU8dvZhFAxfRa/paper-logo-icon.svg",
  };

  public get walletName() {
    return "Paper Wallet" as const;
  }

  paperClientId: string;
  chain: PaperWalletAdditionalOptions_["chain"];

  constructor(options: PaperWalletOptions) {
    super(PaperWallet.id, {
      ...options,
    });
    // checks to see if we are trying to use USER_MANAGED with thirdweb client ID. If so, we throw an error.
    if (
      options.advancedOptions &&
      options.advancedOptions?.recoveryShareManagement === "USER_MANAGED"
    ) {
      if (
        (options.clientId &&
          !this.isClientIdLegacyPaper(options.clientId ?? "")) ||
        (options.paperClientId &&
          !this.isClientIdLegacyPaper(options.paperClientId))
      ) {
        throw new Error(
          'RecoveryShareManagement option "USER_MANAGED" is not supported with thirdweb client ID',
        );
      }
    }
    if (!options.clientId && !options.paperClientId) {
      throw new Error("clientId or paperClientId is required");
    }
    if (
      options.paperClientId &&
      !this.isClientIdLegacyPaper(options.paperClientId)
    ) {
      throw new Error("paperClientId must be a legacy paper client ID");
    }
    if (options.clientId && this.isClientIdLegacyPaper(options.clientId)) {
      throw new Error("clientId must be a thirdweb client ID");
    }

    // cast is okay because we assert that either clientId or paperClientId is defined above
    this.paperClientId = (options.paperClientId ?? options.clientId) as string;
    this.chain = options.chain;
  }
  private isClientIdLegacyPaper(clientId: string): boolean {
    return clientId.indexOf("-") > 0 && clientId.length === 36;
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      const { PaperWalletConnector } = await import("../connectors/paper");
      this.connector = new PaperWalletConnector({
        clientId: this.paperClientId,
        chain: this.chain,
        chains: this.chains,
        advancedOptions: {
          recoveryShareManagement:
            this.options?.advancedOptions?.recoveryShareManagement,
        },
        styles: this.options?.styles,
      });
    }
    return this.connector;
  }

  async getEmail() {
    const connector = (await this.getConnector()) as PaperWalletConnector;
    return connector.getEmail();
  }

  async getPaperSDK() {
    const connector = (await this.getConnector()) as PaperWalletConnector;
    return connector.getPaperSDK();
  }
}
