import type { ApproveParams } from "../../extensions/erc20/write/approve.js";
import type { BaseTransactionOptions } from "../../transaction/types.js";

export type QuoteTokenInfo = {
  chainId: number;
  tokenAddress: string;
  decimals: number;
  priceUSDCents: number;
  name?: string;
  symbol?: string;
};

export type QuoteApprovalInfo = {
  chainId: number;
  tokenAddress: string;
  spenderAddress: string;
  amountWei: string;
};

export type QuotePaymentToken = {
  token: QuoteTokenInfo;
  amountWei: string;
  amount: string;
  amountUSDCents: number;
};

/**
 * @buyCrypto
 */
export type QuoteApprovalParams = BaseTransactionOptions<ApproveParams>;
