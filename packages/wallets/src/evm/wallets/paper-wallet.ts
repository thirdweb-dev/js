import { getValidChainRPCs } from "@thirdweb-dev/chains";
import type { PaperWalletConnector } from "../connectors/paper";
import {
  PaperWalletAdditionalOptions as PaperWalletAdditionalOptions_,
  PaperWalletConnectionArgs,
} from "../connectors/paper/types";
import { walletIds } from "../constants/walletIds";
import { ConnectParams, Connector } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";

export type { PaperWalletAdditionalOptions } from "../connectors/paper/types";

export type PaperWalletOptions = WalletOptions<PaperWalletAdditionalOptions_>;

export class PaperWallet extends AbstractClientWallet<
  PaperWalletAdditionalOptions_,
  PaperWalletConnectionArgs
> {
  connector?: Connector;

  static id = walletIds.paper as string;

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
  onAuthSuccess: PaperWalletAdditionalOptions_["onAuth"];

  constructor(options: PaperWalletOptions) {
    super(PaperWallet.id, {
      ...options,
    });

    try {
      this.chain = {
        ...options.chain,
        rpc: getValidChainRPCs(options.chain, options.clientId),
      };
    } catch {
      this.chain = options.chain;
    }

    if (options.paperClientId && options.paperClientId === "uninitialized") {
      this.paperClientId = "00000000-0000-0000-0000-000000000000";
      return;
    }

    if (
      options.advancedOptions &&
      options.advancedOptions?.recoveryShareManagement === "USER_MANAGED"
    ) {
      // checks to see if we are trying to use USER_MANAGED with thirdweb client ID. If so, we throw an error.
      if (
        (options.paperClientId &&
          !this.isClientIdLegacyPaper(options.paperClientId)) ||
        (!options.paperClientId &&
          options.clientId &&
          !this.isClientIdLegacyPaper(options.clientId))
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
    this.onAuthSuccess = options.onAuthSuccess;
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
        onAuthSuccess: this.onAuthSuccess,
        advancedOptions: {
          recoveryShareManagement:
            this.options?.advancedOptions?.recoveryShareManagement,
        },
        styles: this.options?.styles,
      });
    }
    return this.connector;
  }

  getConnectParams(): ConnectParams<PaperWalletConnectionArgs> | undefined {
    const connectParams = super.getConnectParams();

    if (!connectParams) {
      return undefined;
    }

    // do not return non-serializable params to make auto-connect work
    if (typeof connectParams.googleLogin === "object") {
      return {
        ...connectParams,
        googleLogin: true,
      };
    }

    return connectParams;
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
