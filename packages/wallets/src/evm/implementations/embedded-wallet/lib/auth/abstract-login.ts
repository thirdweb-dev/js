import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
} from "../../interfaces/auth";
import type {
  ClientIdWithQuerierType,
  SendEmailOtpReturnType,
} from "../../interfaces/embedded-wallets/embedded-wallets";
import type { EmbeddedWalletIframeCommunicator } from "../../utils/iFrameCommunication/EmbeddedWalletIframeCommunicator";

type LoginQuerierTypes = {
  loginWithModal: undefined | { email: string };
  loginWithGoogle: undefined;
  sendEmailLoginOtp: { email: string };
  verifyEmailLoginOtp: {
    email: string;
    otp: string;
  };
};

export abstract class AbstractLogin<
  MODAL = void,
  EMAIL_MODAL extends { email: string } = { email: string },
  EMAIL_VERIFICATION extends { email: string; otp: string } = {
    email: string;
    otp: string;
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

  abstract loginWithModal(args?: MODAL): Promise<AuthLoginReturnType>;
  abstract loginWithEmailOtp(args: EMAIL_MODAL): Promise<AuthLoginReturnType>;

  abstract loginWithGoogle(): Promise<AuthLoginReturnType>;

  async sendEmailLoginOtp({
    email,
  }: LoginQuerierTypes["sendEmailLoginOtp"]): Promise<SendEmailOtpReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<SendEmailOtpReturnType>({
      procedureName: "sendEmailLoginOtp",
      params: { email },
    });
    return result;
  }

  abstract verifyEmailLoginOtp(
    args: EMAIL_VERIFICATION,
  ): Promise<AuthLoginReturnType>;
}
