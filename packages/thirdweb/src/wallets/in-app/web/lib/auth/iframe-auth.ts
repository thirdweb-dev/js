import type { ThirdwebClient } from "../../../../../client/client.js";
import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  AuthStoredTokenWithCookieReturnType,
  LogoutReturnType,
  SendEmailOtpReturnType,
} from "../../../core/authentication/type.js";
import type { ClientIdWithQuerierType, Ecosystem } from "../../types.js";
import { LocalStorage } from "../../utils/Storage/LocalStorage.js";
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
    deviceShareStored: string;
  };
  loginWithStoredTokenDetails: {
    storedToken: AuthStoredTokenWithCookieReturnType["storedToken"];
    recoveryCode?: string;
  };
};

/**
 *
 */
export class Auth {
  protected client: ThirdwebClient;
  protected AuthQuerier: InAppWalletIframeCommunicator<AuthQuerierTypes>;
  protected localStorage: LocalStorage;
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
  }: ClientIdWithQuerierType & {
    baseUrl: string;
    ecosystem?: Ecosystem;
    onAuthSuccess: (
      authDetails: AuthAndWalletRpcReturnType,
    ) => Promise<AuthLoginReturnType>;
  }) {
    this.client = client;

    this.AuthQuerier = querier;
    this.localStorage = new LocalStorage({
      clientId: client.clientId,
      ecosystemId: ecosystem?.id,
    });
    this.onAuthSuccess = onAuthSuccess;
    this.BaseLogin = new BaseLogin({
      postLogin: async (result) => {
        return this.postLogin(result);
      },
      preLogin: async () => {
        await this.preLogin();
      },
      ecosystem,
      querier: querier,
      client,
      baseUrl,
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
    await this.preLogin();
    const result = await this.AuthQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithStoredTokenDetails",
      params: {
        storedToken: authToken.storedToken,
        recoveryCode,
      },
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
  async verifyEmailLoginOtp(
    args: Parameters<BaseLogin["verifyEmailLoginOtp"]>[0],
  ) {
    return this.BaseLogin.verifyEmailLoginOtp(args);
  }

  /**
   * @internal
   */
  async verifySmsLoginOtp(args: Parameters<BaseLogin["verifySmsLoginOtp"]>[0]) {
    return this.BaseLogin.verifySmsLoginOtp(args);
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
