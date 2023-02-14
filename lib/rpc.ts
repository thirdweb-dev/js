import { Chain, getChainRPC } from "@thirdweb-dev/chains";
import { DASHBOARD_THIRDWEB_API_KEY, RPC_ENV } from "constants/rpc";

const rpcKeys = {
  // fine to be hard-coded for now
  thirdwebApiKey: DASHBOARD_THIRDWEB_API_KEY,
};

export function getDashboardChainRpc(chain: Chain) {
  try {
    const rpcUrl = getChainRPC(chain, rpcKeys);
    // based on the environment hit staging or production
    if (rpcUrl.includes("rpc.thirdweb.com")) {
      return rpcUrl.replace("rpc.thirdweb.com", `${RPC_ENV}.thirdweb.com`);
    }
    return rpcUrl;
  } catch (e) {
    // if this fails we already know there's no possible rpc url available so we should just return an empty string
    return "";
  }
}
