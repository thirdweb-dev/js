import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
} from "../../interfaces/auth";
import type {
  ClientIdWithQuerierType,
  LogoutReturnType,
  SendEmailOtpReturnType,
} from "../../interfaces/embedded-wallets/embedded-wallets";
import { LocalStorage } from "../../utils/Storage/LocalStorage";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";
import { BaseLogin } from "./base-login";

export type AuthQuerierTypes = {
  logout: void;
};

export class Auth {
  protected clientId: string;
  protected AuthQuerier: EmbeddedWalletIframeCommunicator<AuthQuerierTypes>;
  protected localStorage: LocalStorage;
  protected onAuthSuccess: (
    authResults: AuthAndWalletRpcReturnType,
  ) => Promise<AuthLoginReturnType>;
  private BaseLogin: BaseLogin;

  /**
   * Used to manage the user's auth states. This should not be instantiated directly.
   * Call {@link ThirdwebEmbeddedWalletSdk.auth} instead.
   *
   * @param {string} params.clientId the clientId from your thirdweb dashboard
   */
  constructor({
    clientId,
    querier,
    onAuthSuccess,
  }: ClientIdWithQuerierType & {
    onAuthSuccess: (
      authDetails: AuthAndWalletRpcReturnType,
    ) => Promise<AuthLoginReturnType>;
  }) {
    this.clientId = clientId;

    this.AuthQuerier = querier;
    this.localStorage = new LocalStorage({ clientId });
    this.onAuthSuccess = onAuthSuccess;
    this.BaseLogin = new BaseLogin({
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

  /**
   * @description
   * Used to log the user into their thirdweb wallet on your platform via a myriad of auth providers
   *
   * @example
   * const thirdweb = new ThirdwebEmbeddedWalletSdk({clientId: "YOUR_CLIENT_ID", chain: "Polygon"})
   * try {
   *   const user = await Thirdweb.auth.loginWithThirdwebModal();
   *   // user is now logged in
   * } catch (e) {
   *   // User closed modal or something else went wrong during the authentication process
   *   console.error(e)
   * }
   *
   * @param {(userWalletId: string) => Promise<string | undefined>} args.getRecoveryCode Only present when using RecoveryShareManagement.USER_MANAGED recovery share management. A function that returns the recovery code for a given userWalletId.
   *
   * @returns {{user: InitializedUser}} An InitializedUser object. See {@link ThirdwebEmbeddedWalletSdk.getUser} for more
   */
  async loginWithThirdwebModal(): Promise<AuthLoginReturnType> {
    await this.preLogin();

    return this.BaseLogin.loginWithThirdwebModal();
  }

  /**
   * @description
   * Used to log the user into their thirdweb wallet using email OTP
   *
   * @example
   *  // Basic Flow
   *  const thirdweb = new ThirdwebEmbeddedWalletSdk({clientId: "", chain: "Polygon"});
   *  try {
   *    // prompts user to enter the code they received
   *    const user = await thirdweb.auth.loginWithThirdwebEmailOtp({ email : "you@example.com" });
   *    // user is now logged in
   *  } catch (e) {
   *    // User closed the OTP modal or something else went wrong during the authentication process
   *    console.error(e)
   *  }
   *
   * @param {string} props.email We will send the email an OTP that needs to be entered in order for them to be logged in.
   * @returns {{user: InitializedUser}} An InitializedUser object. See {@link ThirdwebEmbeddedWalletSdk.getUser} for more
   */
  async loginWithThirdwebEmailOtp(
    args: Parameters<BaseLogin["loginWithThirdwebOtp"]>[0],
  ): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithThirdwebOtp(args);
  }

  async loginWithGoogle(): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithGoogle();
  }

  /**
   * @description
   * A headless way to send the users at {email} an OTP code.
   * You need to then call {@link Auth.verifyThirdwebEmailLoginOtp} in order to complete the login process
   *
   * @example
   *  const thirdweb = new ThirdwebEmbeddedWalletSdk({clientId: "", chain: "Polygon"});
   *  // sends user an OTP code
   * try {
   *    await thirdweb.auth.sendThirdwebEmailLoginOtp({ email : "you@example.com" });
   * } catch(e) {
   *    // Error Sending user's email an OTP code
   *    console.error(e);
   * }
   *
   * // Then when your user is ready to verify their OTP
   * try {
   *    const user = await thirdweb.auth.verifyThirdwebEmailLoginOtp({ email: "you@example.com", otp: "6-DIGIT_CODE_HERE" });
   * } catch(e) {
   *    // Error verifying the OTP code
   *    console.error(e)
   * }
   *
   * @param {string} props.email We will send the email an OTP that needs to be entered in order for them to be logged in.
   * @returns {{ success: boolean, isNewUser: boolean }} Success: indicating if the email was successfully sent (Note the email could still end up in the user's spam folder). IsNewUser indicates if the user is a new user to your platform
   */
  async sendThirdwebEmailLoginOtp({
    email,
  }: Parameters<
    BaseLogin["sendThirdwebEmailLoginOtp"]
  >[0]): Promise<SendEmailOtpReturnType> {
    return this.BaseLogin.sendThirdwebEmailLoginOtp({
      email,
    });
  }

  /**
   *  @description
   * Used to verify the otp that the user receives from thirdweb
   *
   * See {@link Auth.sendThirdwebEmailLoginOtp} for how the headless call flow looks like. Simply swap out the calls to `loginWithThirdwebEmailOtp` with `verifyThirdwebEmailLoginOtp`
   *
   * @param {string} props.email We will send the email an OTP that needs to be entered in order for them to be logged in.
   * @param {string} props.otp The code that the user received in their email
   * @returns {{user: InitializedUser}} An InitializedUser object containing the user's status, wallet, authDetails, and more
   */
  async verifyThirdwebEmailLoginOtp(
    args: Parameters<BaseLogin["verifyThirdwebEmailLoginOtp"]>[0],
  ) {
    return this.BaseLogin.verifyThirdwebEmailLoginOtp(args);
  }

  /**
   * @description
   * Logs any existing user out of their wallet.
   * @returns {{success: boolean}} true if a user is successfully logged out. false if there's no user currently logged in.
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
