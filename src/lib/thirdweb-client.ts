import { createThirdwebClient, defineChain } from "thirdweb";
import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  PROD_OR_DEV_URL,
} from "../constants/rpc";
import { IPFS_GATEWAY_URL } from "./sdk";

export const thirdwebClient = createThirdwebClient({
  clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
  config: {
    storage: {
      gatewayUrl: IPFS_GATEWAY_URL,
    },
  },
});

export const defineDashboardChain = (chainId: number) => {
  return defineChain({
    id: chainId,
    rpc: `https://${chainId}.rpc.${PROD_OR_DEV_URL}`,
  });
};
