import { Connector, WagmiAdapter } from "../interfaces/connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import { MagicAuthOptions } from "../connectors/magic/types";
import type {
  MagicAuthConnectOptions,
  MagicAuthConnector as MagicAuthConnectorType,
} from "../connectors/magic";
import type {
  OAuthProvider as _OAuthProvider,
  OAuthRedirectResult,
} from "@magic-ext/oauth";
import { walletIds } from "../constants/walletIds";

export type MagicLinkAdditionalOptions = MagicAuthOptions;
export type MagicLinkOptions = WalletOptions<MagicAuthOptions>;
export type MagicLinkConnectOptions = MagicAuthConnectOptions;
export type MagicOAuthProvider = _OAuthProvider;

/**
 * Allows users to connect to your app using [Magic Auth](https://magic.link/docs/auth/overview) or [Magic Connect](https://magic.link/docs/connect/overview)
 *
 * Magic is a developer SDK that integrates with your application to enable passwordless Web3 onboarding (no seed phrases) and authentication using magic links
 *
 *
 * @example
 *
 * Magic offers two flavors of our SDK: Magic Connect, which provides a plug-and-play experience, and Magic Auth, a customizable white-labeled wallet solution.
 *
 * ##  Magic Auth
 *
 * #### Login with Email or Phone Number
 *
 * With below configuration, users will be able to log in using their email or phone number.
 *
 * If you want to restrict login via email only - pass `smsLogin:false`. If you want to restrict login via phone number only - pass `emailLogin:false` to the `MagicLink` constructor.
 *
 * ```javascript
 * import { MagicLink } from "@thirdweb-dev/wallets";
 *
 * const wallet = new MagicLink({
 *   apiKey: "YOUR_API_KEY",
 *   type: "auth",
 * });
 *
 * // connect with email or phone number
 *
 * await wallet.connect({
 *   email: "user@example.com",
 * });
 *
 * // OR
 *
 * await wallet.connect({
 *   phoneNumber: "+123456789",
 * });
 * ```
 *
 *
 * #### Social Login
 *
 * ```javascript
 * import { MagicLink } from "@thirdweb-dev/wallets";
 *
 * const wallet = new MagicLink({
 *   apiKey: "YOUR_API_KEY",
 *   type: "auth",
 *
 *   // specify which Oauth providers to enable
 *   // and the URI to redirect to after the oauth flow is complete
 *   oauthOptions: {
 *     redirectURI: "https://example.com/foobar",
 *     providers: ["google", "facebook"],
 *   },
 * });
 *
 * // connect with a oauth provider
 * await magic.connect({
 *   oauthProvider: "google",
 * });
 * ```
 *
 * ## Magic Connect
 *
 * ```javascript
 * import { MagicLink } from "@thirdweb-dev/wallets";
 *
 * const wallet = new MagicLink({
 *   apiKey: "YOUR_API_KEY",
 *   type: "connect",
 * });
 *
 * await wallet.connect();
 * ```
 *
 * @wallet
 */
export class MagicLink extends AbstractClientWallet<
  MagicLinkOptions,
  MagicAuthConnectOptions
