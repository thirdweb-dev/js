import type { Chain } from "../../../../../../chains/types.js";
import type {
  Account,
  Wallet,
} from "../../../../../../wallets/interfaces/wallet.js";

export type PayerInfo = {
  wallet: Wallet;
  chain: Chain;
  account: Account;
};
