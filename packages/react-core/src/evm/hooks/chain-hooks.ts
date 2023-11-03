import { useMemo } from "react";
import type { Chain } from "@thirdweb-dev/chains";
import { updateChainRPCs } from "@thirdweb-dev/chains/utils";

export function useUpdateChainsWithClientId<
  TChains extends Chain[],
  TActiveChain extends
    | Chain
    | TChains[number]["chainId"]
    | TChains[number]["slug"],
>(
  supportedChains: NonNullable<TChains>,
  activeChain: TActiveChain,
  clientId?: string,
) {
  const supportedChainsWithKey = useMemo(() => {
    return supportedChains.map((chain) => updateChainRPCs(chain, clientId));
  }, [supportedChains, clientId]);

  const activeChainIdOrObjWithKey = useMemo(() => {
    if (
      !activeChain ||
      typeof activeChain === "string" ||
      typeof activeChain === "number"
    ) {
      return activeChain;
    }

    return updateChainRPCs(activeChain, clientId);
  }, [activeChain, clientId]);

  return [supportedChainsWithKey, activeChainIdOrObjWithKey] as const;
}
