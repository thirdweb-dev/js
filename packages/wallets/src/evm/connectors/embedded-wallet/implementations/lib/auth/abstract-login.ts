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
  loginWithThirdwebModal: undefined | { email: string };
  sendThirdwebEmailLoginOtp: { email: string };
  verifyThirdwebEmailLoginOtp: {
    email: string;
    otp: string;
    recoveryCode?: string;
  };
  injectDeveloperClientId: void;
  getHeadlessGoogleLoginLink: void;
  loginWithGoogle: void;
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

  abstract loginWithModal(args?: MODAL): Promise<AuthLoginReturnType>;
  abstract loginWithEmailOtp(args: EMAIL_MODAL): Promise<AuthLoginReturnType>;
  abstract loginWithGoogle(args?: {
    openedWindow?: Window | null;
    closeOpenedWindow?: (openedWindow: Window) => void;
  }): Promise<AuthLoginReturnType>;

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

  abstract verifyEmailLoginOtp(
    args: EMAIL_VERIFICATION,
  ): Promise<AuthLoginReturnType>;
}
