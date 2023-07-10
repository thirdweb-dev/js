import { updateChainRPCs } from "../../core/utils/updateChainRpcs";
import { useMemo } from "react";
import type { Chain } from "@thirdweb-dev/chains";

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
  /**
   * @deprecated Use `apiKey` instead
   */
  thirdwebApiKey?: string,
  alchemyApiKey?: string,
  infuraApiKey?: string,
) {
  const keys = useMemo(
    () => ({
      apiKey: apiKey,
      thirdwebApiKey: thirdwebApiKey,
      alchemyApiKey: alchemyApiKey,
      infuraApiKey: infuraApiKey,
    }),
    [apiKey, thirdwebApiKey, alchemyApiKey, infuraApiKey],
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
