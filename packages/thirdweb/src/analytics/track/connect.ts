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
}) {
  const { client, ecosystem, walletType, walletAddress } = args;
  return track({
    client,
    ecosystem,
    data: {
      source: "connectWallet",
      action: "connect",
      walletType,
      walletAddress,
    },
  });
}
