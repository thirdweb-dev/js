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
  EmbeddedWalletOauthStrategy,
} from "../connectors/embedded-wallet/types";

/**
 * Wallet interface to connect [Embedded Wallet](https://portal.thirdweb.com/embedded-wallet) which allows developers to implement seamless onboarding and login flows for their users.
 *
 * @example
 * ```javascript
 * import { EmbeddedWallet } from "@thirdweb-dev/wallets";
 * import { Ethereum } from "@thirdweb-dev/chains";
 *
 * const wallet = new EmbeddedWallet({
 *   chain: Ethereum, //  chain to connect to
 *   clientId: "YOUR_CLIENT_ID", // client ID
 * });
 *
 * const authResult = await wallet.authenticate({
 *   strategy: "google",
 * });
 *
 * const walletAddress = await wallet.connect({ authResult });
 * console.log("Connected as", walletAddress);
 * ```
 * @wallet
 */
export class EmbeddedWallet extends AbstractClientWallet<
  EmbeddedWalletAdditionalOptions,
  EmbeddedWalletConnectionArgs
> {
  /**
   * @internal
   */
  connector?: Connector;

  /**
   * @internal
   */
  static id = walletIds.embeddedWallet as string;

  /**
   * @internal
   */
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
   * EmbeddedWallet.sendVerificationEmail({ email: 'test@example.com', clientId: 'yourClientId' })
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

  /**
   * @internal
   */
  public get walletName() {
    return "Embedded Wallet" as const;
  }

  /**
   * @internal
   */
  chain: EmbeddedWalletAdditionalOptions["chain"];

  /**
   * The options for instantiating an `EmbeddedWallet`
   *
   * @param options -
   * The options object contains the following properties:
   *
   * ### clientId (required)
   * The chain to connect to by default.
   *
   * Must be a `Chain` object, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   * ### chain (required)
   * The chain to connect to by default.
   *
   * Must be a `Chain` object, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   *
   * ### chains (optional)
   * Provide an array of chains you want to support.
   *
   * Must be an array of `Chain` objects, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   */
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

  /**
   * auto connect the wallet if the wallet was previously connected and session is still valid
   */
  override autoConnect(
    connectOptions?: ConnectParams<EmbeddedWalletConnectionArgs> | undefined,
  ): Promise<string> {
    if (!connectOptions) {
      throw new Error("Can't autoconnect embedded wallet");
    }
    // override auto-connect logic for embedded wallet
    // can just call connect since we should have the authResult persisted already
    return this.connect(connectOptions);
  }

  /**
   * @internal
   */
  getConnectParams(): ConnectParams<EmbeddedWalletConnectionArgs> | undefined {
    const connectParams = super.getConnectParams();

    if (!connectParams) {
      return undefined;
    }

    // TODO (ews) omit non serializable/autoconnect-able
    return {
      chainId: connectParams.chainId,
      authResult: {
        user: connectParams.authResult.user,
      },
    };
  }

  /**
   * Get the email associated with the currently connected wallet.
   * @example
   * ```ts
   * ```javascript
   * const email = await wallet.getEmail();
   * ```
   */
  async getEmail() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getEmail();
  }

  /**
   * Get the instance of `EmbeddedWalletSdk` used by the wallet.
   */
  async getEmbeddedWalletSDK() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getEmbeddedWalletSDK();
  }

  // TODO move to connect/auth callback
  async getRecoveryInformation() {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.getRecoveryInformation();
  }

  /**
   * Send a verification code to the user's email for verification.
   * Use this as a prestep before calling `authenticate` with the `email_verification` strategy.
   *
   * ```javascript
   * const result = await wallet.sendVerificationEmail({
   *   email: "alice@example.com",
   * });
   * ```
   *
   * This method is also available as a static method on the `EmbeddedWallet` class.
   * ```javascript
   * const result = await EmbeddedWallet.sendVerificationEmail({
   *  email: "alice@example.com",
   * })
   * ```
   *
   * @param options - The `options` object contains the following properties:
   * ### email (required)
   * The email address to send verification email to.
   *
   * @returns object containing below properties:
   *
   * ```ts
   * {
   *  isNewDevice: boolean;
   *  isNewUser: boolean;
   *  recoveryShareManagement: "USER_MANAGED" | "AWS_MANAGED";
   * }
   * ```
   *
   * ### isNewDevice
   * If user has not logged in from this device before, this will be true.
   *
   * ### isNewUser
   * If user is logging in for the first time, this will be true.
   *
   * ### recoveryShareManagement
   * Recovery share management type. Can be either `USER_MANAGED` or `AWS_MANAGED`.
   *
   */
  async sendVerificationEmail(options: { email: string }) {
    const { email } = options;
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;
    return connector.sendVerificationEmail({ email });
  }

  /**
   * Authenticate the user with any of the available auth strategies.
   *
   * @example
   * ```javascript
   * const authResult = await wallet.authenticate({
   *   strategy: "google",
   * });
   * ```
   *
   * @param params -
   * Choose one of the available auth strategy, which comes with different required arguments.
   * ```ts
   * // email verification
   * type EmailVerificationAuthParams = {
   *   strategy: "email_verification";
   *   email: string;
   *   verificationCode: string;
   *   recoveryCode?: string;
   * };
   *
   * export type EmbeddedWalletOauthStrategy = "google" | "apple" | "facebook";
   *
   * type OauthAuthParams = {
   *   strategy: EmbeddedWalletOauthStrategy;
   *   openedWindow?: Window;
   *   closeOpenedWindow?: (window: Window) => void;
   * };
   *
   * // bring your own authentication
   * type JwtAuthParams = {
   *   strategy: "jwt";
   *   jwt: string;
   *   encryptionKey?: string;
   * };
   *
   * // open iframe to send and input the verification code only
   * type IframeOtpAuthParams = {
   *   strategy: "iframe_email_verification";
   *   email: string;
   * };
   *
   * // open iframe to enter email and verification code
   * type IframeAuthParams = {
   *   strategy: "iframe";
   * };
   * ```
   *
   * @returns
   * The `authResult` object - which you can pass to the `connect` method to connect to the wallet.
   *
   * ```ts
   * const authResult = await wallet.authenticate(authOptions);
   * await wallet.connect({ authResult });
   * ```
   */
  async authenticate(params: AuthParams) {
    const connector = (await this.getConnector()) as EmbeddedWalletConnector;

    const authResult = connector.authenticate(params);

    try {
      await this.walletStorage.setItem(
        LAST_USED_AUTH_STRATEGY,
        params.strategy,
      );
    } catch {
      // noop
    }

    return authResult;
  }

  /**
   * @internal
   */
  async getLastUsedAuthStrategy(): Promise<AuthParams["strategy"] | null> {
    try {
      return (await this.walletStorage.getItem(LAST_USED_AUTH_STRATEGY)) as
        | AuthParams["strategy"]
        | null;
    } catch {
      return null;
    }
  }

  /**
   * After authenticating, you can connect to the wallet by passing the `authResult` to the `connect` method.
   *
   * ```ts
   * const authResult = await wallet.authenticate(authOptions);
   *
   * await wallet.connect({ authResult });
   * ```
   *
   * @param connectOptions - The `connectOptions` object contains the following properties:
   *
   * ### authResult (required)
   *
   * The `authResult` object is returned from the `authenticate` method.
   *
   * @returns The address of the connected wallet.
   */
  connect(
    connectOptions?: ConnectParams<EmbeddedWalletConnectionArgs> | undefined,
  ): Promise<string> {
    return super.connect(connectOptions);
  }
}

const LAST_USED_AUTH_STRATEGY = "lastUsedAuthStrategy";
