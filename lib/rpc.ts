import { Chain, getValidChainRPCs } from "@thirdweb-dev/chains";
import { DASHBOARD_THIRDWEB_CLIENT_ID, RPC_ENV } from "constants/rpc";

export function getDashboardChainRpc(chain: Chain) {
  try {
    const rpcUrl = getValidChainRPCs(chain, DASHBOARD_THIRDWEB_CLIENT_ID)[0];
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
