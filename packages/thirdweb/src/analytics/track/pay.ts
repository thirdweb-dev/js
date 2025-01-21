import type { ThirdwebClient } from "../../client/client.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
import { track } from "./index.js";

/**
 * @internal
 */
export async function trackPayEvent(args: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  event: string;
  walletAddress?: string;
  walletType?: string;
  fromToken?: string;
  fromAmount?: string;
  toToken?: string;
  toAmount?: string;
  chainId?: number;
  dstChainId?: number;
  error?: string;
}) {
  return track({
    client: args.client,
    ecosystem: args.ecosystem,
    data: {
      source: "pay",
      action: args.event,
      clientId: args.client.clientId,
      chainId: args.chainId,
      walletAddress: args.walletAddress,
      walletType: args.walletType,
      tokenAddress: args.fromToken,
      amountWei: args.fromAmount,
      dstTokenAddress: args.toToken,
      dstChainId: args.chainId,
      errorCode: args.error,
    },
  });
}
