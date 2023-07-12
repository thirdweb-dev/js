import { useMemo } from "react";
import { updateChainRPCs, type Chain } from "@thirdweb-dev/chains";

export function useUpdateChainsWithApiKeys<
  TChains extends Chain[],
  TActiveChain extends
    | Chain
    | TChains[number]["chainId"]
    | TChains[number]["slug"],
>(
  supportedChains: NonNullable<TChains>,
  activeChain: TActiveChain,
  apiKey?: string,
) {
  const keys = useMemo(
    () => ({
      apiKey: apiKey,
    }),
    [apiKey],
  );

  const supportedChainsWithKey = useMemo(() => {
    return supportedChains.map((chain) => updateChainRPCs(chain, keys));
  }, [supportedChains, keys]);

  const activeChainIdOrObjWithKey = useMemo(() => {
    if (
      !activeChain ||
      typeof activeChain === "string" ||
      typeof activeChain === "number"
    ) {
      return activeChain;
    }

    return updateChainRPCs(activeChain, keys);
  }, [activeChain, keys]);

  return [supportedChainsWithKey, activeChainIdOrObjWithKey] as const;
}
