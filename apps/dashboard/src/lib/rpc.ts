import { type Chain, getValidChainRPCs } from "@thirdweb-dev/chains";
import { DASHBOARD_THIRDWEB_CLIENT_ID, isProd } from "constants/rpc";
import { hostnameEndsWith } from "../utils/url";

export function getDashboardChainRpc(chain: Chain) {
  try {
    const rpcUrl = getValidChainRPCs(
      chain,
      DASHBOARD_THIRDWEB_CLIENT_ID,
      "http",
    )[0];
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
