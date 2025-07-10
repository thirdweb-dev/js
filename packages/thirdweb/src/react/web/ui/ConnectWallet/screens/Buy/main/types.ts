import type { ChainMetadata } from "../../../../../../../chains/types.js";
import type { GetWalletBalanceResult } from "../../../../../../../wallets/utils/getWalletBalance.js";
import type { TokenInfo } from "../../../../../../core/utils/defaultTokens.js";

export type TransactionCostAndData = {
  token: TokenInfo;
  decimals: number;
  walletBalance: GetWalletBalanceResult;
  transactionValueWei: bigint;
  gasCostWei: bigint;
  chainMetadata: ChainMetadata;
};
