import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
} from "../../interfaces/Auth";
import { AbstractLogin } from "./AbstractLogin";

export class BaseLogin extends AbstractLogin<
  {
    getRecoveryCode: (userWalletId: string) => Promise<string | undefined>;
  },
  { email: string; recoveryCode?: string },
  { email: string; otp: string; recoveryCode?: string }
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
  override async loginWithPaperThirdwebOtp({
    email,
    recoveryCode,
  }: {
    email: string;
    recoveryCode?: string | undefined;
  }): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithThirdwebModal",
      params: { email, recoveryCode },
      showIframe: true,
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
      },
    });
    return this.postLogin(result);
  }
  override async verifyPaperEmailLoginOtp({
    email,
    otp,
    recoveryCode,
  }: {
    email: string;
    otp: string;
    recoveryCode?: string | undefined;
  }): Promise<AuthLoginReturnType> {
    const result = await this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "verifyThirdwebEmailLoginOtp",
      params: { email, otp, recoveryCode },
      injectRecoveryCode: {
        isInjectRecoveryCode: true,
      },
    });
    return this.postLogin(result);
  }
}
