import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
} from "../../interfaces/auth";
import { AbstractLogin } from "./abstract-login";

export class BaseLogin extends AbstractLogin<
  {
    getRecoveryCode: (userWalletId: string) => Promise<string | undefined>;
  },
  { email: string },
  { email: string; otp: string }
> {
  override async loginWithThirdwebModal(args?: {
    getRecoveryCode: (userWalletId: string) => Promise<string | undefined>;
  }): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithThirdwebModal",
      params: undefined,
      showIframe: true,
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
        getRecoveryCode: args?.getRecoveryCode,
      },
    });
    return this.postLogin(result);
  }
  override async loginWithThirdwebOtp({
    email,
  }: {
    email: string;
  }): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithThirdwebModal",
      params: { email },
      showIframe: true,
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
      },
    });
    return this.postLogin(result);
  }

  override async verifyThirdwebEmailLoginOtp({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }): Promise<AuthLoginReturnType> {
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "verifyThirdwebEmailLoginOtp",
      params: { email, otp },
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
      },
    });
    return this.postLogin(result);
  }
}
