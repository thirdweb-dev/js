import type { ThirdwebClient } from "../../../../../client/client.js";
import { generateWallet } from "../../../core/actions/generate-wallet.enclave.js";
import { getUserStatus } from "../../../core/actions/get-enclave-user-status.js";
import type { ClientScopedStorage } from "../../../core/authentication/client-scoped-storage.js";
import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  AuthStoredTokenWithCookieReturnType,
  LogoutReturnType,
  SendEmailOtpReturnType,
} from "../../../core/authentication/types.js";
import type { Ecosystem } from "../../../core/wallet/types.js";
import type { ClientIdWithQuerierType } from "../../types.js";
import type { InAppWalletIframeCommunicator } from "../../utils/iFrameCommunication/InAppWalletIframeCommunicator.js";
import { BaseLogin } from "./base-login.js";

export type AuthQuerierTypes = {
  logout: undefined;
  initIframe: {
    partnerId?: string;
    ecosystemId?: string;
    clientId: string;
    authCookie: string;
    walletUserId: string;
    deviceShareStored: string | null;
  };
  loginWithStoredTokenDetails: {
    storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
    recoveryCode?: string;
  };
  migrateFromShardToEnclave: {
    storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
  };
};

/**
 *
 */
export class Auth {
  protected client: ThirdwebClient;
  protected ecosystem?: Ecosystem;
  protected AuthQuerier: InAppWalletIframeCommunicator<AuthQuerierTypes>;
  protected localStorage: ClientScopedStorage;
  protected onAuthSuccess: (
    authResults: AuthAndWalletRpcReturnType,
  ) => Promise<AuthLoginReturnType>;
  private BaseLogin: BaseLogin;

  /**
   * Used to manage the user's auth states. This should not be instantiated directly.
   * @internal
   */
  constructor({
    client,
    querier,
    onAuthSuccess,
    ecosystem,
    baseUrl,
    localStorage,
  }: ClientIdWithQuerierType & {
    baseUrl: string;
    ecosystem?: Ecosystem;
    onAuthSuccess: (
      authDetails: AuthAndWalletRpcReturnType,
    ) => Promise<AuthLoginReturnType>;
    localStorage: ClientScopedStorage;
  }) {
    this.client = client;
    this.ecosystem = ecosystem;

    this.AuthQuerier = querier;
    this.localStorage = localStorage;
    this.onAuthSuccess = onAuthSuccess;
    this.BaseLogin = new BaseLogin({
      baseUrl,
      client,
      ecosystem,
      postLogin: async (result) => {
        return this.postLogin(result);
      },
      preLogin: async () => {
        await this.preLogin();
      },
      querier: querier,
    });
  }

  private async preLogin() {
    await this.logout();
  }

  private async postLogin({
    storedToken,
    walletDetails,
  }: AuthAndWalletRpcReturnType): Promise<AuthLoginReturnType> {
    if (storedToken.shouldStoreCookieString) {
      await this.localStorage.saveAuthCookie(storedToken.cookieString);
    }
    const initializedUser = await this.onAuthSuccess({
      storedToken,
      walletDetails,
    });
    return initializedUser;
  }

  async loginWithAuthToken(
    authToken: AuthStoredTokenWithCookieReturnType,
    recoveryCode?: string,
  ): Promise<AuthLoginReturnType> {
    // We don't call logout for backend auth because that is handled on the backend where the iframe isn't available to call. Moreover, logout clears the local storage which isn't applicable for backend auth.
    if (authToken.storedToken.authProvider !== "Backend") {
      await this.preLogin();
    }

    const user = await getUserStatus({
      authToken: authToken.storedToken.cookieString,
      client: this.client,
      ecosystem: this.ecosystem,
    });
    if (!user) {
      throw new Error("Cannot login, no user found for auth token");
    }

    // If they're already an enclave wallet, proceed to login
    if (user.wallets.length > 0 && user.wallets[0]?.type === "enclave") {
      return this.postLogin({
        storedToken: authToken.storedToken,
        walletDetails: {
          walletAddress: user.wallets[0].address,
        },
      });
    }

    if (user.wallets.length === 0) {
      // If this is a new ecosystem wallet without an enclave yet, we'll generate an enclave
      const result = await generateWallet({
        authToken: authToken.storedToken.cookieString,
        client: this.client,
        ecosystem: this.ecosystem,
      });
      return this.postLogin({
        storedToken: authToken.storedToken,
        walletDetails: {
          walletAddress: result.address,
        },
      });
    }

    // If this is an existing sharded wallet or in-app wallet, we'll login with the sharded wallet
    const result = await this.AuthQuerier.call<AuthAndWalletRpcReturnType>({
      params: {
        recoveryCode,
        storedToken: authToken.storedToken,
      },
      procedureName: "loginWithStoredTokenDetails",
    });
    return this.postLogin(result);
  }

