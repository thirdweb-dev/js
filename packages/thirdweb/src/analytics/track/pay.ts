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
  amountWei?: string;
  chainId?: number;
  toToken?: string;
  toChainId?: number;
  error?: string;
}) {
  const data = {
    action: args.event,
    amountWei: args.amountWei,
    chainId: args.chainId,
    clientId: args.client.clientId,
    dstChainId: args.toChainId,
    dstTokenAddress: args.toToken,
    errorCode: args.error,
    source: "pay",
    tokenAddress: args.fromToken,
    walletAddress: args.walletAddress,
    walletType: args.walletType,
  };
  return track({
    client: args.client,
    data,
    ecosystem: args.ecosystem,
  });
}
