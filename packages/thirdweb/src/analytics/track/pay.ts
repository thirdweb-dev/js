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
    source: "pay",
    action: args.event,
    clientId: args.client.clientId,
    chainId: args.chainId,
    walletAddress: args.walletAddress,
    walletType: args.walletType,
    tokenAddress: args.fromToken,
    amountWei: args.amountWei,
    dstTokenAddress: args.toToken,
    dstChainId: args.toChainId,
    errorCode: args.error,
  };
  return track({
    client: args.client,
    ecosystem: args.ecosystem,
    data,
  });
}
