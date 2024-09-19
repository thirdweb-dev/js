import type { Account } from "../../../interfaces/wallet.js";
import type {
  GetUser,
  SetUpWalletRpcReturnType,
  WalletAddressObjectType,
} from "../../core/authentication/types.js";

export type PostWalletSetup = (
  | SetUpWalletRpcReturnType
  | WalletAddressObjectType
) & {
  walletUserId: string;
  authToken: string;
};

/**
 *
 */
export interface IWebWallet {
  postWalletSetUp(args: PostWalletSetup): Promise<WalletAddressObjectType>;
  getUserWalletStatus(): Promise<GetUser>;
  getAccount(): Promise<Account>;
}
