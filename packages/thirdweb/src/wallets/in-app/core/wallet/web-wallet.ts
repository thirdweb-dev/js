import type { Account } from "../../../interfaces/wallet.js";
import type {
  AuthResultAndRecoveryCode,
  GetUser,
} from "../authentication/types.js";

/**
 *
 */
export interface IWebWallet {
  postWalletSetUp(authResult: AuthResultAndRecoveryCode): Promise<void>;
  getUserWalletStatus(): Promise<GetUser>;
  getAccount(): Promise<Account>;
}