  /**
   * Used to log the user into their thirdweb wallet on your platform via a myriad of auth providers
   * @example
   * ```typescript
   * const thirdwebInAppWallet = new InAppWalletSdk({clientId: "YOUR_CLIENT_ID", chain: "Polygon"})
   * try {
   *   const user = await thirdwebInAppWallet.auth.loginWithModal();
   *   // user is now logged in
   * } catch (e) {
   *   // User closed modal or something else went wrong during the authentication process
   *   console.error(e)
   * }
   * ```
   * @returns `{{user: InitializedUser}}` An InitializedUser object.
   */
  async loginWithModal(): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithModal();
  }
  async authenticateWithModal(): Promise<AuthAndWalletRpcReturnType> {
    return this.BaseLogin.authenticateWithModal();
  }

  /**
   * Used to log the user into their thirdweb wallet using email OTP
   * @example
   * ```typescript
   *  // Basic Flow
   *  const thirdwebInAppWallet = new InAppWalletSdk({clientId: "", chain: "Polygon"});
   *  try {
   *    // prompts user to enter the code they received
   *    const user = await thirdwebInAppWallet.auth.loginWithThirdwebEmailOtp({ email : "you@example.com" });
   *    // user is now logged in
   *  } catch (e) {
   *    // User closed the OTP modal or something else went wrong during the authentication process
   *    console.error(e)
   *  }
   * ```
   * @param args - args.email: We will send the email an OTP that needs to be entered in order for them to be logged in.
   * @returns `{{user: InitializedUser}}` An InitializedUser object. See {@link InAppWalletSdk.getUser} for more
   */
  async loginWithIframe(
    args: Parameters<BaseLogin["loginWithIframe"]>[0],
  ): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithIframe(args);
  }
  async authenticateWithIframe(
    args: Parameters<BaseLogin["authenticateWithIframe"]>[0],
  ): Promise<AuthAndWalletRpcReturnType> {
    return this.BaseLogin.authenticateWithIframe(args);
  }

  /**
   * @internal
   */
  async loginWithCustomJwt(
    args: Parameters<BaseLogin["loginWithCustomJwt"]>[0],
  ): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithCustomJwt(args);
  }
  async authenticateWithCustomJwt(
    args: Parameters<BaseLogin["authenticateWithCustomJwt"]>[0],
  ): Promise<AuthAndWalletRpcReturnType> {
    return this.BaseLogin.authenticateWithCustomJwt(args);
  }

  /**
   * @internal
   */
  async loginWithCustomAuthEndpoint(
    args: Parameters<BaseLogin["loginWithCustomAuthEndpoint"]>[0],
  ): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithCustomAuthEndpoint(args);
  }
  async authenticateWithCustomAuthEndpoint(
    args: Parameters<BaseLogin["authenticateWithCustomAuthEndpoint"]>[0],
  ): Promise<AuthAndWalletRpcReturnType> {
    return this.BaseLogin.authenticateWithCustomAuthEndpoint(args);
  }

  /**
   * A headless way to send the users at the passed email an OTP code.
   * You need to then call {@link Auth.loginWithEmailOtp} in order to complete the login process
   * @example
   * @param param0.email
   * ```typescript
   *  const thirdwebInAppWallet = new InAppWalletSdk({clientId: "", chain: "Polygon"});
   *  // sends user an OTP code
   * try {
   *    await thirdwebInAppWallet.auth.sendEmailLoginOtp({ email : "you@example.com" });
   * } catch(e) {
   *    // Error Sending user's email an OTP code
   *    console.error(e);
   * }
   *
   * // Then when your user is ready to verify their OTP
   * try {
   *    const user = await thirdwebInAppWallet.auth.verifyEmailLoginOtp({ email: "you@example.com", otp: "6-DIGIT_CODE_HERE" });
   * } catch(e) {
   *    // Error verifying the OTP code
   *    console.error(e)
   * }
   * ```
   * @param param0 - param0.email We will send the email an OTP that needs to be entered in order for them to be logged in.
   * @returns `{{ isNewUser: boolean }}` IsNewUser indicates if the user is a new user to your platform
   * @internal
   */
  async sendEmailLoginOtp({
    email,
  }: Parameters<
    BaseLogin["sendEmailLoginOtp"]
  >[0]): Promise<SendEmailOtpReturnType> {
    return this.BaseLogin.sendEmailLoginOtp({
      email,
    });
  }

  /**
   * @internal
   */
  async sendSmsLoginOtp({
    phoneNumber,
  }: Parameters<
    BaseLogin["sendSmsLoginOtp"]
  >[0]): Promise<SendEmailOtpReturnType> {
    return this.BaseLogin.sendSmsLoginOtp({
      phoneNumber,
    });
  }

  /**
   * Used to verify the otp that the user receives from thirdweb
   *
   * See {@link Auth.sendEmailLoginOtp} for how the headless call flow looks like. Simply swap out the calls to `loginWithThirdwebEmailOtp` with `verifyThirdwebEmailLoginOtp`
   * @param args - props.email We will send the email an OTP that needs to be entered in order for them to be logged in.
   * props.otp The code that the user received in their email
   * @returns `{{user: InitializedUser}}` An InitializedUser object containing the user's status, wallet, authDetails, and more
   * @internal
   */
  async loginWithEmailOtp(args: Parameters<BaseLogin["loginWithEmailOtp"]>[0]) {
    await this.preLogin();
    return this.BaseLogin.loginWithEmailOtp(args);
  }
  async authenticateWithEmailOtp(
    args: Parameters<BaseLogin["authenticateWithEmailOtp"]>[0],
  ) {
    return this.BaseLogin.authenticateWithEmailOtp(args);
  }

  /**
   * @internal
   */
  async loginWithSmsOtp(args: Parameters<BaseLogin["loginWithSmsOtp"]>[0]) {
    await this.preLogin();
    return this.BaseLogin.loginWithSmsOtp(args);
  }
  async authenticateWithSmsOtp(
    args: Parameters<BaseLogin["authenticateWithSmsOtp"]>[0],
  ) {
    return this.BaseLogin.authenticateWithSmsOtp(args);
  }

  /**
   * Logs any existing user out of their wallet.
   * @returns `{{success: boolean}}` true if a user is successfully logged out. false if there's no user currently logged in.
   * @internal
   */
  async logout(): Promise<LogoutReturnType> {
    const isRemoveAuthCookie = await this.localStorage.removeAuthCookie();
    const isRemoveUserId = await this.localStorage.removeWalletUserId();

    return {
      success: isRemoveAuthCookie || isRemoveUserId,
    };
  }
}
