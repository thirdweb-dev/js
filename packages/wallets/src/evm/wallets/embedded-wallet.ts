import { getValidChainRPCs } from "@thirdweb-dev/chains";
import { EmbeddedWalletConnector } from "../connectors/embedded-wallet";
import {
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
    if (connectParams.loginType === "headless_google_oauth") {
      return {
        loginType: connectParams.loginType,
        chainId: connectParams.chainId,
      };
    }

    return connectParams;
  }

  async sendEmailOtp({ email }: { email: string }) {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.sendEmailOtp({ email });
  }

  async getEmail() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getEmail();
  }

  async getEmbeddedWalletSDK() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getEmbeddedWalletSDK();
  }
}
