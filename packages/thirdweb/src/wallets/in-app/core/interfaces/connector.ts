import type { SocialAuthOption } from "../../../../wallets/types.js";
import type { Account } from "../../../interfaces/wallet.js";
import type {
  AuthArgsType,
  AuthLoginReturnType,
  AuthStoredTokenWithCookieReturnType,
  GetUser,
  LogoutReturnType,
  PreAuthArgsType,
  SendEmailOtpReturnType,
} from "../authentication/type.js";

export interface InAppConnector {
  getUser(): Promise<GetUser>;
  getAccount(): Promise<Account>;
  preAuthenticate(args: PreAuthArgsType): Promise<SendEmailOtpReturnType>;
  authenticateWithRedirect?(strategy: SocialAuthOption): void;
  loginWithAuthToken?(
    authResult: AuthStoredTokenWithCookieReturnType,
  ): Promise<AuthLoginReturnType>;
  authenticate(args: AuthArgsType): Promise<AuthLoginReturnType>;
  logout(): Promise<LogoutReturnType>;
}
