import type { Chain } from "@thirdweb-dev/chains";
import { defineChain } from "thirdweb";
import { PROD_OR_DEV_URL } from "../constants/rpc";
import { useSupportedChainsRecord } from "../hooks/chains/configureChains";

export function defineDashboardChain(chainId: number, dashboardChain?: Chain) {
  return defineChain({
    id: chainId,
    rpc:
      dashboardChain?.rpc?.[0] || `https://${chainId}.rpc.${PROD_OR_DEV_URL}`,
    slug: dashboardChain?.slug,
    nativeCurrency: dashboardChain?.nativeCurrency,
  });
}

export function useV5DashboardChain(chainId: number) {
  const configuredChainsRecord = useSupportedChainsRecord();
  let configuedChain = undefined;
  if (chainId in configuredChainsRecord) {
    configuedChain = configuredChainsRecord[chainId as number];
  }
  return defineDashboardChain(chainId, configuedChain);
}
