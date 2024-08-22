import type { SocialAuthOption } from "../../../../wallets/types.js";
import type { Account } from "../../../interfaces/wallet.js";
import type {
  AuthLoginReturnType,
  AuthStoredTokenWithCookieReturnType,
  GetUser,
  LogoutReturnType,
  MultiStepAuthArgsType,
  PreAuthArgsType,
  SingleStepAuthArgsType,
} from "../authentication/types.js";

export interface InAppConnector {
  getUser(): Promise<GetUser>;
  getAccount(): Promise<Account>;
  preAuthenticate(args: PreAuthArgsType): Promise<void>;
  // Authenticate generates an auth token, when redirecting it returns void as the user is redirected to a new page and the token is stored in the callback url
  authenticateWithRedirect?(
    strategy: SocialAuthOption,
    mode?: "redirect" | "popup" | "window",
    redirectUrl?: string,
  ): void;
  // Login takes an auth token and connects a user with it
  loginWithAuthToken?(
    authResult: AuthStoredTokenWithCookieReturnType,
  ): Promise<AuthLoginReturnType>;
  // Authenticate generates an auth token but does not log the user in
  authenticate(
    args: MultiStepAuthArgsType | SingleStepAuthArgsType,
  ): Promise<AuthStoredTokenWithCookieReturnType>;
  // Connect is authenticate + login combined
  connect(
    args: MultiStepAuthArgsType | SingleStepAuthArgsType,
  ): Promise<AuthLoginReturnType>;
  logout(): Promise<LogoutReturnType>;
}
