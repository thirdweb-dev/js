import { thirdwebClient } from "@/constants/client";
import { isProd } from "constants/rpc";
import { defineChain, getRpcUrlForChain } from "thirdweb/chains";
import { hostnameEndsWith } from "../utils/url";

export function getDashboardChainRpc(chainId: number) {
  try {
    const rpcUrl = getRpcUrlForChain({
      chain: defineChain(chainId),
      client: thirdwebClient,
    });
    // based on the environment hit dev or production
    if (hostnameEndsWith(rpcUrl, "rpc.thirdweb.com")) {
      if (!isProd) {
        return rpcUrl.replace("rpc.thirdweb.com", "rpc.thirdweb-dev.com");
      }
    }
    return rpcUrl;
  } catch (e) {
    // if this fails we already know there's no possible rpc url available so we should just return an empty string
    return "";
  }
}
