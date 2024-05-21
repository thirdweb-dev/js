import type { Account } from "../../../interfaces/wallet.js";
import type {
  AuthArgsType,
  AuthLoginReturnType,
  GetUser,
  LogoutReturnType,
  PreAuthArgsType,
  SendEmailOtpReturnType,
} from "../authentication/type.js";

export interface InAppConnector {
  getUser(): Promise<GetUser>;
  getAccount(): Promise<Account>;
  preAuthenticate(args: PreAuthArgsType): Promise<SendEmailOtpReturnType>;
  authenticate(args: AuthArgsType): Promise<AuthLoginReturnType>;
  logout(): Promise<LogoutReturnType>;
}
