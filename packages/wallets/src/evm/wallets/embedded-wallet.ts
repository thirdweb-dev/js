import { Ethereum, getValidChainRPCs } from "@thirdweb-dev/chains";
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

export type {
  AuthParams,
  AuthResult,
  EmbeddedWalletAdditionalOptions,
  EmbeddedWalletConnectionArgs,
  EmbeddedWalletOauthOptions,
} from "../connectors/embedded-wallet/types";

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

  /**
   * Sends a verification email to the provided email address.
   *
   * @param email - The email address to which the verification email will be sent.
   * @param clientId - Your thirdweb client ID
   * @returns Information on the user's status and whether they are a new user.
   *
   * @example
   * ```typescript
   * sendVerificationEmail({ email: 'test@example.com', clientId: 'yourClientId' })
   *   .then(() => console.log('Verification email sent successfully.'))
   *   .catch(error => console.error('Failed to send verification email:', error));
   * ```
   */
  static async sendVerificationEmail(options: {
    email: string;
    clientId: string;
  }) {
    const wallet = new EmbeddedWallet({
      chain: Ethereum,
      clientId: options.clientId,
    });
    return wallet.sendVerificationEmail({ email: options.email });
  }

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
        onAuthSuccess: this.options?.onAuthSuccess,
      });
    }
    return this.connector;
  }

  override autoConnect(
    connectOptions?: ConnectParams<EmbeddedWalletConnectionArgs> | undefined,
  ): Promise<string> {
    if (!connectOptions) {
      throw new Error("Can't autoconnect embedded wallet");
    }
    // override autoconnect logic for embedded wallet
    // can just call connect since we should have the authResult persisted already
    return this.connect(connectOptions);
  }

  getConnectParams(): ConnectParams<EmbeddedWalletConnectionArgs> | undefined {
    const connectParams = super.getConnectParams();

    if (!connectParams) {
      return undefined;
    }

    // omit non serializable/autoconnect-able
    return {
      chainId: connectParams.chainId,
      authResult: {
        user: connectParams.authResult.user,
      },
    };
  }

  async getEmail() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getEmail();
  }

  async getEmbeddedWalletSDK() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getEmbeddedWalletSDK();
  }

  // TODO move to connect/auth callback
  async getRecoveryInformation() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getRecoveryInformation();
  }

  async sendVerificationEmail({ email }: { email: string }) {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.sendVerificationEmail({ email });
  }

  async authenticate(params: AuthParams) {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.authenticate(params);
  }
}
