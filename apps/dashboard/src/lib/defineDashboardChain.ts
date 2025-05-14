import { defineChain } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { PROD_OR_DEV_URL } from "../@/constants/env-utils";
import { mapV4ChainToV5Chain } from "../contexts/map-chains";

export function defineDashboardChain(
  chainId: number,
  dashboardChain: ChainMetadata | undefined,
) {
  if (dashboardChain) {
    // eslint-disable-next-line no-restricted-syntax
    return mapV4ChainToV5Chain(dashboardChain);
  }

  // eslint-disable-next-line no-restricted-syntax
  return defineChain({
    id: chainId,
    rpc: `https://${chainId}.rpc.${PROD_OR_DEV_URL}`,
  });
}
