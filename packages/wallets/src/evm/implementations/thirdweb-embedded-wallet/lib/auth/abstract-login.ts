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

  /**
   * Used to manage the user's auth states. This should not be instantiated directly.
   * Call {@link ThirdwebEmbeddedWalletSdk.auth} instead.
   *
   */
  constructor({
    querier,
    preLogin,
    postLogin,
  }: Omit<ClientIdWithQuerierType, "clientId"> & {
    preLogin: () => Promise<void>;
    postLogin: (
      authDetails: AuthAndWalletRpcReturnType,
    ) => Promise<AuthLoginReturnType>;
  }) {
    this.LoginQuerier = querier;
    this.preLogin = preLogin;
    this.postLogin = postLogin;
  }

  abstract loginWithThirdwebModal(args?: MODAL): Promise<AuthLoginReturnType>;
  abstract loginWithPaperThirdwebOtp(
    args: EMAIL_MODAL,
  ): Promise<AuthLoginReturnType>;

  async sendThirdwebEmailLoginOtp({
    email,
  }: LoginQuerierTypes["sendThirdwebEmailLoginOtp"]): Promise<SendEmailOtpReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<SendEmailOtpReturnType>({
      procedureName: "sendThirdwebEmailLoginOtp",
      params: { email },
    });
    return result;
  }

  abstract verifyPaperEmailLoginOtp(
    args: EMAIL_VERIFICATION,
  ): Promise<AuthLoginReturnType>;
}
