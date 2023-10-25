import { getValidChainRPCs } from "@thirdweb-dev/chains";
import type { EmbeddedWalletConnector } from "../connectors/embedded-wallet";
import {
  AuthParams,
  EmbeddedWalletAdditionalOptions,
  EmbeddedWalletConnectionArgs,
} from "../connectors/embedded-wallet/types";
import { walletIds } from "../constants/walletIds";
import { ConnectParams, Connector } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";

export type EmbeddedWalletOptions =
  WalletOptions<EmbeddedWalletAdditionalOptions>;

export type { EmbeddedWalletAdditionalOptions } from "../connectors/embedded-wallet/types";

export class EmbeddedWallet extends AbstractClientWallet<
  EmbeddedWalletAdditionalOptions,
  EmbeddedWalletConnectionArgs
> {
  connector?: Connector;

  static id = walletIds.embeddedWallet as string;

  static meta = {
    name: "Embedded Wallet",
    iconURL:
      "ipfs://QmNx2evQa6tcQs9VTd3YaDm31ckfStvgRGKFGELahUmrbV/emailIcon.svg",
  };

  public get walletName() {
    return "Embedded Wallet" as const;
  }

  chain: EmbeddedWalletAdditionalOptions["chain"];

  constructor(options: EmbeddedWalletOptions) {
    super(EmbeddedWallet.id, {
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
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      // import the connector dynamically
      const { EmbeddedWalletConnector } = await import(
        "../connectors/embedded-wallet"
      );
      this.connector = new EmbeddedWalletConnector({
        clientId: this.options?.clientId ?? "",
        chain: this.chain,
        chains: this.chains,
        styles: this.options?.styles,
      });
    }
    return this.connector;
  }

  getConnectParams(): ConnectParams<EmbeddedWalletConnectionArgs> | undefined {
    const connectParams = super.getConnectParams();

    if (!connectParams) {
      return undefined;
    }

    // do not return non-serializable params to make auto-connect work
    if (connectParams.authData.strategy === "google") {
      return {
        authData: connectParams.authData,
        chainId: connectParams.chainId,
      };
    }

    return connectParams;
  }

  async getEmail() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getEmail();
  }

  async getEmbeddedWalletSDK() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getEmbeddedWalletSDK();
  }

  // TODO move to connect callback
  async getRecoveryInformation() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getRecoveryInformation();
  }

  async authenticate(params: AuthParams) {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.authenticate(params);
  }
}
