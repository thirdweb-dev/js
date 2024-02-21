import type { ThirdwebClient } from "../../../../../index.js";
import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
} from "../../interfaces/auth.js";
import type {
  ClientIdWithQuerierType,
  LogoutReturnType,
  SendEmailOtpReturnType,
} from "../../interfaces/embedded-wallets/embedded-wallets.js";
import { LocalStorage } from "../../utils/Storage/LocalStorage.js";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator.js";
import { BaseLogin } from "./base-login.js";

export type AuthQuerierTypes = {
  logout: void;
  initIframe: {
    clientId: string;
    authCookie: string;
    walletUserId: string;
    deviceShareStored: string;
  };
};

/**
 *
 */
export class Auth {
  protected client: ThirdwebClient;
  protected AuthQuerier: EmbeddedWalletIframeCommunicator<AuthQuerierTypes>;
  protected localStorage: LocalStorage;
  protected onAuthSuccess: (
    authResults: AuthAndWalletRpcReturnType,
  ) => Promise<AuthLoginReturnType>;
  private BaseLogin: BaseLogin;

  /**
   * Used to manage the user's auth states. This should not be instantiated directly.
   * Call {@link EmbeddedWalletSdk.auth} instead.
   * @internal
   */
  constructor({
    client,
    querier,
    onAuthSuccess,
  }: ClientIdWithQuerierType & {
    onAuthSuccess: (
      authDetails: AuthAndWalletRpcReturnType,
    ) => Promise<AuthLoginReturnType>;
  }) {
    this.client = client;

    this.AuthQuerier = querier;
    this.localStorage = new LocalStorage({ clientId: client.clientId });
    this.onAuthSuccess = onAuthSuccess;
    this.BaseLogin = new BaseLogin({
      postLogin: async (result) => {
        return this.postLogin(result);
      },
      preLogin: async () => {
        await this.preLogin();
      },
      querier: querier,
      client,
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

  /**
   * Used to log the user into their thirdweb wallet on your platform via a myriad of auth providers
   * @example
   * ```typescript
   * const thirdwebEmbeddedWallet = new EmbeddedWalletSdk({clientId: "YOUR_CLIENT_ID", chain: "Polygon"})
   * try {
   *   const user = await thirdwebEmbeddedWallet.auth.loginWithModal();
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

  /**
   * Used to log the user into their thirdweb wallet using email OTP
   * @example
   * ```typescript
   *  // Basic Flow
   *  const thirdwebEmbeddedWallet = new EmbeddedWalletSdk({clientId: "", chain: "Polygon"});
   *  try {
   *    // prompts user to enter the code they received
   *    const user = await thirdwebEmbeddedWallet.auth.loginWithThirdwebEmailOtp({ email : "you@example.com" });
   *    // user is now logged in
   *  } catch (e) {
   *    // User closed the OTP modal or something else went wrong during the authentication process
   *    console.error(e)
   *  }
   * ```
   * @param args - args.email: We will send the email an OTP that needs to be entered in order for them to be logged in.
   * @returns `{{user: InitializedUser}}` An InitializedUser object. See {@link EmbeddedWalletSdk.getUser} for more
   */
  async loginWithEmailOtp(
    args: Parameters<BaseLogin["loginWithEmailOtp"]>[0],
  ): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithEmailOtp(args);
  }

  /**
   * @internal
   */
  async loginWithCustomJwt(
    args: Parameters<BaseLogin["loginWithCustomJwt"]>[0],
  ): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithCustomJwt(args);
  }

  /**
   * @internal
   */
  async loginWithCustomAuthEndpoint(
    args: Parameters<BaseLogin["loginWithCustomAuthEndpoint"]>[0],
  ): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithCustomAuthEndpoint(args);
  }

  /**
   * @internal
   */
  async loginWithOauth(
    args: Parameters<BaseLogin["loginWithOauth"]>[0],
  ): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithOauth(args);
  }

  /**
   * A headless way to send the users at the passed email an OTP code.
   * You need to then call {@link Auth.verifyEmailLoginOtp} in order to complete the login process
   * @example
   * @param param0.email
   * ```typescript
   *  const thirdwebEmbeddedWallet = new EmbeddedWalletSdk({clientId: "", chain: "Polygon"});
   *  // sends user an OTP code
   * try {
   *    await thirdwebEmbeddedWallet.auth.sendEmailLoginOtp({ email : "you@example.com" });
   * } catch(e) {
   *    // Error Sending user's email an OTP code
   *    console.error(e);
   * }
   *
   * // Then when your user is ready to verify their OTP
   * try {
   *    const user = await thirdwebEmbeddedWallet.auth.verifyEmailLoginOtp({ email: "you@example.com", otp: "6-DIGIT_CODE_HERE" });
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
   * Used to verify the otp that the user receives from thirdweb
   *
   * See {@link Auth.sendEmailLoginOtp} for how the headless call flow looks like. Simply swap out the calls to `loginWithThirdwebEmailOtp` with `verifyThirdwebEmailLoginOtp`
   * @param args - props.email We will send the email an OTP that needs to be entered in order for them to be logged in.
   * props.otp The code that the user received in their email
   * @returns `{{user: InitializedUser}}` An InitializedUser object containing the user's status, wallet, authDetails, and more
   * @internal
   */
  async verifyEmailLoginOtp(
    args: Parameters<BaseLogin["verifyEmailLoginOtp"]>[0],
  ) {
    return this.BaseLogin.verifyEmailLoginOtp(args);
  }

  /**
   * Logs any existing user out of their wallet.
   * @returns `{{success: boolean}}` true if a user is successfully logged out. false if there's no user currently logged in.
   * @internal
   */
  async logout(): Promise<LogoutReturnType> {
    const { success } = await this.AuthQuerier.call<LogoutReturnType>({
      procedureName: "logout",
      params: undefined,
    });
    const isRemoveAuthCookie = await this.localStorage.removeAuthCookie();
    const isRemoveUserId = await this.localStorage.removeWalletUserId();

    return {
      success: success || isRemoveAuthCookie || isRemoveUserId,
    };
  }
}
