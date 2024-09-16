import type { ThirdwebClient } from "../client/client.js";
import { getClientFetch } from "../utils/fetch.js";

const ANALYTICS_ENDPOINT = "https://c.thirdweb.com/event";

/**
 * @internal
 */
export function trackConnect(args: {
  client: ThirdwebClient;
  walletType: string;
  walletAddress: string;
}) {
  const { client, walletType, walletAddress } = args;
  track(client, {
    source: "connectWallet",
    action: "connect",
    walletType,
    walletAddress,
  });
}

/**
 * @internal
 */
export function trackPayEvent(args: {
  client: ThirdwebClient;
  event: string;
  walletAddress?: string;
  walletType?: string;
  fromToken?: string;
  fromAmount?: string;
  toToken?: string;
  toAmount?: string;
  chainId?: number;
  dstChainId?: number;
}) {
  track(args.client, {
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
  });
}

/**
 * @internal
 */
function track(client: ThirdwebClient, data: object) {
  const fetch = getClientFetch(client);

  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(data, (_key, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    }),
  });
}
