import type { ThirdwebClient } from "../../client/client.js";
import type { Ecosystem } from "../../wallets/in-app/core/wallet/types.js";
import { track } from "./index.js";

/**
 * @internal
 */
export async function trackConnect(args: {
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  walletType: string;
  walletAddress: string;
  chainId?: number;
}) {
  const { client, ecosystem, walletType, walletAddress, chainId } = args;
  return track({
    client,
    data: {
      action: "connect",
      chainId,
      source: "connectWallet",
      walletAddress,
      walletType,
    },
    ecosystem,
  });
}
