import type {
  AuthAndWalletRpcReturnType,
  AuthLoginReturnType,
} from "../../../core/authentication/types.js";
import { AbstractLogin, type LoginQuerierTypes } from "./abstract-login.js";

/**
 *
 */
export class BaseLogin extends AbstractLogin<
  void,
  { email: string },
  { email: string; otp: string; recoveryCode?: string }
> {
  async authenticateWithModal(): Promise<AuthAndWalletRpcReturnType> {
    return this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithThirdwebModal",
      params: undefined,
      showIframe: true,
    });
  }

  /**
   * @internal
   */
  override async loginWithModal(): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.authenticateWithModal();
    return this.postLogin(result);
  }

  async authenticateWithIframe({
    email,
  }: {
    email: string;
  }): Promise<AuthAndWalletRpcReturnType> {
    return this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithThirdwebModal",
      params: { email },
      showIframe: true,
    });
  }

  /**
   * @internal
   */
  override async loginWithIframe({
    email,
  }: {
    email: string;
  }): Promise<AuthLoginReturnType> {
    await this.preLogin();
    const result = await this.authenticateWithIframe({ email });
    return this.postLogin(result);
  }

  async authenticateWithCustomJwt({
    encryptionKey,
    jwt,
  }: LoginQuerierTypes["loginWithCustomJwt"]): Promise<AuthAndWalletRpcReturnType> {
    if (!encryptionKey || encryptionKey.length === 0) {
      throw new Error("Encryption key is required for custom jwt auth");
    }

    return this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithCustomJwt",
      params: { encryptionKey, jwt },
    });
  }

  /**
   * @internal
   */
  override async loginWithCustomJwt({
    encryptionKey,
    jwt,
  }: LoginQuerierTypes["loginWithCustomJwt"]): Promise<AuthLoginReturnType> {
    if (!encryptionKey || encryptionKey.length === 0) {
      throw new Error("Encryption key is required for custom jwt auth");
    }

    await this.preLogin();
    const result = await this.authenticateWithCustomJwt({ encryptionKey, jwt });
    return this.postLogin(result);
  }

  async authenticateWithCustomAuthEndpoint({
    encryptionKey,
    payload,
  }: LoginQuerierTypes["loginWithCustomAuthEndpoint"]): Promise<AuthAndWalletRpcReturnType> {
    return this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "loginWithCustomAuthEndpoint",
      params: { encryptionKey, payload },
    });
  }

  /**
   * @internal
   */
  override async loginWithCustomAuthEndpoint({
    encryptionKey,
    payload,
  }: LoginQuerierTypes["loginWithCustomAuthEndpoint"]): Promise<AuthLoginReturnType> {
    if (!encryptionKey || encryptionKey.length === 0) {
      throw new Error("Encryption key is required for custom auth");
    }

    await this.preLogin();
    const result = await this.authenticateWithCustomAuthEndpoint({
      encryptionKey,
      payload,
    });
    return this.postLogin(result);
  }

  async authenticateWithEmailOtp({
    email,
    otp,
    recoveryCode,
  }: LoginQuerierTypes["verifyThirdwebEmailLoginOtp"]): Promise<AuthAndWalletRpcReturnType> {
    return this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "verifyThirdwebEmailLoginOtp",
      params: { email, otp, recoveryCode },
    });
  }

  /**
   * @internal
   */
  override async loginWithEmailOtp({
    email,
    otp,
    recoveryCode,
  }: LoginQuerierTypes["verifyThirdwebEmailLoginOtp"]): Promise<AuthLoginReturnType> {
    const result = await this.authenticateWithEmailOtp({
      email,
      otp,
      recoveryCode,
    });
    return this.postLogin(result);
  }

  async authenticateWithSmsOtp({
    phoneNumber,
    otp,
    recoveryCode,
  }: LoginQuerierTypes["verifyThirdwebSmsLoginOtp"]): Promise<AuthAndWalletRpcReturnType> {
    return this.LoginQuerier.call<AuthAndWalletRpcReturnType>({
      procedureName: "verifyThirdwebSmsLoginOtp",
      params: { phoneNumber, otp, recoveryCode },
    });
  }

  /**
   * @internal
   */
  override async loginWithSmsOtp({
    phoneNumber,
    otp,
    recoveryCode,
  }: LoginQuerierTypes["verifyThirdwebSmsLoginOtp"]): Promise<AuthLoginReturnType> {
    const result = await this.authenticateWithSmsOtp({
      phoneNumber,
      otp,
      recoveryCode,
    });
    return this.postLogin(result);
  }
}
