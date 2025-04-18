import { isProd } from "@/constants/env";
import { defineDashboardChain } from "lib/defineDashboardChain";
import type { ThirdwebClient } from "thirdweb";
import { type ChainMetadata, getRpcUrlForChain } from "thirdweb/chains";
import { hostnameEndsWith } from "../utils/url";

export function getDashboardChainRpc(
  chainId: number,
  dashboardChain: ChainMetadata | undefined,
  client: ThirdwebClient,
) {
  try {
    const rpcUrl = getRpcUrlForChain({
      // eslint-disable-next-line no-restricted-syntax
      chain: defineDashboardChain(chainId, dashboardChain),
      client,
    });
    // based on the environment hit dev or production
    if (hostnameEndsWith(rpcUrl, "rpc.thirdweb.com")) {
      if (!isProd) {
        return rpcUrl.replace("rpc.thirdweb.com", "rpc.thirdweb-dev.com");
      }
    }
    return rpcUrl;
  } catch {
    // if this fails we already know there's no possible rpc url available so we should just return an empty string
    return "";
  }
}
