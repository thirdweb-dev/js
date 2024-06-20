import type { ThirdwebClient } from "../../../../../client/client.js";
import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
  AuthProvider,
  SendEmailOtpReturnType,
} from "../../../core/authentication/type.js";
import type { ClientIdWithQuerierType, Ecosystem } from "../../types.js";
import type { InAppWalletIframeCommunicator } from "../../utils/iFrameCommunication/InAppWalletIframeCommunicator.js";

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
  injectDeveloperClientId: undefined;
  getHeadlessOauthLoginLink: { authProvider: AuthProvider };
};

type OauthLoginType = {
  openedWindow?: Window | null;
  closeOpenedWindow?: (openedWindow: Window) => void;
};

/**
 * @internal
 */
export abstract class AbstractLogin<
  MODAL = void,
  EMAIL_MODAL extends { email: string } = { email: string },
  EMAIL_VERIFICATION extends { email: string; otp: string } = {
    email: string;
    otp: string;
    recoveryCode?: string;
  },
> {
  protected LoginQuerier: InAppWalletIframeCommunicator<LoginQuerierTypes>;
  protected preLogin;
  protected postLogin: (
    authResults: AuthAndWalletRpcReturnType,
  ) => Promise<AuthLoginReturnType>;
  protected client: ThirdwebClient;
  protected baseUrl: string;
  protected ecosystem?: Ecosystem;

  /**
   * Used to manage the user's auth states. This should not be instantiated directly.
   * @internal
   */
  constructor({
    baseUrl,
    querier,
    preLogin,
    postLogin,
    client,
    ecosystem,
  }: ClientIdWithQuerierType & {
    baseUrl: string;
    preLogin: () => Promise<void>;
    postLogin: (
      authDetails: AuthAndWalletRpcReturnType,
    ) => Promise<AuthLoginReturnType>;
    ecosystem?: Ecosystem;
  }) {
    this.baseUrl = baseUrl;
    this.LoginQuerier = querier;
    this.preLogin = preLogin;
    this.postLogin = postLogin;
    this.client = client;
    this.ecosystem = ecosystem;
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

  /**
   * @internal
   */
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

  /**
   *
   * @internal
   */
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
