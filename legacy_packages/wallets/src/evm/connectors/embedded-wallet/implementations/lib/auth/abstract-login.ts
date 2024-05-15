import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  AuthProvider,
} from "../../interfaces/auth";
import type {
  ClientIdWithQuerierType,
  SendEmailOtpReturnType,
} from "../../interfaces/embedded-wallets/embedded-wallets";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";

export type LoginQuerierTypes = {
  loginWithCustomAuthEndpoint: { payload: string; encryptionKey: string };
  loginWithCustomJwt: { jwt: string; encryptionKey?: string };
  loginWithThirdwebModal: undefined | { email: string };
  sendThirdwebSmsLoginOtp: { phoneNumber: string };
  sendThirdwebEmailLoginOtp: { email: string };
  verifyThirdwebEmailLoginOtp: {
    email: string;
    otp: string;
    recoveryCode?: string;
  };
  verifyThirdwebSmsLoginOtp: {
    phoneNumber: string;
    otp: string;
    recoveryCode?: string;
  };
  injectDeveloperClientId: void;
  getHeadlessOauthLoginLink: { authProvider: AuthProvider };
};

type OauthLoginType = {
  openedWindow?: Window | null;
  closeOpenedWindow?: (openedWindow: Window) => void;
};

export abstract class AbstractLogin<
  MODAL = void,
  EMAIL_MODAL extends { email: string } = { email: string },
  EMAIL_VERIFICATION extends { email: string; otp: string } = {
    email: string;
    otp: string;
    recoveryCode?: string;
  },
> {
  protected LoginQuerier: EmbeddedWalletIframeCommunicator<LoginQuerierTypes>;
  protected preLogin;
  protected postLogin: (
    authResults: AuthAndWalletRpcReturnType,
  ) => Promise<AuthLoginReturnType>;
  protected clientId;
  /**
   * Used to manage the user's auth states. This should not be instantiated directly.
   * Call {@link EmbeddedWalletSdk.auth} instead.
   *
   */
  constructor({
    querier,
    preLogin,
    postLogin,
    clientId,
  }: ClientIdWithQuerierType & {
    preLogin: () => Promise<void>;
    postLogin: (
      authDetails: AuthAndWalletRpcReturnType,
    ) => Promise<AuthLoginReturnType>;
  }) {
    this.LoginQuerier = querier;
    this.preLogin = preLogin;
    this.postLogin = postLogin;
    this.clientId = clientId;
  }

  abstract loginWithCustomJwt(args: {
    jwt: string;
    encryptionKey: string;
  }): Promise<AuthLoginReturnType>;
  abstract loginWithCustomAuthEndpoint(args: {
    payload: string;
    encryptionKey: string;
  }): Promise<AuthLoginReturnType>;
  abstract loginWithModal(args?: MODAL): Promise<AuthLoginReturnType>;
  abstract loginWithEmailOtp(args: EMAIL_MODAL): Promise<AuthLoginReturnType>;
  abstract loginWithOauth(
    args: OauthLoginType & { oauthProvider: AuthProvider },
  ): Promise<AuthLoginReturnType>;

  async sendEmailLoginOtp({
    email,
  }: LoginQuerierTypes["sendThirdwebEmailLoginOtp"]): Promise<SendEmailOtpReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<SendEmailOtpReturnType>({
      procedureName: "sendThirdwebEmailLoginOtp",
      params: { email },
    });
    return result;
  }
  async sendSmsLoginOtp({
    phoneNumber,
  }: LoginQuerierTypes["sendThirdwebSmsLoginOtp"]): Promise<SendEmailOtpReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<SendEmailOtpReturnType>({
      procedureName: "sendThirdwebSmsLoginOtp",
      params: { phoneNumber },
    });
    return result;
  }

  abstract verifyEmailLoginOtp(
    args: EMAIL_VERIFICATION,
  ): Promise<AuthLoginReturnType>;
  abstract verifySmsLoginOtp(args: {
    phoneNumber: string;
    otp: string;
    recoveryCode?: string;
  }): Promise<AuthLoginReturnType>;
}
