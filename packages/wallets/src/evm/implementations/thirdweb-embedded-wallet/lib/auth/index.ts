import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  AuthProvider,
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
  loginWithJwtAuthCallback: {
    token: string;
    authProvider: AuthProvider;
    recoveryCode?: string;
  };
  logout: void;
  sendPaperEmailLoginOtp: { email: string };
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
   * Used to log the user into their Paper wallet on your platform via a myriad of auth providers
   *
   * @example
   * const Paper = new PaperEmbeddedWalletSdk({clientId: "YOUR_CLIENT_ID", chain: "Polygon"})
   * try {
   *   const user = await Paper.auth.loginWithPaperModal();
   *   // user is now logged in
   * } catch (e) {
   *   // User closed modal or something else went wrong during the authentication process
   *   console.error(e)
   * }
   *
   * @param {(userWalletId: string) => Promise<string | undefined>} args.getRecoveryCode Only present when using RecoveryShareManagement.USER_MANAGED recovery share management. A function that returns the recovery code for a given userWalletId.
   *
   * @returns {{user: InitializedUser}} An InitializedUser object. See {@link PaperEmbeddedWalletSdk.getUser} for more
   */
  async loginWithThirdwebModal(
    args?: Parameters<BaseLogin["loginWithThirdwebModal"]>[0],
  ): Promise<AuthLoginReturnType> {
    await this.preLogin();

    return this.BaseLogin.loginWithThirdwebModal(args);
  }

  /**
   * @description
   * Used to log the user into their Paper wallet using email OTP
   *
   * @example
   *  // Basic Flow
   *  const Paper = new PaperEmbeddedWalletSdk({clientId: "", chain: "Polygon"});
   *  try {
   *    // prompts user to enter the code they received
   *    const user = await Paper.auth.loginWithPaperEmailOtp({ email : "you@example.com" });
   *    // user is now logged in
   *  } catch (e) {
   *    // User closed the OTP modal or something else went wrong during the authentication process
   *    console.error(e)
   *  }
   *
   * @example
   *  // If you want users to never be prompted for a recovery code.
   *  const Paper = new PaperEmbeddedWalletSdk({clientId: "", chain: "Polygon"});
   *  try {
   *    const email = "you@example.com";
   *
   *    // getRecoveryCodeForUser is a function to get a recovery code based on an email
   *    // you write the function below
   *    const recoveryCode: string | undefined = await getRecoveryCodeForUser(email);
   *
   *    // prompts user to enter the code they received
   *    // Because you pass in a recovery code wherever possible, for existing users on a new device, they would not be prompted to enter the recovery code flow
   *    const user = await Paper.auth.loginWithPaperEmailOtp({ email, recoveryCode });
   *    // user is now logged in
   *    if (user.authDetails.recoveryCode) {
   *      // user has a recovery code that you can store to pass in to the function above
   *      // you write the function below
   *      await storeRecoveryCodeForUser(email, user.authDetails.recoveryCode);
   *    }
   *  } catch (e) {
   *    // User closed the OTP modal or something else went wrong during the authentication process
   *    console.error(e)
   *  }
   *
   * @param {string} props.email We will send the email an OTP that needs to be entered in order for them to be logged in.
   * @param {string} props.recoveryCode Only present when using RecoveryShareManagement.USER_MANAGED recovery share management. Specifies the recoveryCode for the given email. This will set recoveryCode as the code for the user if they are new, or user recoveryCode for the user if they are an existing user
   * @returns {{user: InitializedUser}} An InitializedUser object. See {@link ThirdwebEmbeddedWalletSdk.getUser} for more
   */
  async loginWithThirdwebEmailOtp(
    args: Parameters<BaseLogin["loginWithThirdwebOtp"]>[0],
  ): Promise<AuthLoginReturnType> {
    return this.BaseLogin.loginWithThirdwebOtp(args);
  }

  /**
   * @description
   * A headless way to send the users at {email} an OTP code.
   * You need to then call {@link Auth.verifyThirdwebEmailLoginOtp} in order to complete the login process
   *
   * @example
   *  const Paper = new PaperEmbeddedWalletSdk({clientId: "", chain: "Polygon"});
   *  // sends user an OTP code
   * try {
   *    const { isNewUser } = await Paper.auth.sendPaperEmailLoginOtp({ email : "you@example.com" });
   * } catch(e) {
   *    // Error Sending user's email an OTP code
   *    console.error(e);
   * }
   *
   * // Then when your user is ready to verify their OTP
   * try {
   *    const user = await Paper.auth.verifyPaperEmailLoginOtp({ email: "you@example.com", otp: "6-DIGIT_CODE_HERE", recoveryCode: "Required if user is an existing user. i.e. !isNewUser"});
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
  }: AuthQuerierTypes["sendPaperEmailLoginOtp"]): Promise<SendEmailOtpReturnType> {
    return this.BaseLogin.sendThirdwebEmailLoginOtp({
      email,
    });
  }

  /**
   *  @description
   * Used to verify the otp that the user receives from  Paper
   *
   * See {@link Auth.sendThirdwebEmailLoginOtp} for how the headless call flow looks like. Simply swap out the calls to `loginWithPaperEmailOtp` with `verifyPaperEmailLoginOtp`
   *
   * @param {string} props.email We will send the email an OTP that needs to be entered in order for them to be logged in.
   * @param {string} props.otp The code that the user received in their email
   * @param {string} props.recoveryCode The code that is first sent to the user when they sign up. Required if user is an existing user. i.e. !isNewUser from return params of {@link Auth.sendThirdwebEmailLoginOtp}
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
