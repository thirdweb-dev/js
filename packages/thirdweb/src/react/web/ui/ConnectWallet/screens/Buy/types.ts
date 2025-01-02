import type { Chain } from "../../../../../../chains/types.js";
import type { Wallet } from "../../../../../../wallets/interfaces/wallet.js";
import type { Account } from "../../../../../../wallets/interfaces/wallet.js";

export type PayerInfo = {
  wallet: Wallet;
  chain: Chain;
  account: Account;
};
