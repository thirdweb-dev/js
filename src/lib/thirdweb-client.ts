import { createThirdwebClient, defineChain } from "thirdweb";
import {
  DASHBOARD_THIRDWEB_CLIENT_ID,
  PROD_OR_DEV_URL,
} from "../constants/rpc";
import { IPFS_GATEWAY_URL } from "./sdk";
import { useSupportedChainsRecord } from "../hooks/chains/configureChains";
import { Chain } from "@thirdweb-dev/chains";

export const thirdwebClient = createThirdwebClient({
  clientId: DASHBOARD_THIRDWEB_CLIENT_ID,
  config: {
    storage: {
      gatewayUrl: IPFS_GATEWAY_URL,
    },
  },
});

export const defineDashboardChain = (
  chainId: number,
  dashboardChain?: Chain,
) => {
  return defineChain({
    id: chainId,
    rpc:
      dashboardChain?.rpc?.[0] || `https://${chainId}.rpc.${PROD_OR_DEV_URL}`,
    slug: dashboardChain?.slug,
    nativeCurrency: dashboardChain?.nativeCurrency,
  });
};

export function useV5DashboardChain(chainId: number) {
  const configuredChainsRecord = useSupportedChainsRecord();
  let configuedChain = undefined;
  if (chainId in configuredChainsRecord) {
    configuedChain = configuredChainsRecord[chainId as number];
  }
  return defineDashboardChain(chainId, configuedChain);
}