> {
  /**
   * @internal
   */
  connector?: Connector;
  /**
   * @internal
   */
  magicConnector?: MagicAuthConnectorType;
  /**
   * @internal
   */
  oAuthRedirectResult?: OAuthRedirectResult;

  /**
   * @internal
   */
  static meta = {
    iconURL:
      "ipfs://QmUMBFZGXxBpgDmZzZAHhbcCL5nYvZnVaYLTajsNjLcxMU/1-Icon_Magic_Color.svg",
    name: "Magic Link",
  };

  /**
   * @internal
   */
  static id = walletIds.magicLink as string;

  /**
   * @internal
   */
  public get walletName() {
    return "Magic Link" as const;
  }

  /**
   * @internal
   */
  options: MagicLinkOptions;

  /**
   * Create an instance of the `MagicLink` wallet
   * @param options -
   * The `options` object includes the following properties:
   *
   * ### apiKey (required)
   * Your Magic Link apiKey. You can get an API key by signing up for an account on [Magic Link's website](https://magic.link/).
   *
   * Must be a `string`.
   *
   * ### clientId (recommended)
   * Provide `clientId` to use the thirdweb RPCs for given `chains`
   *
   * You can create a client ID for your application from [thirdweb dashboard](https://thirdweb.com/create-api-key).
   *
   * ### type (optional)
   * Whether to use [Magic Auth](https://magic.link/docs/auth/overview) or [Magic Connect](https://magic.link/docs/connect/overview) to connect to the wallet.
   *
   * Default is `"auth"`.
   *
   * ```ts
   * type: "auth" | "connect";
   * ```
   *
   * ### magicSdkConfiguration (optional)
   * Configuration for [Magic Auth](https://magic.link/docs/auth/overview) SDK.
   *
   * This is only relevant if you are using `type: 'auth'`.
   *
   * ```ts
   * {
   *   locale?: string;
   *   endpoint?: string;
   *   testMode?: boolean;
   * }
   * ```
   *
   * * locale (optional) - Customize the language of Magic's modal, email and confirmation screen. See [Localization](https://magic.link/docs/auth/more/customization/localization) for more.
   *
   * * endpoint (optional) - A URL pointing to the Magic iframe application.
   *
   * * testMode (optional) - Enable [testMode](https://magic.link/docs/auth/introduction/test-mode) to assert the desired behavior through the email address so that you don't have to go through the auth flow.
   *
   *
   * ### smsLogin
   * Specify whether you want to allow users to log in with their phone number or not. It is `true` by default
   *
   * This is only relevant if you are using `type: 'auth'`.
   *
   * Must be a `boolean`.
   *
   * ### emailLogin (optional)
   * Specify whether you want to allow users to log in with their email or not. It is `true` by default
   *
   * This is only relevant if you are using `type: 'auth'`.
   *
   * Must be a `boolean`.
   *
   *
   * ### oauthOptions (optional)
   * Specify which oauth providers you support in `providers` array. This is only relevant if you are using `type: 'auth'`.
   *
   * Specify which URI to redirect to after the oauth flow is complete in `redirectURI` option. If no `redirectURI` is specified, the user will be redirected to the current page.
   *
   * You must pass full URL and not just a relative path. For example, `"https://example.com/foo"` is valid but `"/foo"` is not.
   * You can use `new URL("/foo", window.location.origin).href` to get the full URL from a relative path based on the current origin.
   *
   * You also need to enable the oauth providers for your apiKey from [Magic dashboard](https://dashboard.magic.link/).
   *
   * ```ts
   * type OauthOptions = {
   *   redirectURI?: string;
   *   providers: OauthProvider[];
   * };
   *
   * type OauthProvider =
   *   | "google"
   *   | "facebook"
   *   | "apple"
   *   | "github"
   *   | "bitbucket"
   *   | "gitlab"
   *   | "linkedin"
   *   | "twitter"
   *   | "discord"
   *   | "twitch"
   *   | "microsoft";
   * ```
   *
   * ```ts
   * const wallet = new MagicLink({
   *   apiKey: "YOUR_API_KEY",
   *   type: "auth",
   *   // specify which Oauth providers to enable
   *   oauthOptions: {
   *     redirectURI: new URL("/foo", window.location.origin).href,
   *     providers: ["google", "facebook", "github", "bitbucket"],
   *   },
   * });
   * ```
   *
   *
   * ### chains (optional)
   * Provide an array of chains you want to support.
   *
   * Must be an array of `Chain` objects, from the [`@thirdweb-dev/chains`](https://www.npmjs.com/package/\@thirdweb-dev/chains) package.
   *
   */
  constructor(options: MagicLinkOptions) {
    super(MagicLink.id, options);
    this.options = options;
  }

  /**
   * @internal
   */
  async initializeConnector() {
    // import the connector dynamically
    const { MagicAuthConnector } = await import("../connectors/magic");

    const magicConnector = new MagicAuthConnector({
      chains: this.chains,
      options: this.options,
    });

    this.magicConnector = magicConnector;
    this.connector = new WagmiAdapter(magicConnector);
    return this.connector;
  }

  protected async getConnector(): Promise<Connector> {
    if (!this.connector) {
      return await this.initializeConnector();
    }
    return this.connector;
  }

  /**
   * Get Magic Auth SDK instance. Learn more about [Magic Auth SDK](https://magic.link/docs/auth/overview)
   *
   * you use all methods available in the Magic Auth SDK from the SDK instance. Refer to [Magic Auth API](https://magic.link/docs/auth/api-reference/client-side-sdks/web) for more details.
   *
   * ```javascript
   * const magicSDK = await wallet.getMagic();
   * ```
   */
  getMagic() {
    if (!this.magicConnector) {
      throw new Error("Magic connector is not initialized");
    }
    return this.magicConnector.getMagicSDK();
  }

  /**
   * Auto connect wallet if the user is already logged in.
   * @returns
   */
  async autoConnect(options?: MagicAuthConnectOptions) {
    await this.initializeConnector();
    await this.magicConnector?.initializeMagicSDK(options);
    const magic = this.getMagic();

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const isMagicRedirect = url.searchParams.get("magic_credential");
      if (isMagicRedirect) {
        try {
          this.oAuthRedirectResult = await magic.oauth.getRedirectResult(); // required to do this for social login
        } catch {
          // ignore
        }
      }
    }

    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
      return super.autoConnect(options);
    }

    throw new Error("Magic user is not logged in");
  }

  /**
   * Disconnect wallet
   */
  async disconnect() {
    this.oAuthRedirectResult = undefined;
    const magic = this.getMagic();
    await magic.user.logout();
    return super.disconnect();
  }

  /**
   * Connect Wallet using Magic Auth or Magic Connect
   *
   * ### Magic Auth
   * There are three ways to call the `connect` function - `email` or `phoneNumber` or `oauthProvider`
   *
   * #### email
   * This opens the Magic Link's Modal and prompts the user to click on the link sent to their email.
   *
   * ```ts
   * await wallet.connect({
   *   email: "user@example.com",
   * });
   * ```
   *
   * #### phoneNumber
   * This opens the Magic Link's Modal and prompts the user to enter the OTP sent to their phone via SMS.
   *
   * ```ts
   * await wallet.connect({
   *   phoneNumber: "+123456789",
   * });
   * ```
   *
   * #### oauthProvider
   * This redirects the user to given provider's sign-in page and once the user is authenticated, it redirects the user back to the `redirectURI` provided in `MagicLink` constructor.
   *
   * ```ts
   * await magic.connect({
   *   oauthProvider: "google",
   * });
   * ```
   *
   * #### Additional Configuration
   *
   * ```typescript
   * wallet.connect({
   *   chainId: 5,
   * });
   * ```
   *
   * If `chainId` is provided, the wallet will be connected to the network with the given chainId, else it will be connected to the Ethereum Mainnet.
   *
   * ### Magic Connect
   * You can call the `connect` function without any arguments. Calling `connect` opens the Magic Link's Modal and prompts the user to login via Google or email.
   *
   * ```ts
   * await wallet.connect();
   * ```
   *
   * #### Additional Configuration
   *
   * ```typescript
   * wallet.connect({
   *   chainId: 5,
   * });
   * ```
   *
   * If `chainId` is provided, the wallet will be connected to the network with the given chainId, else it will be connected to the Ethereum Mainnet.
   *
   * @param options - The `options` object can include the following properties:
   * ### Magic Auth
   * If you are using `type: 'auth'`, you can pass any one of the following properties
   * - `email` - The email address of the user
   * - `phoneNumber` - The phone number of the user
   * - `oauthProvider` - The oauth provider to use for login
   *
   * ### Magic Connect
   * If you are using `type: 'connect'`, you don't need to pass any arguments to `connect` function.
   *
   * @returns
   */
  async connect(options: MagicAuthConnectOptions) {
    if ("email" in options && this.options.emailLogin === false) {
      throw new Error("Email login is disabled");
    }

    if ("phoneNumber" in options && this.options.smsLogin === false) {
      throw new Error("SMS login is disabled");
    }

    return super.connect(options);
  }
}
